// build via npm run build before use
module.exports = require('./build/client');

var Logger = require('logmorphic').Logger;

global.logger = Logger.getLogger('logmorphic', {
  loglevel: 'TRACE',
  format: '[%date] %category %level (%file) - %message',
  storage: {
    type: 'localStorage',
    key: 'log',
    limit: 1000 * 10 // 10K
  }
});
