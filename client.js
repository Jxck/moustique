var EventEmitter = require('events').EventEmitter;
var util = require('util');
var mqtt = require('mqtt');

var Router = require('./router');

function Client(appname, username) {
  EventEmitter.call(this);
  this.appname = appname;
  this.username = username;
  this.connection = null;
}

util.inherits(Client, EventEmitter);

Client.prototype.connect = function(url) {
  if(url === undefined) {
    throw new Error('url required');
  }
  this.connection = mqtt.connect(url, { clientId: this.username });

  this.connection.on('connect', function() {
    console.log('connect');
  });

  this.connection.on('message', function(topic, payload) {
    var message = JSON.parse(payload.toString());
    console.log('message', topic, message);
  });
}

Client.prototype.sub = function(topic, callback) {
  var topic = util.format('/%s/%s', this.appname, this.topic);
  console.log('add handler to', topic);
  this.connection.subscribe(topic);
}

Client.prototype.pub = function(topic, data) {
  var topic = util.format('/%s/%s', this.appname, this.topic);
  console.log('publish', topic, data);
  var message = JSON.stringify(data);
  this.connection.publish(topic, message);
}

module.exports = Client;
