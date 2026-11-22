import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import {
  getCompletions,
  getDocumentSymbols,
  getHover,
  validateNghtmlDocument,
} from '../src/core.js';

test('reports unclosed blocks', () => {
  const diagnostics = validateNghtmlDocument('@if (${show}) {\n<p>Hello</p>');
  assert.equal(diagnostics.some((item) => item.code === 'NGHTML001'), true);
});

test('reports an unclosed else branch before a following nested block', () => {
  const text = [
    '@if (${show}) {',
    '  <p>Visible</p>',
    '} @else if (${name === "Angular"}) {',
    '  <p>Angular</p>',
    '} @else {',
    '  <p>Hidden</p>',
    '  @for (item of ${items}; track item.id) {',
    '    <li>{{ item.name }}</li>',
    '  }',
    '}',
  ].join('\n');
  const diagnostics = validateNghtmlDocument(text);
  assert.deepEqual(diagnostics, []);

  const malformed = text.slice(0, text.lastIndexOf('\n}'));
  const malformedDiagnostics = validateNghtmlDocument(malformed);
  assert.equal(
    malformedDiagnostics.some((item) => item.code === 'NGHTML001' && item.message === 'Unclosed @else block'),
    true,
  );
});

test('does not let TypeScript braces after an NGHTML template close hide its missing block brace', () => {
  const source = [
    'class Example {',
    '  render() {',
    '    return nghtml`',
    '      @if (${show}) {',
    '        <p>Shown</p>',
    '      } @else {',
    '        <p>Hidden</p>',
    '        @for (item of ${items}; track item.id) {',
    '          <p>{{ item.name }}</p>',
    '        }',
    '    `;',
    '  }',
    '}',
  ].join('\n');

  const diagnostics = validateNghtmlDocument(source);
  assert.equal(
    diagnostics.some((item) => item.code === 'NGHTML001' && item.message === 'Unclosed @else block'),
    true,
  );
});

test('reports the missing else brace in the hello-world tagged template', async () => {
  const file = fileURLToPath(new URL('../../src/hello-world.ts', import.meta.url));
  const source = await readFile(file, 'utf8');
  const diagnostics = validateNghtmlDocument(source);
  assert.equal(
    diagnostics.some((item) => item.code === 'NGHTML001' && item.message === 'Unclosed @else block'),
    true,
  );
});

test('requires track expressions on for blocks', () => {
  const diagnostics = validateNghtmlDocument('@for (item of ${items}) {<p>{{ item }}</p>}');
  assert.equal(diagnostics.some((item) => item.code === 'NGHTML003'), true);
});

test('accepts a valid for block', () => {
  const diagnostics = validateNghtmlDocument('@for (item of ${items}; track item.id) {<p>{{ item.name }}</p>}');
  assert.deepEqual(diagnostics, []);
});

test('reports invalid let syntax', () => {
  const diagnostics = validateNghtmlDocument('@let name');
  assert.equal(diagnostics.some((item) => item.code === 'NGHTML002'), true);
});

test('provides directive completions and hover', () => {
  assert.equal(getCompletions('@', { line: 0, character: 1 }).length > 0, true);
  assert.equal(getHover('@for', { line: 0, character: 2 })?.contents.kind, 'markdown');
});

test('indexes top-level directives as symbols', () => {
  const symbols = getDocumentSymbols('@if (${show}) {}\\n@let value = ${value};');
  assert.deepEqual(symbols.map((symbol) => symbol.name), ['@if', '@let']);
});
