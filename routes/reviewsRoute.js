const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewsController.getAllReviews)
  .post(
    authController.protectStudentRoute,
    authController.restrictedTo('student'),
    reviewsController.createNestedRoute,
    reviewsController.createReview
  );

router
  .route('/:id')
  .get(reviewsController.getReview)
  .patch(authController.protectStudentRoute, authController.restrictedTo('student'), reviewsController.updateReview)
  .delete(authController.protectStudentRoute, authController.restrictedTo('student'), reviewsController.deleteReview);

module.exports = router;
