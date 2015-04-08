import pathToRegexp from 'path-to-regexp';

class Router {
  constructor() {
    this.routings = [];
  }

  topic(topic, callback) {
    if (typeof topic !== 'string') {
      throw new TypeError('topic should be string');
    }
    if (topic === '') {
      throw new TypeError('topic should no be empty');
    }
    if (typeof callback !== 'function') {
      throw new TypeError('callback function required');
    }

    let keys = [];
    let re = pathToRegexp(topic, keys);

    function routing(_re, _keys, callback) {
      return function(subscribedTopic, body) {
        let result = _re.exec(subscribedTopic);
        if (result === null) {
          return null;
        }

        result.shift(); // ignore first same as subscribedTopic

        let params = {};
        _keys.forEach((key, i) => {
          params[key.name] = result[i];
        });

        return callback({
          topic: subscribedTopic,
          params: params,
          body: body
        });
      }
    }

    this.routings.push(routing(re, keys, callback));

    let t = keys.reduce((pre, key) => {
      return pre.replace(`:${key.name}?`, '#') // ? to #
                .replace(`:${key.name}`, '+');
    }, topic);
    return t;
  }

  route(topic, message) {
    if (typeof topic !== 'string') {
      throw new TypeError('topic should be string');
    }
    if (topic === '') {
      throw new TypeError('topic should no be empty');
    }

    for (let i = 0; i < this.routings.length; i ++) {
      let routing = this.routings[i];
      let result = routing(topic, message);
      if (result !== null) {
        return result;
      }
    };
  }
}

export {Router}
