import { html, type TemplateResult } from 'lit';
import { keyed } from 'lit/directives/keyed.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import { transformAngularOpeningTag } from './bindings';
import { deferDirective } from './defer';
import { evaluateExpression, parseExpression, resolveScopeValue } from './expressions';
import type { AstNode } from './types';

const TEMPLATE_TOKEN =
  /__NGHTML_VALUE_(\d+)__|\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g;
const templateStringsCache = new WeakMap<AstNode[], Map<string, TemplateStringsArray>>();

export function renderNodes(
  nodes: AstNode[],
  scope: Map<string, unknown>,
  values: unknown[],
  source: string,
): TemplateResult {
  const strings = [''];
  const interpolations: unknown[] = [];

  const appendValue = (value: unknown) => {
    interpolations.push(value);
    strings.push('');
  };

  const appendText = (text: string) => {
    const openingTag = /<[A-Za-z][^<>]*>/g;
    let cursor = 0;
    let match: RegExpExecArray | null;

    while ((match = openingTag.exec(text))) {
      appendTemplateTokens(text.slice(cursor, match.index));
      const result = transformAngularOpeningTag(match[0], scope, values);
      appendTemplateTokens(result.text, result.directives);
      cursor = match.index + match[0].length;
    }
    appendTemplateTokens(text.slice(cursor));
  };

  const appendTemplateTokens = (
    text: string,
    extraValues?: Map<string, unknown>,
  ) => {
    const pattern = new RegExp(
      `${TEMPLATE_TOKEN.source}|__NGHTML_BINDING_(\\d+)__`,
      'g',
    );
    let cursor = 0;
    let token: RegExpExecArray | null;
    while ((token = pattern.exec(text))) {
      strings[strings.length - 1] += text.slice(cursor, token.index);
      if (token[1] !== undefined) {
        appendValue(values[Number(token[1])]);
      } else if (token[2] !== undefined) {
        appendValue(resolveScopeValue(scope, token[2]));
      } else if (token[3] !== undefined) {
        appendValue(extraValues?.get(token[3]));
      }
      cursor = token.index + token[0].length;
    }
    strings[strings.length - 1] += text.slice(cursor);
  };

  for (const node of nodes) {
    if (node.type === 'text') {
      appendText(node.value);
    } else if (node.type === 'let') {
      scope.set(node.name, evaluateExpression(node.value, scope, values));
    } else if (node.type === 'if') {
      let matched = false;
      for (const branch of node.branches) {
        if (!branch.condition) continue;
        const result = evaluateExpression(branch.condition, scope, values);
        if (result) {
          const branchScope = new Map(scope);
          if (branch.alias) branchScope.set(branch.alias, result);
          appendValue(when(true, () =>
            renderNodes(branch.children, branchScope, values, source),
          ));
          matched = true;
          break;
        }
      }
      if (!matched) {
        appendValue(when(true, () =>
          renderNodes(node.elseChildren, new Map(scope), values, source),
        ));
      }
    } else if (node.type === 'switch') {
      const switchValue = evaluateExpression(node.value, scope, values);
      const switchCase = node.cases.find((item) =>
        item.values.some((value) =>
          evaluateExpression(value, scope, values) === switchValue
        ),
      );
      appendValue(when(true, () =>
        renderNodes(
          switchCase?.children ?? node.defaultChildren,
          new Map(scope),
          values,
          source,
        ),
      ));
    } else if (node.type === 'defer') {
      appendValue(deferDirective(
        renderNodes(node.children, new Map(scope), values, source),
        renderNodes(node.placeholderChildren, new Map(scope), values, source),
        renderNodes(node.loadingChildren, new Map(scope), values, source),
        renderNodes(node.errorChildren, new Map(scope), values, source),
        node.trigger,
      ));
    } else {
      const iterable = evaluateExpression(node.iterable, scope, values);
      if (
        iterable == null ||
        typeof (iterable as Iterable<unknown>)?.[Symbol.iterator] !== 'function'
      ) {
        throw new TypeError('@for expects an iterable value');
      }
      const items = [...(iterable as Iterable<unknown>)];
      if (!items.length) {
        appendValue(when(true, () =>
          renderNodes(node.emptyChildren, new Map(scope), values, source),
        ));
        continue;
      }
      appendValue(map(items, (item, index) => {
        const loopScope = new Map(scope);
        loopScope.set(node.name, item);
        loopScope.set('$count', items.length);
        loopScope.set('$index', index);
        loopScope.set('$first', index === 0);
        loopScope.set('$last', index === items.length - 1);
        loopScope.set('$even', index % 2 === 0);
        loopScope.set('$odd', index % 2 === 1);
        for (const alias of node.aliases) {
          loopScope.set(
            alias.name,
            evaluateExpression(parseExpression(alias.source, source, 0), loopScope, values),
          );
        }
        const trackValue = evaluateExpression(node.track, loopScope, values);
        return keyed(trackValue, renderNodes(node.children, loopScope, values, source));
      }));
    }
  }

  let templatesForNodes = templateStringsCache.get(nodes);
  if (!templatesForNodes) {
    templatesForNodes = new Map();
    templateStringsCache.set(nodes, templatesForNodes);
  }
  const key = JSON.stringify(strings);
  let templateStrings = templatesForNodes.get(key);
  if (!templateStrings) {
    Object.defineProperty(strings, 'raw', { value: [...strings] });
    templateStrings = strings as unknown as TemplateStringsArray;
    templatesForNodes.set(key, templateStrings);
  }
  return html(templateStrings, ...interpolations);
}
