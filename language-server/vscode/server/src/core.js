const COMPLETION_ITEMS = [
  { label: '@if', kind: 15, detail: 'Conditional block', insertText: '@if (${1:condition}) {\n\t${2}\n}' },
  { label: '@for', kind: 15, detail: 'Loop block', insertText: '@for (${1:item} of ${2:items}; track ${1:item}.id) {\n\t${3}\n} @empty {\n\t${4}\n}' },
  { label: '@let', kind: 15, detail: 'Template scope value', insertText: '@let ${1:name} = ${2:value};' },
  { label: '@switch', kind: 15, detail: 'Switch block', insertText: '@switch (${1:value}) {\n\t@case (${2:first}) {\n\t\t${3}\n\t}\n\t@default {\n\t\t${4}\n\t}\n}' },
  { label: '@defer', kind: 15, detail: 'Deferred block', insertText: '@defer (on ${1|immediate,idle,viewport|}) {\n\t${2}\n}' },
];

function offsetToPosition(text, offset) {
  const safe = Math.max(0, Math.min(offset, text.length));
  let line = 0;
  let character = 0;
  for (let i = 0; i < safe; i++) {
    if (text[i] === '\n') {
      line++;
      character = 0;
    } else {
      character++;
    }
  }
  return { line, character };
}

function positionToOffset(text, position) {
  const lines = text.split(/\r?\n/);
  let offset = 0;
  for (let i = 0; i < position.line && i < lines.length; i++) {
    offset += lines[i].length + 1;
  }
  return offset + position.character;
}

function createDiagnostic(text, offset, length, code, message, severity = 'error') {
  const start = offsetToPosition(text, offset);
  const end = offsetToPosition(text, offset + Math.max(length, 1));
  return { range: { start, end }, severity, code, message, source: 'nghtml' };
}

