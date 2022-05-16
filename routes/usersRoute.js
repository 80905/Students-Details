const express = require('express');
const userController = require('../controllers/usersController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protectStudentRoute);

router.patch('/updatePassword', authController.updatePassword);
router.patch(
  '/updateMyData',
  userController.uploadUserPhoto,
  userController.resizeUplodedPhoto,
  userController.updateMe
);
router.delete('/deleteMe', userController.deleteMe);

router.route('/me').get(userController.getMe, userController.getUser);

router.use(authController.restrictedTo('admin', 'teacher'));

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
