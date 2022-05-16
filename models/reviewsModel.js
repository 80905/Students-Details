const mongoose = require('mongoose');
//const User = require('./usersModel');
const Student = require('./studentsModel');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: [true, 'A review must have a comment!!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must beong to  a student !!'],
  },
  school: {
    type: mongoose.Schema.ObjectId,
    ref: 'Student',
    required: [true, 'A review must beong to  a school !!'],
  },
});

reviewSchema.index({ school: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name',
  // }).populate({
  //   path: 'school',
  //   select: 'school',
  // });
  this.populate({
    path: 'user',
    select: 'name',
  });
  next();
});

reviewSchema.statics.calsAvgRatings = async function (schoolId) {
  const avgRating = await this.aggregate([
    {
      $match: { school: schoolId },
    },
    {
      $group: {
        _id: '$school',
        nRating: { $sum: 1 },
        ratingsAvg: { $avg: '$rating' },
      },
    },
  ]);
  console.log(avgRating);
  // await school.findByIdAndUpdate(studentId,avgRating)
  if (avgRating.length > 0) {
    await Student.findByIdAndUpdate(schoolId, {
      ratingsAverage: avgRating[0].ratingsAvg,
      ratingsQuantity: avgRating[0].nRating,
    });
  } else {
    await Student.findByIdAndUpdate(schoolId, {
      ratingsAverage: 4,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calsAvgRatings(this.school);
});

// reviewSchema.pre(/^findOneAnd/, async function (next) {
//   this.r = await this.findOne();
//   console.log(this.r);
//   next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
//   await this.r.constructor.calsAvgRatings(this.r.school);
// });

reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calsAvgRatings(doc.school);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
