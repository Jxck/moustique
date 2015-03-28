var pathToRegexp = require('path-to-regexp');

function Router() {
  this.routings = [];
};

Router.prototype.topic = function(topic, callback) {
  var keys = [];
  var re = pathToRegexp(topic, keys);

  function routing(_re, _keys, callback) {
    return function(subscribedTopic, body) {
      var result = _re.exec(subscribedTopic);

      result.shift(); // ignore first, same as itself

      // mapping of placeholder & value
      var params = {}

      _keys.forEach(function(key, i) {
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
};

Router.prototype.route = function(topic, message) {
  for (var i = 0; i < this.routings.length; i ++) {
    var routing = this.routings[i];
    var result = routing(topic, message);
    if (result !== null) {
      return result;
    }
  }
};

module.exports = Router;
