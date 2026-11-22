import { NghtmlSyntaxError } from './errors';
import type { Expression } from './types';

export function parseExpression(
  expression: string,
  source: string,
  offset: number,
): Expression {
  const marker = expression.match(/^__NGHTML_VALUE_(\d+)__$/);
  if (marker) return { type: 'value', index: Number(marker[1]) };
  if (expression === 'true' || expression === 'false') {
    return { type: 'literal', value: expression === 'true' };
  }
  if (expression === 'null') return { type: 'literal', value: null };
  if (/^-?(?:\d+|\d*\.\d+)$/.test(expression)) {
    return { type: 'literal', value: Number(expression) };
  }
  const quoted = expression.match(/^(['"])([\s\S]*)\1$/);
  if (quoted) return { type: 'literal', value: quoted[2] };
  if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(expression)) {
    return { type: 'scope', path: expression };
  }
  throw new NghtmlSyntaxError(
    'Directive expressions must be supplied as ${values}, paths, or literals',
    source,
    offset,
  );
}

export function evaluateExpression(
  expression: Expression,
  scope: Map<string, unknown>,
  values: unknown[],
): unknown {
  if (expression.type === 'value') return values[expression.index];
  if (expression.type === 'literal') return expression.value;
  return resolveScopeValue(scope, expression.path);
}

export function resolveScopeValue(
  scope: Map<string, unknown>,
  path: string,
): unknown {
  const [name, ...properties] = path.split('.');
  let value = scope.get(name);
  for (const property of properties) {
    if (
      value == null ||
      (typeof value !== 'object' && typeof value !== 'function')
    ) return undefined;
    value = (value as Record<string, unknown>)[property];
  }
  return value;
}

export function splitOutsideMarkers(value: string, separator: string): string[] {
  const parts: string[] = [];
  let start = 0;
  let quote: '"' | "'" | null = null;
  let escaped = false;
  let braceDepth = 0;

  for (let index = 0; index < value.length; index++) {
    const char = value[index];
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
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '{') braceDepth++;
    else if (char === '}') braceDepth = Math.max(0, braceDepth - 1);
    else if (char === separator && braceDepth === 0) {
      parts.push(value.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(value.slice(start));
  return parts;
}
