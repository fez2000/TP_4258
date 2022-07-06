'use strict';

var mongoose = require('mongoose');
var tuple = require('../schemas/tuple');
var Tuple = tuple.Tuple;

var NotificationSchema = new mongoose.Schema({
  parent: {type: mongoose.Schema.ObjectId, ref: 'Notification'},
  title: {type: String, required: true},
  author: {type: mongoose.Schema.ObjectId, ref: 'User', required: true},
  action: {type: String, required: true},
  object: {type: String, required: true},
  link: {type: String, required: true},
  level: {type: String, required: true, default: 'transient'},
  timestamps: {
    creation: {type: Date, default: Date.now}
  },
  read: {type: Boolean, default: false},
  target: {type: [Tuple], validate: [tuple.validateTargetTuples, 'Bad targets']},
  data: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('Notification', NotificationSchema);
