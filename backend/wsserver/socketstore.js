'use strict';

var _ = require('lodash');
var logger = require('../core/logger');
var iohelper = require('./helper/socketio');
var websockets = {};

function clean() {
  _.forEach(websockets, sockets => {
    sockets.forEach(socket => {
      socket.disconnect(true);
      unregisterSocket(socket);
    });
  });
}
module.exports.clean = clean;

function registerSocket(socket) {
  var userId = iohelper.getUserId(socket);
  if (!userId || !userId.length) {
    var err = new Error('SocketStore: refusing to store a socket without an associated user ID');
    logger.error('SocketStore: refusing to store a socket without an associated user ID');
    logger.debug(new Error().stack);
    throw err;
  }
  websockets[userId] = websockets[userId] || [];
  websockets[userId].push(socket);
}
module.exports.registerSocket = registerSocket;

function unregisterSocket(socket) {
  var userId = iohelper.getUserId(socket);
  if (!(userId in websockets)) {
    logger.warn('Weird: try to unregister socket for user ' + userId + ', and this user have no socket');
    return;
  }
  var index = null;
  websockets[userId].every(function(s, i) {
    if (s.id === socket.id) {
      index = i;
      return false;
    }
    return true;
  });
  if (index === null) {
    logger.warn('socket id ' + socket.id + ' not found for user id ' + userId);
    return;
  }
  websockets[userId].splice(index, 1);
}
module.exports.unregisterSocket = unregisterSocket;

function getSocketsForUser(userId) {
  if (!(userId in websockets)) {
    return [];
  }
  return websockets[userId].slice();
}
module.exports.getSocketsForUser = getSocketsForUser;
