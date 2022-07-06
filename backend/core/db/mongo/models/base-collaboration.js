'use strict';

var extend = require('extend');
var Schema = require('mongoose').Schema;
var tuple = require('../schemas/tuple');
var activitystream = require('../schemas/activitystream');
var injection = require('../schemas/injection');
var Tuple = tuple.Tuple;
var Injection = injection.Injection;
var uuidV4 = require('uuid/v4');

function buildBaseCollaborationSchema(json, collaborationType) {
  const collaborationBaseSchema = {
    creator: { type: Schema.ObjectId, ref: 'User' },
    domain_ids: [
      { type: Schema.ObjectId, ref: 'Domain' }
    ],
    timestamps: {
      creation: { type: Date, default: Date.now }
    },
    members: [
      {
        member: { type: Tuple.tree, required: true, validate: [tuple.validateTuple, 'Bad subject tuple'] },
        status: { type: String },
        timestamps: {
          creation: { type: Date, default: Date.now }
        }
      }
    ],
    activity_stream: { type: activitystream.ActivityStream.tree },
    injections: { type: [Injection], validate: [injection.validateInjections, 'Bad injections'] },
    schemaVersion: { type: Number, default: 1 }
  };

  var schema = extend(true, collaborationBaseSchema, json);
  schema.objectType = { type: String, required: true, default: collaborationType };
  var CollaborationSchema = new Schema(schema);
  CollaborationSchema.pre('save', function(next) {
    this.activity_stream = this.activity_stream || {};
    if (!this.activity_stream.uuid) {
      this.activity_stream.uuid = uuidV4();
    }
    next();
  });

  CollaborationSchema.statics = {
    getFromActivityStreamID: function(id, cb) {
      if (!id) {
        return cb(new Error('Activity stream id can not be null'));
      }
      this.findOne({ 'activity_stream.uuid': id }).exec(cb);
    }
  };
  return CollaborationSchema;
}

module.exports = buildBaseCollaborationSchema;
