const express = require('express');
const controller = require('../controllers/controller');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewsRoute');

const router = express.Router();

router.use('/:studentId/reviews', reviewRouter);

router.route('/top-5-students').get(controller.top5Students, controller.getAllStudents);

router
  .route('/')
  .get(authController.protectStudentRoute, authController.restrictedTo('admin', 'teacher'), controller.getAllStudents)
  .post(authController.protectStudentRoute, authController.restrictedTo('admin', 'teacher'), controller.createStudent);

router
  .route('/:id')
  .get(controller.getStudent)
  .patch(
    authController.protectStudentRoute,
    authController.restrictedTo('admin', 'teacher'),
    controller.uploadSchoolPhoto,
    controller.resizeUplodedPhoto,
    controller.updateStudent
  )
  .delete(authController.protectStudentRoute, authController.restrictedTo('admin'), controller.deleteStudent);

module.exports = router;
