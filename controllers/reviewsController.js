const Review = require('../models/reviewsModel');
const factory = require('./handlerFactory');

exports.createNestedRoute = (req, res, next) => {
  if (!req.body.school) req.body.school = req.params.studentId;
  req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.studentId) filter = { school: req.params.studentId };

//   const reviews = await Review.find(filter);
//   // let query = Model.find(req.query);

//   // //SORTing data
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(',').join(' ');
//   //   query = query.sort(sortBy);
//   // } else {
//   //   query = query.sort('createdAt');
//   // }

//   // //SELECTing data
//   // if (req.query.select) {
//   //   const selectBy = req.query.select.split(',').join(' ');
//   //   query = query.select(selectBy);
//   // } else {
//   //   query = query.select('-__v');
//   // }

//   // // Adding PAGination
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 100;
//   // const skip = (page - 1) * limit;
//   // query = query.skip(skip).limit(limit);

//   //const doc = await query;

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       data: reviews,
//     },
//   });
// });
