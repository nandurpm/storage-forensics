import { spawn } from 'node:child_process';
import { createReadStream } from 'node:fs';
import { access, readdir, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { basename, dirname, extname, join, resolve } from 'node:path';

const root = resolve('reports');
const port = Number(process.env.PORT || 4080);
const fullViewportCss = '<style id="render-full-viewport">html,body{width:100%;min-height:100%;margin:0}body{min-height:100vh}main,.wrap,.app,.container{max-width:none;box-sizing:border-box}@media(max-width:640px){body{min-width:0;overflow-x:hidden}}</style>';

function runDemo() {
  return new Promise((resolveRun, reject) => {
    const child = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'demo', '--silent'], { stdio: 'inherit' });
    child.on('error', error => reject(new Error(`Unable to generate the demonstration report: ${error.message}`)));
    child.on('close', code => code === 0 ? resolveRun() : reject(new Error(`Demo report generation exited with code ${code}.`)));
  });
}

async function findHtml(folder) {
  let entries = [];
  try { entries = await readdir(folder, { withFileTypes: true }); } catch { return null; }
  for (const entry of entries) {
    const candidate = join(folder, entry.name);
    if (entry.isDirectory()) { const found = await findHtml(candidate); if (found) return found; }
    if (entry.isFile() && ['.html', '.htm'].includes(extname(entry.name).toLowerCase())) return candidate;
  }
  return null;
}

function contentType(file) {
  return { '.html': 'text/html; charset=utf-8', '.htm': 'text/html; charset=utf-8', '.json': 'application/json; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }[extname(file).toLowerCase()] || 'application/octet-stream';
}

await runDemo();
const entry = await findHtml(root);
if (!entry) throw new Error('No generated HTML report was found under reports/.');
const entryDir = dirname(entry);

createServer(async (request, response) => {
  const pathname = new URL(request.url || '/', 'http://localhost').pathname;
  const file = pathname === '/' ? entry : resolve(entryDir, basename(pathname));
  if (!file.startsWith(`${entryDir}/`)) { response.writeHead(403); response.end('Forbidden'); return; }
  try {
    await access(file);
    if (['.html', '.htm'].includes(extname(file).toLowerCase())) {
      const source = await readFile(file, 'utf8');
      const html = source.includes('</head>') ? source.replace('</head>', `${fullViewportCss}</head>`) : `${fullViewportCss}${source}`;
      response.writeHead(200, { 'Content-Type': contentType(file), 'Cache-Control': 'no-store' });
      response.end(html);
      return;
    }
    response.writeHead(200, { 'Content-Type': contentType(file), 'Cache-Control': 'no-store' });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404); response.end('Report asset not found');
  }
}).listen(port, '0.0.0.0', () => console.log(JSON.stringify({ port, mode: 'synthetic-demo-report-host', entry: entry.replace(process.cwd(), '.') })));
