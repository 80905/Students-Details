const Notification = require('../models/notificationModel');
const factory = require('../controllers/handlerFactory');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/email');
const User = require('../models/usersModel');

exports.createNotification = catchAsync(async (req, res, next) => {
  const newNotification = await Notification.create(req.body);

  const url = `${req.protocol}://${req.get('host')}`;

  const users = await User.find();

  await Promise.all(
    users.forEach(async (user) => {
      await new Email(user, url).sendNotification();
    })
  );

  res.status(201).json({
    status: 'success',
    data: {
      notification: newNotification,
    },
  });
});

// exports.createNotification = factory.createOne(Notification);
exports.getAllNotification = factory.getAll(Notification);
exports.deleteNotifications = factory.deleteOne(Notification);
