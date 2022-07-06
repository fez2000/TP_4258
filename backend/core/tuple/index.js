const ObjectID = require('bson').ObjectId;
const emailAddresses = require('email-addresses');
const validUrl = require('valid-url');

module.exports = {
  user,
  community,
  group,
  email,
  string,
  icon,
  url,
  get,
  validateAndSanitize,
  isTuple,
  isTupleOfType,
  isEqual
};

function checkString(value) {
  if (!value || typeof value !== 'string') {
    throw new Error('id should be a string');
  }
}

function vasobjectID(value) {
  if (!value) {
    throw new Error('ID cannot be null');

  }

  if (typeof value.toString === 'function') {
    value = value.toString();
  }
  return new ObjectID(value + '');
}

function objectIdTuple(type, value) {
  return {objectType: type, id: vasobjectID(value)};
}

function vasUser(value) {
  return vasobjectID(value);
}

function vasCommunity(value) {
  return vasobjectID(value);
}

function vasEmail(value) {
  checkString(value);
  if (!emailAddresses.parseOneAddress(value)) {
    throw new Error('invalid email address: ' + value);
  }
  return value.toLowerCase();
}

function vasString(value) {
  checkString(value);
  return value;
}

function vasIcon(value) {
  checkString(value);
  return value;
}

function vasUrl(value) {
  checkString(value);
  if (!validUrl.isWebUri(value)) {
    throw new Error('URL is badly formatted: ' + value);
  }
  return value;
}

function user(value) {
  return objectIdTuple('user', vasUser(value));
}

function group(value) {
  return objectIdTuple('group', vasobjectID(value));
}

function community(value) {
  return objectIdTuple('community', vasCommunity(value));
}

function email(value) {
  return {objectType: 'email', id: vasEmail(value)};
}

function string(value) {
  checkString(value);
  return {objectType: 'string', id: vasString(value)};
}

function icon(value) {
  return {objectType: 'icon', id: vasIcon(value)};
}

function url(value) {
  return {objectType: 'url', id: vasUrl(value)};
}

function get(type, value) {
  switch (type) {
    case 'user':
      return user(value);
    case 'community':
      return community(value);
    case 'group':
      return group(value);
    case 'email':
      return email(value);
    case 'string':
      return string(value);
    case 'icon':
      return icon(value);
    case 'url':
      return url(value);
  }
}

function validateAndSanitize(type, value) {
  switch (type) {
    case 'user':
      return vasUser(value);
    case 'community':
      return vasCommunity(value);
    case 'email':
      return vasEmail(value);
    case 'string':
      return vasString(value);
    case 'icon':
      return vasIcon(value);
    case 'url':
      return vasUrl(value);
  }
}

function isTuple(tuple) {
  return !!tuple && !!tuple.objectType && !!tuple.id;
}

function isTupleOfType(type, tuple) {
  return isTuple(tuple) && tuple.objectType === type;
}

function isEqual(tuple1, tuple2) {
  if (tuple1.objectType !== tuple2.objectType) {
    return false;
  }

  if (tuple1.objectType === 'email') {
    return String(tuple1.id).toUpperCase() === String(tuple2.id).toUpperCase();
  }

  return String(tuple1.id) === String(tuple2.id);
}
