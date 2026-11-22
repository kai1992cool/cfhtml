import { NghtmlSyntaxError } from './errors';
import { parseExpression, splitOutsideMarkers } from './expressions';
import type { AstNode, Expression, ForAlias, IfBranch } from './types';

const DIRECTIVE_NAMES = 'if|for|let|switch|defer';

export function parseTemplate(source: string): AstNode[] {
  return parseNodes(source, 0, source.length);
}

function parseNodes(source: string, start: number, end: number): AstNode[] {
  const nodes: AstNode[] = [];
  let cursor = start;

  while (cursor < end) {
    const directive = findDirective(source, cursor, end);
    if (!directive) {
      if (source.slice(cursor, end)) {
        nodes.push({ type: 'text', value: source.slice(cursor, end) });
      }
      break;
    }

    if (directive.index > cursor) {
      nodes.push({ type: 'text', value: source.slice(cursor, directive.index) });
    }

    if (directive.name === 'let') {
      const match = source.slice(directive.index, end).match(
        /^@let\s+([A-Za-z_$][\w$]*)\s*=\s*([^;]+);/,
      );
      if (!match) throw new NghtmlSyntaxError('Expected @let name = ${value};', source, directive.index);
      nodes.push({
        type: 'let',
        name: match[1],
        value: parseExpression(match[2].trim(), source, directive.index),
      });
      cursor = directive.index + match[0].length;
    } else if (directive.name === 'if') {
      const result = parseIf(source, directive.index);
      nodes.push(result.node);
      cursor = result.next;
    } else if (directive.name === 'switch') {
      const result = parseSwitch(source, directive.index);
      nodes.push(result.node);
      cursor = result.next;
    } else if (directive.name === 'defer') {
      const result = parseDefer(source, directive.index);
      nodes.push(result.node);
      cursor = result.next;
    } else {
      const result = parseFor(source, directive.index);
      nodes.push(result.node);
      cursor = result.next;
    }
  }

  return nodes;
}

function findDirective(
  source: string,
  start: number,
  end: number,
): { index: number; name: 'if' | 'for' | 'let' | 'switch' | 'defer' } | null {
  const pattern = new RegExp(`@(${DIRECTIVE_NAMES})\\b`, 'g');
  pattern.lastIndex = start;

  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) && match.index < end) {
    if (isStructuralDirective(source, match.index)) {
      return {
        index: match.index,
        name: match[1] as 'if' | 'for' | 'let' | 'switch' | 'defer',
      };
    }
  }
  return null;
}

function isStructuralDirective(source: string, index: number): boolean {
  const before = source.slice(0, index);
  let quote: '"' | "'" | null = null;
  let escaped = false;
  for (let cursor = 0; cursor < before.length; cursor++) {
    const char = before[cursor];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\' && quote) {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = null;
    } else if (char === '"' || char === "'") {
      quote = char;
    }
  }
  if (quote) return false;

  const tagStart = before.lastIndexOf('<');
  const tagEnd = before.lastIndexOf('>');
  if (tagStart > tagEnd) return false;

  const rawStart = before.lastIndexOf('<style');
  const rawEnd = before.lastIndexOf('</style>');
  if (rawStart > rawEnd) return false;
  const scriptStart = before.lastIndexOf('<script');
  const scriptEnd = before.lastIndexOf('</script>');
  if (scriptStart > scriptEnd) return false;
  return true;
}

