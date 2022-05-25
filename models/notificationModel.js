const mongoose = require('mongoose');

const notificationSchem = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    required: [true, 'A notification must have a description!!'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchem);
module.exports = Notification;
