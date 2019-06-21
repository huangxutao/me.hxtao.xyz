const Marked = require('marked');
const Prism = require('prismjs');
require('prismjs/components/prism-markup-templating');
require('prismjs/components/prism-c');
require('prismjs/components/prism-cpp');
require('prismjs/components/prism-php');
require('prismjs/components/prism-python');
require('prismjs/components/prism-java');
require('prismjs/components/prism-bash');
require('prismjs/components/prism-http');
require('prismjs/components/prism-json');
require('prismjs/components/prism-less');
require('prismjs/components/prism-scss');
require('prismjs/components/prism-sass');
require('prismjs/components/prism-perl');
require('prismjs/components/prism-sql');
require('prismjs/components/prism-yaml');
require('prismjs/components/prism-wiki');
require('prismjs/components/prism-swift');
require('prismjs/components/prism-ruby');
require('prismjs/components/prism-jsx');
require('prismjs/components/prism-http');
require('prismjs/components/prism-nginx');
require('prismjs/components/prism-coffeescript');
require('prismjs/components/prism-git');
require('prismjs/components/prism-go');
require('prismjs/components/prism-io');
require('prismjs/components/prism-pure');
require('prismjs/components/prism-tsx');
require('prismjs/components/prism-regex');
require('prismjs/components/prism-scheme');
require('prismjs/components/prism-stylus');
require('prismjs/components/prism-typescript');
require('prismjs/components/prism-wiki');
require('prismjs/components/prism-makefile');
require('prismjs/components/prism-markdown');
require('prismjs/components/prism-matlab');
require('prismjs/components/prism-kotlin');
require('prismjs/components/prism-ejs');
require('prismjs/components/prism-basic');

/**
 * Function mark 解析 markdown
 * @param {String} str: markdown string
 * @param {Boolean} target: 是否需要标题钩子
 * @returns {String}
 */
function mark (str = '', target) {
  Marked.setOptions({
    renderer: (() => {
      const renderer = new Marked.Renderer();

      renderer.heading = (text, level) => {
        const linkText = text.replace(/<[^>].*>/g, '');

        if (level <= 2 && target) {
          return `<a href="#${text}"><h${level} id="${linkText}">${text}</h${level}></a>`;
        } else {
          return `<h${level} id="${linkText}">${text}</h${level}>`;
        }
      }

      renderer.image = (src, title, alt) => {
        if (alt === 'emoji') {
          return `<img src="${src}" alt="${alt}" class="self-emoji">`;
        } else {
          let cls = '';

          if (/no-shadow$/.test(alt)) {
            cls = 'no-shadow';

            alt = alt.slice(0, -'no-shadow'.length);
          }

          if (alt === 'img') {
            return `<div class="n-img ${cls}"><img src="${src}" alt="${alt}"></div>`;
          }

          return `<div class="n-img ${cls}"><img src="${src}" alt="${alt}"><p>${alt}<p></div>`;
        }
      }

      return renderer;
    })(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false,
    highlight: (code, type) => {
      const lan = Prism.languages;

      // console.log('Object.keys(lan)', Object.keys(lan), Object.keys(lan).includes(type))

      if (!Object.keys(lan).includes(type)) {
        type = 'markup';
      }

      return Prism.highlight(code, lan[type], type);
    }
  });

  return Marked(str);
}

module.exports = mark;
