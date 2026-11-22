import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const serverPath = fileURLToPath(new URL('../src/server.js', import.meta.url));

test('language server starts and answers initialize', async () => {
  const child = spawn(process.execPath, [serverPath, '--stdio'], { stdio: ['pipe', 'pipe', 'pipe'] });
  let output = Buffer.alloc(0);
  let stderr = '';
  let settled = false;

  try {
    const responsePromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (settled) return;
        settled = true;
        reject(new Error(`Timed out waiting for initialize response. Server stderr: ${stderr}`));
      }, 5000);

      child.stdout.on('data', (chunk) => {
        output = Buffer.concat([output, chunk]);
        const headerEnd = output.indexOf('\r\n\r\n');
        if (headerEnd < 0) return;
        const header = output.subarray(0, headerEnd).toString('ascii');
        const length = Number(header.match(/Content-Length:\s*(\d+)/i)?.[1]);
        if (!Number.isFinite(length)) return;
        const messageEnd = headerEnd + 4 + length;
        if (output.length < messageEnd) return;
        const message = JSON.parse(output.subarray(headerEnd + 4, messageEnd).toString('utf8'));
        if (message.id !== 1 || settled) return;
        settled = true;
        clearTimeout(timeout);
        resolve(message);
      });

      child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
      child.on('error', (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(error);
      });
      child.on('close', (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeout);
        reject(new Error(`Language server exited with code ${code}. stderr: ${stderr}`));
      });
    });

    const initialize = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: process.pid,
        rootUri: null,
        capabilities: {},
      },
    });
    child.stdin.write(`Content-Length: ${Buffer.byteLength(initialize)}\r\n\r\n${initialize}`);

    const response = await responsePromise;
    assert.equal(response.error, undefined, JSON.stringify(response.error));
    assert.equal(response.result.capabilities.hoverProvider, true);
    assert.equal(response.result.capabilities.documentSymbolProvider, true);
  } finally {
    child.kill();
  }
});
