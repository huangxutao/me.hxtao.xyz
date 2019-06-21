const fs = require('fs');
const autoprefixer = require('autoprefixer');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const cssnano = require('cssnano');
const postcss = require('postcss');
const mark = require('./mark');

const mdPath = './src/resume.md';
const htmlPath = './src/index.html';

function build(cb) {
  const mdstr = fs.readFileSync(mdPath).toString();
  const htmlstr = fs.readFileSync(htmlPath).toString();

  fs.writeFileSync('./docs/index.html', htmlstr.replace('{{content}}', mark(mdstr)));
  fs.readFile('src/style.pcss', (err, css) => {
    postcss([postcssImport, postcssNested, autoprefixer, cssnano])
      .process(css, { from: 'src/style.pcss', to: 'docs/style.css' })
      .then(result => {
        fs.writeFileSync('./docs/style.css', result.css);
        cb && cb();
      });
  });
}

module.exports = build;
