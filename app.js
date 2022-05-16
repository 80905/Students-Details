/*const fs = require('fs');

console.log('Hello World!!');

//Writting file in synchronous ways
// fs.writeFileSync(
//   'txt/outPut.txt',
//   `Hello this is revision class. I have learnt a lot of things but still have to recape.`
// );

//Reading file  in synchronous ways
// const inputText = fs.readFileSync('txt/input.txt', 'utf-8');
//console.log(inputText);
console.log('This is just biggining');

//Asynchronous ways of reading and writting the files

fs.writeFile('txt/outPut.txt', 'Be the ways you are no can make you as they wanted', 'utf-8', (err) => {
  console.log(err);
});

fs.readFile(`txt/outPut.txt`, 'utf-8', (err, data) => {
  console.log(data);
});
*/
//const path = require('path');
const express = require('express');
const helmet = require('helmet');
const logger = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();

//Setting up EJS templatte
app.set('view engine', 'ejs');
//app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));

const router = require('./routes/route');
const userRouter = require('./routes/usersRoute');
const reviewRouter = require('./routes/reviewsRoute');
const viewRouter = require('./routes/viewsRoute');

const AppError = require('./utils/appError');
const globalErrHandler = require('./controllers/errorController');

//Global middlewares

//Set security http headers
app.use(helmet());

//Here we are limiting the request of client on the server that will be 100 request per hour
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests on this IP !!.Please try again after an hour.',
});
app.use('/api', limiter); //Making the limiter global middleware

app.use(express.json({ limit: '10kb' })); //This one is use for json data

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//HPP parameter pollution
app.use(
  hpp({
    whitelist: ['class', 'age', 'gender', 'scoreCard'],
  })
);

//app.use(express.urlencoded({ extended: true })); //This is use for form data that is created by the help of html which is in public directory

//app.use(express.static(`${__dirname}/public`));

app.use('/', viewRouter);
app.use('/api/v1/students', router);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this request!!`,
  // });
  // next();
  //-------------------OR________________________________________________
  // const err = new Error(`Can't find ${req.originalUrl} on this request!!`);
  // err.statusCode = 404;
  // err.status = 'fail';
  // next(err);
  //-----------------------OR____________________________________________
  next(new AppError(`Can't find ${req.originalUrl} on this request!!`, 404));
});

//Global Error Handler
app.use(globalErrHandler);

module.exports = app;
