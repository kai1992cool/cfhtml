import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

function runCli(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.resolve('bin/nghtml.js'), ...args], {
      cwd: path.resolve('.'),
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('CLI reports JSON diagnostics and a failing exit code', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'nghtml-'));
  const file = path.join(dir, 'broken.nghtml');
  await writeFile(file, '@for (item of ${items}) {<p>{{ item }}</p>}', 'utf8');

  const result = await runCli(['check', file, '--format=json']);
  assert.equal(result.code, 1);
  assert.equal(result.stdout.includes('"code":"NGHTML003"'), true);
});
