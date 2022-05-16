const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A User must have a name!!'],
    unique: true,
    trim: true,
    minlength: [2, 'A user  name must have at least 2 characters!!'],
    maxlength: [25, 'A user  name can contains maximusm 25 characters!!'],
  },
  email: {
    type: String,
    required: [true, 'A user must have a email id!!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email id!'],
  },
  password: {
    type: String,
    required: [true, 'A user must have a password!!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'A user must have a passwordConfirm!!'],
    validate: {
      //This only works on create and save!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not same!!',
    },
  },
  role: {
    type: String,
    enum: ['admin', 'teacher', 'student'],
    default: 'student',
  },
  createdAT: {
    type: Date,
    default: Date.now(),
  },
  changedPasswordAt: Date,
  forgotPassToken: String,
  forgotPassTokenExpriresIn: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.changedPasswordAt = Date.now() - 1000;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.comparePassword = async function (loginPassword, signupPassword) {
  return await bcrypt.compare(loginPassword, signupPassword);
};

userSchema.methods.changePassAfterTokenIssued = function (timeStamp) {
  if (this.changedPasswordAt) {
    const changePassTime = parseInt(this.changedPasswordAt.getTime() / 1000);
    return timeStamp < changePassTime;
  }

  return false;
};

userSchema.methods.createForgotPassToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.forgotPassToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.forgotPassTokenExpriresIn = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
