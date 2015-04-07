import mqtt from 'mqtt';
import pathToRegexp from 'path-to-regexp';
import {EventEmitter} from 'events';
import {Router} from './router';

class Client extends EventEmitter {
  constructor(appname, username) {
    this.appname = appname;
    this.username = username;
    this.router = new Router();
  }

  connect(url = `wss://${location.hostname}:3000`, option = {}) {
    option.clientId = this.username;
    this.connection = mqtt.connect(url, option);
    this.bindEvents();
  }

  sub(topic, callback) {
    console.assert(topic[0] !== '/', 'topic should not start with /');
    let topic = `/${this.appname}/${topic}`;
    logger.info('add handler to', topic);
    let t = this.router.topic(topic, callback);
    logger.info('subscribe', t);
    this.connection.subscribe(t);
  }

  pub(topic, data, option = { qos: 0, retain: false }) {
    console.assert(topic[0] !== '/', 'topic should not start with /');
    let topic = `/${this.appname}/${topic}`;
    logger.info('publish', topic, data, option);
    let message = JSON.stringify(data);
    this.connection.publish(topic, message, option);
  }

  bindEvents() {
    this.connection.on('connect', () => {
      this.emit('connect');
    });
    this.connection.on('message', (topic, payload) => {
      let message = JSON.parse(payload.toString());
      logger.info('message', topic, message);
      this.router.route(topic, message);
    });
  }
}

export {Client};
