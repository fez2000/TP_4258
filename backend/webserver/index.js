'use strict';

var express = require('express');
var serverApplication = require('./application');
var https = require('https');
var http = require('http');
var fs = require('fs');
var AwesomeModule = require('awesome-module');
var Dependency = AwesomeModule.AwesomeModuleDependency;
var AsyncEventEmitter = require('async-eventemitter');
const assetRegistry = require('../core').assets;

var webserver = {
  application: serverApplication,

  server: null,
  server6: null,
  sslserver: null,
  sslserver6: null,

  ip: null,
  ipv6: null,
  port: null,

  ssl_ip: null,
  ssl_ipv6: null,
  ssl_port: null,
  ssl_key: null,
  ssl_cert: null,

  virtualhosts: [],

  started: false
};

var emitter = new AsyncEventEmitter();
emitter.setMaxListeners(0);

function start(callback) {

  if (!webserver.port && !webserver.ssl_port) {
    console.error('The webserver needs to be configured before it is started');
    process.exit(1);
  }

  if (webserver.ssl_port && (!webserver.ssl_cert || !webserver.ssl_key)) {
    console.error('Configuring an SSL server requires port, certificate and key');
    process.exit(1);
  }
  callback = callback || function() {};

  if (webserver.started) {
    return callback();
  }
  webserver.started = true;

  if (webserver.virtualhosts.length) {
    var application = express();
    webserver.virtualhosts.forEach(function(hostname) {
      application.use(express.vhost(hostname, serverApplication));
    });
    webserver.application = application;
  }

  var DISABLED = 0;
  var STOPPED = 1;
  var STARTED = 2;

  var callbackFired = false;
  var ws = webserver;
  var states = {
    http4: ws.ip && ws.port ? STOPPED : DISABLED,
    http6: ws.ipv6 && ws.port ? STOPPED : DISABLED,
    ssl4: ws.ssl_ip && ws.ssl_port && ws.ssl_key && ws.ssl_cert ? STOPPED : DISABLED,
    ssl6: ws.ssl_ipv6 && ws.ssl_port && ws.ssl_key && ws.ssl_cert ? STOPPED : DISABLED
  };

  if (inState(DISABLED)) {
    console.error('Need to run on at least one socket');
    process.exit(1);
  }

  var sslkey, sslcert;
  if (states.ssl4 === STOPPED || states.ssl6 === STOPPED) {
    sslkey = fs.readFileSync(webserver.ssl_key);
    sslcert = fs.readFileSync(webserver.ssl_cert);
  }

  if (ws.ipv6 === '::' && ws.ip === '0.0.0.0' && states.http6 && states.http4) {
    // Listening on :: listens on ipv4 and ipv6, we only need one server
    states.http4 = DISABLED;
  }
  if (ws.ssl_ipv6 === '::' && ws.ssl_ip === '0.0.0.0' && states.ssl6 && states.ssl4) {
    // Listening on :: listens on ipv4 and ipv6, we only need one server
    states.ssl4 = DISABLED;
  }

  if (states.http4 === STOPPED) {
    webserver.server = http.createServer(webserver.application).listen(webserver.port, webserver.ip);
    setupEventListeners(webserver.server);
  }

  if (states.http6 === STOPPED) {
    webserver.server6 = http.createServer(webserver.application).listen(webserver.port, webserver.ipv6);
    setupEventListeners(webserver.server6);
  }

  if (states.ssl4 === STOPPED) {
    webserver.sslserver = https.createServer({key: sslkey, cert: sslcert}, webserver.application).listen(webserver.ssl_port, webserver.ssl_ip);
    setupEventListeners(webserver.sslserver);
  }

  if (states.ssl6 === STOPPED) {
    webserver.sslserver6 = https.createServer({key: sslkey, cert: sslcert}, webserver.application).listen(webserver.ssl_port, webserver.ssl_ipv6);
    setupEventListeners(webserver.sslserver6);
  }

  function listenCallback(server, err) {
    if (server === webserver.server) { states.http4 = STARTED; }
    if (server === webserver.sslserver) { states.ssl4 = STARTED; }
    if (server === webserver.server6) { states.http6 = STARTED; }
    if (server === webserver.sslserver6) { states.ssl6 = STARTED; }
    var address = server.address();
    if (address) {
      console.log('Webserver listening on ' + address.address + ' port ' +
                  address.port + ' (' + address.family + ')');
    }

    server.removeListener('listening', listenCallback);
    server.removeListener('error', listenCallback);

    // If an error occurred or all servers are listening, call the callback
    if (!callbackFired) {
      if (err || inState(STOPPED, true)) {
        callbackFired = true;
        callback(err);
      }
    }
  }

  function inState(state, invert) {
    var isInState = true;

    Object.keys(states).forEach(function(k) {
      if (invert && states[k] === state) {
        isInState = false;
      } else if (!invert && states[k] !== state) {
        isInState = false;
      }
    });

    return isInState;
  }

  function setupEventListeners(server) {
    server.on('listening', listenCallback.bind(null, server));
    server.on('error', listenCallback.bind(null, server));
  }
}