function parseIf(source: string, start: number): { node: AstNode; next: number } {
  const header = source.slice(start).match(/^@if\s*\(([\s\S]*?)\)\s*\{/);
  if (!header) throw new NghtmlSyntaxError('Expected @if (test; as alias) { ... }', source, start);

  const parts = splitOutsideMarkers(header[1], ';');
  if (parts.length > 2) throw new NghtmlSyntaxError('Invalid @if header', source, start);
  const alias = parseIfAlias(parts[1], source, start);
  const opening = start + header[0].lastIndexOf('{');
  const closing = findMatchingBrace(source, opening);
  if (closing === -1) throw new NghtmlSyntaxError('Unclosed @if block', source, start);

  const branches: IfBranch[] = [{
    condition: parseExpression(parts[0].trim(), source, start),
    alias,
    children: parseNodes(source, opening + 1, closing),
  }];
  let cursor = closing + 1;

  while (cursor < source.length) {
    const elseIf = source.slice(cursor).match(/^(\s*)@else\s+if\s*\(([\s\S]*?)\)\s*\{/);
    if (elseIf) {
      const blockStart = cursor + elseIf[0].lastIndexOf('{');
      const blockEnd = findMatchingBrace(source, blockStart);
      if (blockEnd === -1) throw new NghtmlSyntaxError('Unclosed @else if block', source, cursor);
      const parts = splitOutsideMarkers(elseIf[2], ';');
      branches.push({
        condition: parseExpression(parts[0].trim(), source, cursor),
        alias: parseIfAlias(parts[1], source, cursor),
        children: parseNodes(source, blockStart + 1, blockEnd),
      });
      cursor = blockEnd + 1;
      continue;
    }
    const elseBlock = source.slice(cursor).match(/^(\s*)@else\s*\{/);
    if (elseBlock) {
      const blockStart = cursor + elseBlock[0].lastIndexOf('{');
      const blockEnd = findMatchingBrace(source, blockStart);
      if (blockEnd === -1) throw new NghtmlSyntaxError('Unclosed @else block', source, cursor);
      return {
        node: { type: 'if', branches, elseChildren: parseNodes(source, blockStart + 1, blockEnd) },
        next: blockEnd + 1,
      };
    }
    break;
  }
  return { node: { type: 'if', branches, elseChildren: [] }, next: cursor };
}

function parseIfAlias(part: string | undefined, source: string, offset: number): string | null {
  if (part === undefined) return null;
  const alias = part.trim().match(/^as\s+([A-Za-z_$][\w$]*)$/);
  if (!alias) throw new NghtmlSyntaxError('Expected @if (...; as alias)', source, offset);
  return alias[1];
}

function parseFor(source: string, start: number): { node: AstNode; next: number } {
  const header = source.slice(start).match(/^@for\s*\(([\s\S]*?)\)\s*\{/);
  if (!header) throw new NghtmlSyntaxError('Expected @for (item of items; track item.id)', source, start);
  const parts = splitOutsideMarkers(header[1], ';');
  const loop = parts[0].trim().match(/^(?:(?:const|let|var)\s+)?([A-Za-z_$][\w$]*)\s+of\s+(.+)$/);
  if (!loop) throw new NghtmlSyntaxError('Expected @for (item of items; track item.id)', source, start);

  let track: Expression | null = null;
  const aliases: ForAlias[] = [];
  for (const part of parts.slice(1)) {
    const trimmed = part.trim();
    const trackMatch = trimmed.match(/^track\s+(.+)$/);
    if (trackMatch) {
      if (track) throw new NghtmlSyntaxError('Duplicate @for track expression', source, start);
      track = parseExpression(trackMatch[1].trim(), source, start);
      continue;
    }
    const letMatch = trimmed.match(/^let\s+(.+)$/);
    if (letMatch) {
      for (const declaration of letMatch[1].split(',')) {
        const alias = declaration.trim().match(/^([A-Za-z_$][\w$]*)\s*=\s*(\$[A-Za-z_$][\w$]*|[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)$/);
        if (!alias) throw new NghtmlSyntaxError('Expected @for (...; let alias = $first)', source, start);
        aliases.push({ name: alias[1], source: alias[2] });
      }
      continue;
    }
    throw new NghtmlSyntaxError('Expected track expression or let aliases', source, start);
  }
  if (!track) throw new NghtmlSyntaxError('Angular @for blocks require a track expression', source, start);

  const opening = start + header[0].lastIndexOf('{');
  const closing = findMatchingBrace(source, opening);
  if (closing === -1) throw new NghtmlSyntaxError('Unclosed @for block', source, start);

  let cursor = closing + 1;
  let emptyChildren: AstNode[] = [];
  const empty = source.slice(cursor).match(/^(\s*)@empty\s*\{/);
  if (empty) {
    const blockStart = cursor + empty[0].lastIndexOf('{');
    const blockEnd = findMatchingBrace(source, blockStart);
    if (blockEnd === -1) throw new NghtmlSyntaxError('Unclosed @empty block', source, cursor);
    emptyChildren = parseNodes(source, blockStart + 1, blockEnd);
    cursor = blockEnd + 1;
  }

  return {
    node: {
      type: 'for',
      name: loop[1],
      iterable: parseExpression(loop[2].trim(), source, start),
      track,
      aliases,
      children: parseNodes(source, opening + 1, closing),
      emptyChildren,
    },
    next: cursor,
  };
}

function parseSwitch(source: string, start: number): { node: AstNode; next: number } {
  const header = source.slice(start).match(/^@switch\s*\(([\s\S]*?)\)\s*\{/);
  if (!header) throw new NghtmlSyntaxError('Expected @switch (value) { ... }', source, start);
  const opening = start + header[0].lastIndexOf('{');
  const closing = findMatchingBrace(source, opening);
  if (closing === -1) throw new NghtmlSyntaxError('Unclosed @switch block', source, start);

  const cases: Array<{ values: Expression[]; children: AstNode[] }> = [];
  let defaultChildren: AstNode[] = [];
  const inner = source.slice(opening + 1, closing);
  const pattern = /@(?:case|default)\b/g;
  let cursor = 0;

  let section: RegExpExecArray | null;
  while (true) {
    section = pattern.exec(inner);
    if (!section) break;
    const sectionIndex = section.index;
    const prefix = inner.slice(cursor, sectionIndex);
    if (prefix.trim()) throw new NghtmlSyntaxError('Unexpected content inside @switch block', source, opening + sectionIndex);
    if (section[0] === '@case') {
      const caseHeader = inner.slice(sectionIndex).match(/^@case\s*\(([\s\S]*?)\)\s*\{/);
      if (!caseHeader) throw new NghtmlSyntaxError('Expected @case (value) { ... }', source, opening + sectionIndex);
      const blockStart = sectionIndex + caseHeader[0].lastIndexOf('{');
      const absoluteStart = opening + 1 + blockStart;
      const blockEnd = findMatchingBrace(source, absoluteStart);
      if (blockEnd === -1 || blockEnd >= closing) throw new NghtmlSyntaxError('Unclosed @case block', source, opening + sectionIndex);
      cases.push({
        values: splitOutsideMarkers(caseHeader[1], ',').map((value) =>
          parseExpression(value.trim(), source, opening + sectionIndex),
        ),
        children: parseNodes(source, absoluteStart + 1, blockEnd),
      });
      cursor = blockEnd - opening;
      pattern.lastIndex = cursor;
    } else {
      const defaultHeader = inner.slice(sectionIndex).match(/^@default\s*\{/);
      if (!defaultHeader) throw new NghtmlSyntaxError('Expected @default { ... }', source, opening + sectionIndex);
      const blockStart = sectionIndex + defaultHeader[0].lastIndexOf('{');
      const absoluteStart = opening + 1 + blockStart;
      const blockEnd = findMatchingBrace(source, absoluteStart);
      if (blockEnd === -1 || blockEnd >= closing) throw new NghtmlSyntaxError('Unclosed @default block', source, opening + sectionIndex);
      defaultChildren = parseNodes(source, absoluteStart + 1, blockEnd);
      cursor = blockEnd - opening;
      pattern.lastIndex = cursor;
    }
  }

  return {
    node: {
      type: 'switch',
      value: parseExpression(header[1].trim(), source, start),
      cases,
      defaultChildren,
    },
    next: closing + 1,
  };
}

function parseDefer(source: string, start: number): { node: AstNode; next: number } {
  const header = source.slice(start).match(/^@defer(?:\s*\(([^)]*)\))?\s*\{/);
  if (!header) throw new NghtmlSyntaxError('Expected @defer { ... }', source, start);
  const triggerText = (header[1] ?? '').trim();
  let trigger: 'idle' | 'immediate' | 'viewport' = 'idle';
  if (triggerText === 'on immediate') trigger = 'immediate';
  else if (triggerText === 'on viewport') trigger = 'viewport';
  else if (triggerText && triggerText !== 'on idle') {
    throw new NghtmlSyntaxError('Supported defer triggers are on idle, on immediate, and on viewport', source, start);
  }

  const opening = start + header[0].lastIndexOf('{');
  const closing = findMatchingBrace(source, opening);
  if (closing === -1) throw new NghtmlSyntaxError('Unclosed @defer block', source, start);
  let cursor = closing + 1;
  let placeholderChildren: AstNode[] = [];
  let loadingChildren: AstNode[] = [];
  let errorChildren: AstNode[] = [];

  while (cursor < source.length) {
    const block = source.slice(cursor).match(/^(\s*)@(placeholder|loading|error)(?:\s*\([^)]*\))?\s*\{/);
    if (!block) break;
    const kind = block[2];
    const blockStart = cursor + block[0].lastIndexOf('{');
    const blockEnd = findMatchingBrace(source, blockStart);
    if (blockEnd === -1) throw new NghtmlSyntaxError(`Unclosed @${kind} block`, source, cursor);
    const children = parseNodes(source, blockStart + 1, blockEnd);
    if (kind === 'placeholder') placeholderChildren = children;
    else if (kind === 'loading') loadingChildren = children;
    else errorChildren = children;
    cursor = blockEnd + 1;
  }

  return {
    node: {
      type: 'defer',
      trigger,
      children: parseNodes(source, opening + 1, closing),
      placeholderChildren,
      loadingChildren,
      errorChildren,
    },
    next: cursor,
  };
}

function findMatchingBrace(source: string, openingBrace: number): number {
  let depth = 1;
  let quote: '"' | "'" | null = null;

  for (let index = openingBrace + 1; index < source.length; index++) {
    if (source.startsWith('{{', index)) {
      const end = source.indexOf('}}', index + 2);
      if (end === -1) return -1;
      index = end + 1;
      continue;
    }
    const char = source[index];
    if (quote) {
      if (char === quote && source[index - 1] !== '\\') quote = null;
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return index;
  }
  return -1;
}