function findMatchingBrace(text, opening) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = opening; i < text.length; i++) {
    const char = text[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (quote) {
      if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function maskOutsideNghtmlTemplates(text) {
  const regions = [];
  const tagPattern = /\bnghtml\s*/g;
  let match;

  while ((match = tagPattern.exec(text))) {
    const opening = match.index + match[0].length;
    if (text[opening] !== '`') continue;

    let cursor = opening + 1;
    while (cursor < text.length) {
      if (text[cursor] === '\\') {
        cursor += 2;
        continue;
      }
      if (text.startsWith('${', cursor)) {
        const expressionEnd = findMatchingBrace(text, cursor + 1);
        if (expressionEnd === -1) {
          cursor = text.length;
          break;
        }
        cursor = expressionEnd + 1;
        continue;
      }
      if (text[cursor] === '`') {
        regions.push([opening + 1, cursor]);
        tagPattern.lastIndex = cursor + 1;
        break;
      }
      cursor++;
    }
  }

  if (regions.length === 0) return text;
  const masked = text.split('');
  for (let index = 0; index < masked.length; index++) {
    if (masked[index] !== '\n' && masked[index] !== '\r') masked[index] = ' ';
  }
  for (const [start, end] of regions) {
    for (let index = start; index < end; index++) masked[index] = text[index];
  }
  return masked.join('');
}

function findUnclosedBlocks(text) {
  const headers = /@(if|for|switch|defer)\s*\([\s\S]*?\)\s*\{|@(else\s+if)\s*\([\s\S]*?\)\s*\{|@(else|empty|case|default|placeholder|loading|error)(?:\s*\([^)]*\))?\s*\{/g;
  const openings = new Map();
  let match;
  while ((match = headers.exec(text))) {
    const directive = match[1] ?? match[2] ?? match[3];
    const opening = match.index + match[0].lastIndexOf('{');
    openings.set(opening, {
      offset: match.index,
      length: directive.length,
      name: directive,
    });
  }

  const stack = [];
  for (let index = 0; index < text.length; index++) {
    if (text.startsWith('${', index)) {
      const end = findMatchingBrace(text, index + 1);
      if (end === -1) break;
      index = end;
      continue;
    }
    if (text.startsWith('{{', index)) {
      const end = text.indexOf('}}', index + 2);
      if (end === -1) break;
      index = end + 1;
      continue;
    }
    if (openings.has(index)) {
      stack.push(openings.get(index));
    } else if (text[index] === '}' && stack.length > 0) {
      stack.pop();
    }
  }
  return stack;
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.code}:${item.range.start.line}:${item.range.start.character}:${item.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function validateNghtmlDocument(text) {
  const source = maskOutsideNghtmlTemplates(text);
  const diagnostics = [];
  for (const block of findUnclosedBlocks(source)) {
    diagnostics.push(createDiagnostic(
      text,
      block.offset,
      block.length,
      'NGHTML001',
      `Unclosed @${block.name} block`,
    ));
  }

  const blockPattern = /@(if|for|switch|defer)\b/g;
  let match;

  while ((match = blockPattern.exec(source))) {
    const name = match[1];
    const headerPattern = {
      if: /^@if\s*\([\s\S]*?\)\s*\{/,
      for: /^@for\s*\([\s\S]*?\)\s*\{/,
      switch: /^@switch\s*\([\s\S]*?\)\s*\{/,
      defer: /^@defer\s*\([\s\S]*?\)\s*\{/,
    }[name];
    const header = source.slice(match.index).match(headerPattern);
    if (!header) {
      const expected = {
        if: 'Expected @if (test; as alias) { ... }',
        for: 'Expected @for (item of items; track item.id) { ... }',
        switch: 'Expected @switch (value) { ... }',
        defer: 'Expected @defer (on immediate) { ... }',
      }[name];
      diagnostics.push(createDiagnostic(text, match.index, match[0].length, 'NGHTML002', expected));
    }
  }

  const letPattern = /@let\b/g;
  while ((match = letPattern.exec(source))) {
    if (!/^@let\s+[A-Za-z_$][\w$]*\s*=\s*[^;]+;/.test(source.slice(match.index))) {
      diagnostics.push(createDiagnostic(text, match.index, match[0].length, 'NGHTML002', 'Expected @let name = ${value};'));
    }
  }

  const forPattern = /@for\s*\(([\s\S]*?)\)\s*\{/g;
  while ((match = forPattern.exec(source))) {
    if (!/(^|;)\s*track\s+/.test(match[1])) {
      diagnostics.push(createDiagnostic(text, match.index, 4, 'NGHTML003', 'Angular @for blocks require a track expression'));
    }
  }

  return dedupe(diagnostics);
}

export function getCompletions(text, position) {
  const line = text.split(/\r?\n/)[position.line] ?? '';
  const before = line.slice(0, position.character);
  if (before.trim() && !before.includes('@')) return [];
  return COMPLETION_ITEMS;
}

export function getHover(text, position) {
  const offset = positionToOffset(text, position);
  const at = text.lastIndexOf('@', offset);
  if (at < 0) return null;
  const match = text.slice(at).match(/^@(if|for|let|switch|defer)\b/);
  if (!match) return null;
  const docs = {
    if: 'Conditional NGHTML block. Syntax: @if (condition; as alias) { ... } @else { ... }',
    for: 'Repeated NGHTML block. Syntax: @for (item of iterable; track item.id) { ... } @empty { ... }',
    let: 'Adds a named value to the following directive scope.',
    switch: 'Switches among @case blocks and an optional @default block.',
    defer: 'Defers rendering by trigger: immediate, idle, or viewport.',
  };
  return { contents: { kind: 'markdown', value: docs[match[1]] } };
}

export function getDocumentSymbols(text) {
  const symbols = [];
  const pattern = /@(if|for|let|switch|defer)\b/g;
  let match;
  while ((match = pattern.exec(text))) {
    const start = offsetToPosition(text, match.index);
    const end = offsetToPosition(text, match.index + match[0].length);
    symbols.push({
      name: match[0],
      kind: 12,
      range: { start, end },
      selectionRange: { start, end },
    });
  }
  return symbols;
}

function addFoldingRange(ranges, text, startOffset, endOffset, kind, endLineOverride) {
  const start = offsetToPosition(text, startOffset);
  const end = offsetToPosition(text, endOffset);
  const endLine = endLineOverride ?? end.line;
  if (endLine > start.line) {
    ranges.push({ startLine: start.line, endLine, kind });
  }
}

function findMatchingNghtmlBrace(text, opening) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let index = opening; index < text.length; index++) {
    const char = text[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (quote) {
      if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
      continue;
    }
    if (text.startsWith('${', index)) {
      const end = findMatchingBrace(text, index + 1);
      if (end === -1) return -1;
      index = end;
      continue;
    }
    if (text.startsWith('{{', index)) {
      const end = text.indexOf('}}', index + 2);
      if (end === -1) return -1;
      index = end + 1;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{') depth++;
    if (char === '}') {
      depth--;
      if (depth === 0) return index;
    }
  }
  return -1;
}

function getNghtmlFoldingRanges(text, start, end) {
  const ranges = [];
  const region = text.slice(start, end);
  const directivePattern = /@(if|for|switch|defer)\s*\([\s\S]*?\)\s*\{|@(else\s+if)\s*\([\s\S]*?\)\s*\{|@(else|empty|case|default|placeholder|loading|error)(?:\s*\([^)]*\))?\s*\{/g;
  let match;
  while ((match = directivePattern.exec(region))) {
    const directiveName = match[1] ?? match[2] ?? match[3];
    const opening = match.index + match[0].lastIndexOf('{');
    const closing = findMatchingNghtmlBrace(region, opening);
    if (closing !== -1) {
      const continuationPattern = {
        if: /^\s*@else\b/,
        'else if': /^\s*@else\b/,
        for: /^\s*@empty\b/,
        defer: /^\s*@(placeholder|loading|error)\b/,
        placeholder: /^\s*@(loading|error)\b/,
        loading: /^\s*@error\b/,
      }[directiveName];
      const continuesBranch = continuationPattern?.test(region.slice(closing + 1)) ?? false;
      const endLine = continuesBranch
        ? offsetToPosition(text, start + closing).line - 1
        : undefined;
      addFoldingRange(ranges, text, start + match.index, start + closing, 'region', endLine);
    }
  }

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
    'meta', 'param', 'source', 'track', 'wbr',
  ]);
  const tagStack = [];
  const markupPattern = /<!--[\s\S]*?-->|<\/?([A-Za-z][\w:-]*)\b[^>]*>/g;
  while ((match = markupPattern.exec(region))) {
    if (match[0].startsWith('<!--')) {
      addFoldingRange(ranges, text, start + match.index, start + markupPattern.lastIndex - 1, 'comment');
      continue;
    }

    const tagName = match[1].toLowerCase();
    if (match[0].startsWith('</')) {
      const opening = tagStack[tagStack.length - 1];
      if (opening?.tagName === tagName) {
        tagStack.pop();
        addFoldingRange(ranges, text, start + opening.offset, start + markupPattern.lastIndex, 'region');
      }
    } else if (!voidTags.has(tagName) && !match[0].endsWith('/>')) {
      tagStack.push({ tagName, offset: match.index });
    }
  }

  return ranges;
}

export function getFoldingRanges(text, standaloneNghtml = false) {
  const regions = standaloneNghtml
    ? [[0, text.length]]
    : getNghtmlRegions(text);
  return regions.flatMap(([start, end]) => getNghtmlFoldingRanges(text, start, end));
}

function getNghtmlRegions(text) {
  const regions = [];
  const tagPattern = /\bnghtml\s*/g;
  let match;

  while ((match = tagPattern.exec(text))) {
    const opening = match.index + match[0].length;
    if (text[opening] !== '`') continue;
    const start = opening + 1;
    for (let cursor = start; cursor < text.length; cursor++) {
      if (text[cursor] === '\\') {
        cursor++;
        continue;
      }
      if (text[cursor] === '`') {
        regions.push([start, cursor]);
        tagPattern.lastIndex = cursor + 1;
        break;
      }
    }
  }
  return regions;
}

function countHtmlTags(line) {
  let change = 0;
  const tags = line.match(/<\/?[A-Za-z][^>]*>/g) ?? [];
  for (const tag of tags) {
    if (/^<\//.test(tag) || /\/>$/.test(tag)) continue;
    if (!/<\/[A-Za-z][^>]*>/.test(line) || line.indexOf('>') !== line.lastIndexOf('>')) {
      change++;
    }
  }
  for (const _tag of line.match(/<\/[A-Za-z][^>]*>/g) ?? []) {
    change--;
  }
  return change;
}

function countDirectiveBraces(line) {
  const withoutInterpolations = line.replace(/\$\{[^}]*\}/g, '');
  let change = 0;
  let quote = null;
  for (let index = 0; index < withoutInterpolations.length; index++) {
    const char = withoutInterpolations[index];
    if (quote) {
      if (char === '\\') index++;
      else if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '{') change++;
    else if (char === '}') change--;
  }
  return change;
}

export function formatNghtmlText(text) {
  const lines = text.split(/\r?\n/);
  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  let directiveLevel = 0;
  let htmlLevel = 0;
  const formatted = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const closesDirective = /^[}]/.test(line);
    const closesHtml = /^<\//.test(line);
    if (closesDirective) directiveLevel = Math.max(0, directiveLevel - 1);
    if (closesHtml) htmlLevel = Math.max(0, htmlLevel - 1);

    const indent = directiveLevel + htmlLevel;
    formatted.push(`${'  '.repeat(indent)}${line}`);

    if (!closesDirective) {
      directiveLevel += countDirectiveBraces(line);
      directiveLevel = Math.max(0, directiveLevel);
    } else {
      const remaining = countDirectiveBraces(line);
      directiveLevel = Math.max(0, directiveLevel + remaining + 1);
    }

    htmlLevel = Math.max(0, htmlLevel + countHtmlTags(line));
  }

  return formatted.join(newline);
}

export function formatNghtmlDocument(text) {
  const regions = getNghtmlRegions(text);
  if (regions.length === 0) return text;

  let result = '';
  let cursor = 0;
  for (const [start, end] of regions) {
    result += text.slice(cursor, start);
    result += formatNghtmlText(text.slice(start, end));
    cursor = end;
  }
  result += text.slice(cursor);
  return result;
}
