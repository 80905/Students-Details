const Student = require('../models/studentsModel');
const catchAsync = require('../utils/catchAsync');

const user = {
  firstName: 'Akhilesh',
  lastName: 'Kumar',
  admin: true,
};

// const posts = [
//   { title: 'Title 1', body: 'Body 1' },
//   { title: 'Title 2', body: 'Body 2' },
//   { title: 'Title 3', body: 'Body 3' },
//   { title: 'Title 4', body: 'Body 4' },
// ];

exports.getHomePage = (req, res) => {
  res.status(200).render('pages/index', {
    user,
    title: 'Home Page',
  });
};

exports.getAllStudents = catchAsync(async (req, res, next) => {
  const students = await Student.find();
  res.status(200).render('pages/students', {
    title: students,

    students,
  });
});

exports.getAbout = (req, res) => {
  res.render('pages/about', {
    title: 'About',
  });
};
