var key;
try {
  key          = require('../config/marvel.js')
}
catch(e) {
  throw 'config/marvel.js not exist, please run cp ./config/marvel.sample.js ./config/marvel.js and edit it';
}
const crypto   = require('crypto');

module.exports = function() {
  const date   = new Date();
  const ts     = date.getTime();
  const hash   = crypto
    .createHash('md5')
    .update(ts + key.private + key.public)
    .digest('hex');
  return {
    ts: ts,
    public: key.public,
    hash: hash
  }
}();
