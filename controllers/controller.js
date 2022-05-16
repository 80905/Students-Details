const multer = require('multer');
const sharp = require('sharp');
const Student = require('../models/studentsModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadSchoolPhoto = upload.array('images', 2);

exports.resizeUplodedPhoto = catchAsync(async (req, res, next) => {
  if (!req.files) return next();

  req.body.images = [];

  await Promise.all(
    req.files.map(async (file, i) => {
      const filename = `school-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/images/schoolsImages/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.top5Students = catchAsync(async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-scoreCard';
  req.query.fields = 'name,class,scoreCard,age';
  next();
});

exports.getAllStudents = factory.getAll(Student);
exports.getStudent = factory.getOne(Student, { path: 'reviews' });
exports.createStudent = factory.createOne(Student);
exports.updateStudent = factory.updateOne(Student);
exports.deleteStudent = factory.deleteOne(Student);

//1)METHOD-Here we are creating data base for New student

// const newStudent = new Student({
//   name: 'Rajkumar Kumar singh',
//   father: 'Mahendra singh',
//   age: 21,
// });

// newStudent
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR:', err);
//   });

// const catchErr = (res, statusCode, err) => {
//   res.status(statusCode).json({
//     status: 'fail',
//     message: err,
//   });
// };

//2)METHOD

// exports.getAllStudents = catchAsync(async (req, res, next) => {
//   let query = Student.find(req.query);

//   //SORTing data
//   if (req.query.sort) {
//     const sortBy = req.query.sort.split(',').join(' ');
//     query = query.sort(sortBy);
//   } else {
//     query = query.sort('createdAt');
//   }

//   //SELECTing data
//   if (req.query.select) {
//     const selectBy = req.query.select.split(',').join(' ');
//     query = query.select(selectBy);
//   } else {
//     query = query.select('-__v');
//   }

//   // Adding PAGination
//   const page = req.query.page * 1 || 1;
//   const limit = req.query.limit * 1 || 100;
//   const skip = (page - 1) * limit;
//   query = query.skip(skip).limit(limit);

//   const students = await query;

//   res.status(200).json({
//     status: 'success',
//     results: students.length,
//     data: {
//       students,
//     },
//   });
// });

// exports.createStudent = catchAsync(async (req, res, next) => {
//   const newStudent = await Student.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       student: newStudent,
//     },
//   });
// });

// exports.getStudent = catchAsync(async (req, res, next) => {
//   const student = await Student.findById(req.params.id).populate('reviews');

//   if (!student) {
//     return next(new AppError('Student not found on this id!!', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       student,
//     },
//   });
// });

// exports.updateStudent = catchAsync(async (req, res, next) => {
//   const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });

//   if (!student) {
//     return next(new AppError('Student not found on this id!!', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       student,
//     },
//   });
// });

// exports.deleteStudent = async (req, res, next) => {
//   const student = await Student.findByIdAndDelete(req.params.id);

//   if (!student) {
//     return next(new AppError('Student not found on this id!!', 404));
//   }

//   res.status(204).json({
//     status: 'success',
//     data: {
//       student,
//     },
//   });
// };

// //GET 127.0.0.1:8000/person/?name=akhilesh&age=26
// exports.getQuery = (req, res) => {
//   console.log(req.query);
//   let { name, age, education } = req.query;

//   res.status(200).json({
//     status: 'success',
//     data: {
//       name,
//       age,
//       education,
//     },
//   });
// };

// //GET  127.0.0.1:8000/person/akhilesh/26
// exports.getParams = (req, res) => {
//   console.log(req.params);
//   let { name, age } = req.params;

//   res.status(200).json({
//     status: 'success',
//     data: {
//       name,
//       age,
//     },
//   });
// };

//POST 127.0.0.1:8000
// exports.getBody = (req, res) => {
//   console.log(req.body);
//   let name = req.body.name;
//   let age = req.body.age;

//   if (!name && !age)
//     res.status(404).json({
//       status: 'fail',
//       message: ' ERROR : Please provide the name and age!!',
//     });

//   res.status(200).json({
//     status: 'success',
//     data: {
//       name,
//       age,
//     },
//   });
// };
