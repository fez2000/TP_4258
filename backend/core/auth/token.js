'use strict';

const DEFAULT_TTL = 60;
const logger = require('../logger');
const mongoose = require('mongoose');
const uuidV4 = require('uuid/v4');
const AuthToken = mongoose.model('AuthToken');

module.exports = {
  getNewToken,
  getToken,
  validateToken
};

function getExpirationDate(ttl) {
  return new Date(new Date().getTime() + (ttl * 1000));
}

function getNewToken(options = {}, callback) {
  const token = uuidV4();

  options.ttl = options.ttl || DEFAULT_TTL;
  options.token = token;
  options.created_at = new Date();

  if (options.user) {
    options.user = String(options.user);
  }

  const authToken = new AuthToken({ token: token, expiresAt: getExpirationDate(options.ttl), data: options });

  authToken.save(err => {
    if (err) {
      logger.error('Can not save auth token', err);

      return callback(err);
    }

    return callback(null, options);
  });
}

function validateToken(token, callback) {
  AuthToken.findOne({ token: token }, (err, result) => {
    if (err) {
      logger.error('Problem while getting token data', err);

      return callback(false);
    }

    callback(!!result);
  });
}

function getToken(token, callback) {
  AuthToken.findOne({ token: token }, (err, result) => {
    if (err) {
      logger.error('Problem while getting token data', err);

      return callback(err);
    }

    if (!result || !result.data) {
      return callback();
    }

    callback(null, result.data);
  });
}
