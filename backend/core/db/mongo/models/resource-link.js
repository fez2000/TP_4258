'use strict';

var mongoose = require('mongoose');
var tuple = require('../schemas/tuple');

var ResourceLinkSchema = new mongoose.Schema({
  source: {type: tuple.Tuple.tree, required: true, validate: [tuple.validateTuple, 'Bad source tuple']},
  target: {type: tuple.Tuple.tree, required: true, validate: [tuple.validateTuple, 'Bad target tuple']},
  // the type of link between the user and the target: profile view, message, like, ...
  type: {type: String, required: true},
  // a link can have a value: A link of like type can also contain +1, -1, x, y, z to distinguish likes
  value: mongoose.Schema.Types.Mixed,
  timestamps: {
    creation: {type: Date, default: Date.now}
  },
  schemaVersion: {type: Number, default: 1}
}, {collection: 'resourcelinks'});

module.exports = mongoose.model('ResourceLink', ResourceLinkSchema);
