#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { validateNghtmlDocument } from '../src/core.js';

const [command, ...args] = process.argv.slice(2);

async function collectFiles(input) {
  const resolved = path.resolve(input);
  const info = await stat(resolved);
  if (info.isFile()) return [resolved];
  const entries = await readdir(resolved, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(resolved, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'dist-package'].includes(entry.name)) {
        files.push(...await collectFiles(full));
      }
    } else if (/\.(html?|nghtml|ts|tsx|js|jsx)$/.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

if (command !== 'check') {
  console.error('Usage: nghtml check <file-or-directory> [--format=json|pretty]');
  process.exit(2);
}

const json = args.includes('--format=json');
const inputs = args.filter((arg) => !arg.startsWith('--'));
if (!inputs.length) inputs.push('.');

let total = 0;
for (const input of inputs) {
  let files;
  try {
    files = await collectFiles(input);
  } catch (error) {
    console.error(String(error.message));
    process.exitCode = 1;
    continue;
  }
  for (const file of files) {
    const text = await readFile(file, 'utf8');
    const diagnostics = validateNghtmlDocument(text);
    total += diagnostics.length;
    if (json) {
      console.log(JSON.stringify({ file: path.relative(process.cwd(), file), diagnostics }));
    } else {
      for (const item of diagnostics) {
        console.log(`${path.relative(process.cwd(), file)}:${item.range.start.line + 1}:${item.range.start.character + 1} ${item.code} ${item.message}`);
      }
    }
  }
}

if (json) {
  if (total > 0) process.exitCode = 1;
} else {
  if (total === 0) console.log('No NGHTML diagnostics found.');
  if (total > 0) process.exitCode = 1;
}
