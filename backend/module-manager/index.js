'use strict';

var Path = require('path');
var fs = require('fs');
var core = require('../core');
var AwesomeModuleManager = require('awesome-module-manager');
var AwesomeModule = require('awesome-module');
var ESN_MODULE_PREFIX = 'linagora.esn.core.';
var ESN_MIDDLEWARE_PREFIX = ESN_MODULE_PREFIX + 'webserver.middleware.';
var ESN_DENORMALIZE_PREFIX = ESN_MODULE_PREFIX + 'webserver.denormalize.';
var setupServer = require('./server');

var manager = new AwesomeModuleManager(core.logger);

function mockModule(name, lib) {
  var mock = new AwesomeModule(ESN_MODULE_PREFIX + name, {
    states: {
      lib: function(deps, callback) {
        return callback(null, lib);
      }
    }
  });
  var loader = manager.loaders.code(mock, true);
  manager.appendLoader(loader);
}

function mockCoreModule(name) {
  var mock = new AwesomeModule(ESN_MODULE_PREFIX + name, {
    states: {
      lib: function(deps, callback) {
        return callback(null, core[name]);
      }
    },
    abilities: [name]
  });
  var loader = manager.loaders.code(mock, true);
  manager.appendLoader(loader);
}

function mockPubsub(type) {
  var mock = new AwesomeModule(ESN_MODULE_PREFIX + 'pubsub.' + type, {
    states: {
      lib: function(deps, callback) {
        return callback(null, core.pubsub.local);
      }
    },
    provides: ['pubsub.' + type]
  });
  var loader = manager.loaders.code(mock, true);
  manager.appendLoader(loader);
}

function mockCore() {
  var corePath = Path.join(__dirname, '..', 'core');
  fs.readdirSync(corePath).forEach(function(filename) {
    var modPath = Path.join(corePath, filename);
    var stat = fs.statSync(modPath);
    if (!stat.isDirectory()) { return; }
    mockCoreModule(filename);
  });
  mockPubsub('local');
  mockPubsub('global');
}

function mockDenormalize() {
  var denormalizePath = __dirname + '/../webserver/denormalize';
  var denormalize = [
    'user'
  ];

  denormalize.forEach(function(name) {
    var moduleName = ESN_DENORMALIZE_PREFIX + name;
    var mock = new AwesomeModule(moduleName, {
      states: {
        lib: function(deps, callback) {
          return callback(null, require(denormalizePath + '/' + name));
        }
      }
    });
    var loader = manager.loaders.code(mock, true);
    manager.appendLoader(loader);
  });
}

function mockMiddlewares() {
  var middlewarePath = __dirname + '/../webserver/middleware';
  var middlewares = [
    'activitystream',
    'authentication',
    'authorization',
    'collaboration',
    'configuration',
    'cookie-lifetime',
    'domain',
    'feedback',
    'file',
    'helper',
    'link',
    'login-rules',
    'message',
    'module',
    'notification',
    'platformadmins',
    'request',
    'resource-link',
    'setup-routes',
    'setup-sessions',
    'startup-buffer',
    'templates',
    'token',
    'usernotifications',
    'users',
    'verify-recaptcha'
  ];

  middlewares.forEach(function(name) {
    var moduleName = ESN_MIDDLEWARE_PREFIX + name;
    var mock = new AwesomeModule(moduleName, {
      states: {
        lib: function(deps, callback) {
          return callback(null, require(middlewarePath + '/' + name));
        }
      }
    });
    var loader = manager.loaders.code(mock, true);
    manager.appendLoader(loader);
  });
}

function mockHelpers() {
  var moduleName = ESN_MODULE_PREFIX + 'helpers';
  var mock = new AwesomeModule(moduleName, {
    states: {
      lib: function(deps, callback) {
        return callback(null, require(__dirname + '/../helpers'));
      }
    }
  });
  var loader = manager.loaders.code(mock, true);
  manager.appendLoader(loader);
}

function setupManager() {
  mockHelpers();
  mockCore();
  mockMiddlewares();
  mockDenormalize();
  core.moduleManager = manager;
  return manager;
}

function setupServerEnvironment() {
  setupServer(module.exports);
}

module.exports.setupManager = setupManager;
module.exports.ESN_MODULE_PREFIX = ESN_MODULE_PREFIX;
module.exports.ESN_MIDDLEWARE_PREFIX = ESN_MIDDLEWARE_PREFIX;
module.exports.ESN_DENORMALIZE_PREFIX = ESN_DENORMALIZE_PREFIX;
module.exports.manager = manager;
module.exports.mockModule = mockModule;
module.exports.setupServerEnvironment = setupServerEnvironment;
