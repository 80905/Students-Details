const mongoose = require('mongoose');

const slugify = require('slugify');
//const Review = require('./reviewsModel');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      trim: true,
      required: [true, 'A student must have a name!!'],
      maxlength: [25, 'A student name must have less than or equal to 25 characters!!'],
      minlength: [2, 'A student name must have more than or equal to 2 characters!!'],
    },
    school: String,
    class: {
      type: Number,
      required: [true, 'A student must have a class!!'],
    },
    gender: {
      type: String,
      required: [true, 'A student must have  a gender!!'],
    },
    age: {
      type: Number,
      required: [true, 'A student must have a vaild age!!'],
    },
    aadhar: {
      type: Number,
      // min: [12, 'Aadhar must have 12 characters!!'],
      //max: [12, 'Aadhar must have 12 characters!!'],
    },
    father: {
      type: String,
      trim: true,
      required: [true, 'A student must have a father name!!'],
    },
    fatherOccupation: {
      type: String,
    },
    mother: {
      type: String,
      trim: true,
      required: [true, 'A student must have a mother name!!'],
    },
    motherOccupation: {
      type: String,
    },
    requiredScore: {
      type: Number,
      default: 60,
    },
    scoreCard: {
      type: Number,
      validate: {
        validator: function (val) {
          return val >= this.requiredScore;
        },
        message: 'Your scoreCard ({VALUE}) is too low ! You can not take the admission!!',
      },
    },
    remark: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    slug: String,
    activeStudent: {
      type: Boolean,
      default: true,
    },
    ratingsAverage: {
      type: Number,
      min: 1,
      max: 5,
      default: 4,
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    images: Array,
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        decription: String,
      },
    ],
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.index({ scoreCard: -1 });
studentSchema.index({ slug: 1 });

studentSchema.virtual('honourScored').get(function () {
  return this.scoreCard > 80 ? true : false;
});

studentSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'school',
  localField: '_id',
});

//Mogoose's Middleware
//1)Documents middleware

studentSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//2)Query Middleware
// studentSchema.pre(/^find/, function (next) {
//   this.find({ activeStudent: { $ne: true } });
//   next();
// });

const Student = mongoose.model('Student', studentSchema);

// const newStudent = new Student({
//   name: 'Vinayak k singh',
//   father: 'jayant singh',
//   age: 10,
// });

// newStudent
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => {
//     console.log('ERROR:', err);
//   });

module.exports = Student;