webserver.start = start;

function addJSInjection(moduleName, files, innerApps) {
  innerApps.forEach(function(innerApp) {
    assetRegistry.app(innerApp).type('js').add(files, moduleName);
  });
}

webserver.addJSInjection = addJSInjection;

function addCSSInjection(moduleName, files, innerApps) {
  innerApps.forEach(function(innerApp) {
    assetRegistry.app(innerApp).type('css').add(files, moduleName);
  });
}

webserver.addCSSInjection = addCSSInjection;

function addAngularModulesInjection(moduleName, files, angularModulesNames, innerApps, opts) {
  innerApps.forEach(function(innerApp) {
    assetRegistry.app(innerApp).type('angular').add(angularModulesNames, moduleName);
    assetRegistry.app(innerApp).type('js').add(files, moduleName);
    if (opts && opts.localJsFiles) {
      assetRegistry.app(innerApp).type('jsFullPath').add(opts.localJsFiles, moduleName);
    }
  });
}

webserver.addAngularModulesInjection = addAngularModulesInjection;

function addAngularAppModulesInjection(moduleName, jsfiles, angularModulesNames, innerApps, opts) {
  innerApps.forEach(function(innerApp) {
    assetRegistry.app(innerApp).type('angular').add(angularModulesNames, moduleName);
    assetRegistry.app(innerApp).type('jsApp').add(jsfiles, moduleName);
    if (opts && opts.localJsFiles) {
      assetRegistry.app(innerApp).type('jsAppFullPath').add(opts.localJsFiles, moduleName);
    }
  });
}

webserver.addAngularAppModulesInjection = addAngularAppModulesInjection;

function addLessInjection(namespace, lessFiles, innerApps) {
  innerApps.forEach(innerApp => {
    assetRegistry.app(innerApp).type('less').add(lessFiles, namespace);
  });
}

webserver.addLessInjection = addLessInjection;

webserver.on = function(event, callback) {
  emitter.on(event, function(data, next) {
    var req = data[0], res = data[1], json = data[2];
    return callback(req, res, next, json);
  });
};

webserver.emit = emitter.emit.bind(emitter);

var awesomeWebServer = new AwesomeModule('linagora.esn.core.webserver', {
  dependencies: [
    new Dependency(Dependency.TYPE_NAME, 'linagora.esn.core.config', 'conf')
  ],
  states: {
    lib: function(dependencies, callback) {
      var api = webserver;
      return callback(null, api);
    },
    start: function(dependencies, callback) {
      var config = dependencies('conf')('default');

      if (!config.webserver.enabled) {
        console.warn('The webserver will not start as expected by the configuration.');
        return callback();
      }

      webserver.virtualhosts = config.webserver.virtualhosts;
      webserver.port = config.webserver.port;
      webserver.ip = config.webserver.ip;
      webserver.ipv6 = config.webserver.ipv6;
      webserver.ssl_port = config.webserver.ssl_port;
      webserver.ssl_ip = config.webserver.ssl_ip;
      webserver.ssl_ipv6 = config.webserver.ssl_ipv6;
      webserver.ssl_key = config.webserver.ssl_key;
      webserver.ssl_cert = config.webserver.ssl_cert;
      webserver.start(function(err) {
        if (err) {
          console.error('Web server failed to start', err);
          if (err.syscall === 'listen' && err.code === 'EADDRINUSE') {
            console.info('Something is already listening on the Web server port', config.webserver.port);
          }
        }
        callback.apply(this, arguments);
      });
    }
  }
});

module.exports.webserver = webserver;
module.exports.awesomeWebServer = awesomeWebServer;
