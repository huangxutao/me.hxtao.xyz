const { execSync } = require('child_process');
const fs = require('fs');
const http = require('http');
const stream = require('stream');
const watch = require('./watch');
const PORT = 3477;

let needReload = false;
let id = 0;

const server = http.createServer((req, res) => {
  if (req.url === '/event-source') {
    let action = 'no';

    res.writeHead(200, {
      'content-type': 'text/event-stream',
      'cache-control': 'no-cache',
      'connection': 'keep-alive'
    });

    if (needReload) {
      action = 'reload';
      needReload = false;
    }

    res.write(`id: ${id++}\n`);
    res.write(`event: ${action}\n`);
    res.write('retry: 1000\n');
    res.write('data: 0\n\n');

    res.end();
  }

  if (req.url === '/style.css') {
    res.writeHead(200, { 'content-type': 'text/css' });
    fs.createReadStream('./dist/style.css').pipe(res);
    return;
  }

  let htmlstr = fs.readFileSync('./dist/index.html').toString();

  htmlstr += `
    <script>
      const source = new EventSource('/event-source');
      
      source.addEventListener('reload', (event) => {
        location.reload();
      }, false);

      </script>
  `;

  res.writeHead(200, { 'content-type': 'text/html' });
  res.end(htmlstr);
});

server.listen(PORT, () => {
  console.log(`✨  dev server run at ${PORT}...`);
  watch(() => {
    needReload = true;
  });
  execSync(`open http://127.0.0.1:${PORT}`);
});