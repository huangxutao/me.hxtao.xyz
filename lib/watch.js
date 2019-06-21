const fs = require('fs');
const transform = require('./transform');

module.exports = function watch(cb) {
  let before = Date.now();

  fs.watch('./src', (eventType, fileName) => {
    const now = Date.now();

    if (now - before < 100) return;

    transform(cb);
    before = now;
  });
}
