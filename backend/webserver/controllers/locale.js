'use strict';

const i18n = require('../../core/i18n');

module.exports.getAll = function(req, res) {
  return res.status(200).json(['en', 'fr']);
};

module.exports.get = function(req, res) {
  return res.status(200).json(i18n.getLocale());
};

module.exports.set = function(req, res) {
  res.cookie('locale', req.params.locale);
  i18n.setLocale(req.params.locale);
  res.redirect(200, 'back');
};
