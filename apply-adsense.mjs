import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve('dist');
const script = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1265732107215441" crossorigin="anonymous"></script>';
let count = 0;
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const filename = join(directory, entry.name);
    if (entry.isDirectory()) { visit(filename); continue; }
    if (!entry.name.endsWith('.html')) continue;
    let html = readFileSync(filename, 'utf8');
    const original = html;
    // Replace any previous loader instead of loading AdSense twice.
    html = html.replace(/<script\b[^>]*\bsrc=["']https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^"']*["'][^>]*>\s*<\/script>/g, '');
    if (!html.includes('</head>')) throw new Error(`Missing head: ${filename}`);
    html = html.replace('</head>', script + '</head>');
    if (html !== original) { writeFileSync(filename, html); count++; }
  }
}
visit(root);
console.log(`Applied AdSense to ${count} HTML pages.`);
