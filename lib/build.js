const transform = require('./transform');
const fs = require('fs');

fs.createReadStream('./src/favicon.ico').pipe(fs.createWriteStream('./docs/favicon.ico'));

transform(() => {
  console.log('✅ build complete.');
});