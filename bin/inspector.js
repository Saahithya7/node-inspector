#!/usr/bin/env node

var dserver = require('../lib/debug-server'),
    fs = require('fs'),
    path = require('path'),
    options = {};

process.argv.forEach(function (arg) {
  var parts;
  if (arg.indexOf('--') > -1) {
    parts = arg.split('=');
    if (parts.length > 1) {
      switch (parts[0]) {
      case '--web-port':
      case '--agent-port':
        options.webPort = parseInt(parts[1], 10);
        break;
      default:
        console.log('unknown option: ' + parts[0]);
        break;
      }
    }
    else if (parts[0] === '--help') {
      console.log('Usage: node [node_options] debug-agent.js [options]');
      console.log('Options:');
      console.log('--web-port=[port]     port to host the inspector (default 8080)');
      process.exit();
    }
  }
});

fs.readFile(path.join(__dirname, '../config.json'), function(err, data) {
  var config;
  if (err) {
    config = {};
  }
  else {
    config = JSON.parse(data);
  }
  dserver.create(options, config).on('close', function () {
    console.log('session closed');
    process.exit();
  });
});
