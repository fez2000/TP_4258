'use strict';

var async = require('async');
var logger = require('../core/logger');

/**
 * Get an array of user ids with the community context if exist by expanding the targets array.
 * targets : [
 *    {
 *      objectType: {string},
 *      id: {ObjectId}
 *    }
 * ]
 *
 * @param {Object[]} targets the targets
 * @param {function} callback fn like callback(err, {_id: userId, context: communityId})
 */
module.exports.getUserIds = function(targets, callback) {
  if (!targets) {
    return callback(new Error('Targets can not be null'));
  }
  if (!Array.isArray(targets)) {
    return callback(new Error('Targets must be an array'));
  }

  var usersFound = Object.create(null);

  function addUsersIfNotFoundOrContextUndefined(userId, communityId) {
    if (!usersFound[userId]) {
      usersFound[userId] = communityId;
    }
  }

  async.each(targets, function(target, callback) {
    if (target.objectType === 'user') {
      addUsersIfNotFoundOrContextUndefined(target.id);
      callback();
    } else if (target.objectType === 'community') {
      // OR-2576 Avoid circular dependency
      const collaboration = require('../core/collaboration');

      collaboration.member.getMembers(target.id, target.objectType, {}, function(err, members) {
        if (err) {
          return callback(err);
        }
        members.forEach(function(member) {
          addUsersIfNotFoundOrContextUndefined(member.member.id, target.id);
        });
        callback();
      });
    } else {
      logger.warn('Unsupported objectType has been ignored.');
      callback();
    }
  }, function(err) {
    if (err) {
      return callback(err);
    }
    var usersResult = [];

    Object.keys(usersFound).forEach(function(userId) {
      usersResult.push({_id: userId, context: usersFound[userId]});
    });

    return callback(null, usersResult);
  });
};
