'use strict';

var pubsub = require('../pubsub').local;
var logger = require('../logger');
var activitystream = require('./index');
var tracker = require('./tracker').getTracker('read');
var collaborationModule = require('../collaboration');
var initialized = false;

/**
 * Handler for the message:activity notification.
 *
 * @param {object} data             Notification event data
 * @param {function} callback       The callback function
 */
function processActivity(data, callback) {
  callback = callback || function(err) {
    if (err) {
      logger.warn('Error processing message:activity: ', +err.message);
    }
  };

  if (!data) {
    return callback(new Error('Can not create activity from null data'));
  }

  switch (data.verb) {
    case 'post':
    case 'update':
      return activitystream.addTimelineEntry(data, callback);
    default:
      return callback(new Error('Invalid activity verb' + data.verb));
  }
}
module.exports.processActivity = processActivity;

function updateTimelineEntriesTracker(data, callback) {
  if (!data) {
    logger.warn('Can not create timeline entries tracker from null data');

    return;
  }

  callback = callback || function(err, saved) {
    if (err) {
      logger.warn('Error while adding timeline entry tracker : ', +err.message);
    } else if (saved) {
      logger.debug('Timeline entries tracker has been created / updated into database : ' + saved._id);
    }
  };

  collaborationModule.queryOne(data.collaboration.objectType, {_id: data.collaboration.id}, function(err, collaboration) {
    if (err) {
      return callback(err);
    }

    var options = {
      target: {
        objectType: 'activitystream',
        _id: collaboration.activity_stream.uuid
      },
      limit: 1
    };

    activitystream.query(options, function(err, results) {
      if (err) {
        return callback(err);
      }
      if (!results || results.length === 0) {
        return callback(null, null);
      }

      tracker.updateLastTimelineEntry(data.target, collaboration.activity_stream.uuid, results[0]._id, function(err) {
        if (err) {
          return callback(err);
        }
        return callback();
      });
    });
  });
}

module.exports.updateTimelineEntriesTracker = updateTimelineEntriesTracker;

function init() {
  if (initialized) {
    logger.warn('Activity Stream Pubsub is already initialized');

    return;
  }
  pubsub.topic('message:activity').subscribe(processActivity);
  pubsub.topic('collaboration:join').subscribe(updateTimelineEntriesTracker);
  initialized = true;
}
module.exports.init = init;
