import { NghtmlSyntaxError } from './errors';
import type { AstNode } from './types';

const SCOPE_MARKER = /\{\{\s*([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\}\}/g;

export function analyzeTemplate(nodes: AstNode[], source: string): void {
  validateScope(nodes, new Set(), source);
  validateBindings(nodes, source);
}

function validateScope(nodes: AstNode[], scope: Set<string>, source: string): void {
  const visible = new Set(scope);
  for (const node of nodes) {
    if (node.type === 'text') {
      for (const match of node.value.matchAll(SCOPE_MARKER)) {
        const name = match[1].split('.')[0];
        if (!visible.has(name)) {
          throw new NghtmlSyntaxError(
            `Unknown template variable "${name}"`,
            source,
            source.indexOf(match[0]),
          );
        }
      }
    } else if (node.type === 'let') {
      visible.add(node.name);
    } else if (node.type === 'if') {
      for (const branch of node.branches) {
        const branchScope = new Set(visible);
        if (branch.alias) branchScope.add(branch.alias);
        validateScope(branch.children, branchScope, source);
      }
      validateScope(node.elseChildren, visible, source);
    } else if (node.type === 'switch') {
      for (const switchCase of node.cases) {
        validateScope(switchCase.children, visible, source);
      }
      validateScope(node.defaultChildren, visible, source);
    } else if (node.type === 'defer') {
      validateScope(node.children, visible, source);
      validateScope(node.placeholderChildren, visible, source);
      validateScope(node.loadingChildren, visible, source);
      validateScope(node.errorChildren, visible, source);
    } else {
      const loopScope = new Set(visible);
      loopScope.add(node.name);
      for (const name of ['$count', '$index', '$first', '$last', '$even', '$odd']) {
        loopScope.add(name);
      }
      for (const alias of node.aliases) loopScope.add(alias.name);
      validateScope(node.children, loopScope, source);
      validateScope(node.emptyChildren, visible, source);
    }
  }
}

function validateBindings(nodes: AstNode[], source: string): void {
  for (const node of nodes) {
    if (node.type === 'text') continue;
    if (node.type === 'if') {
      node.branches.forEach((branch) => validateBindings(branch.children, source));
      validateBindings(node.elseChildren, source);
    } else if (node.type === 'switch') {
      node.cases.forEach((item) => validateBindings(item.children, source));
      validateBindings(node.defaultChildren, source);
    } else if (node.type === 'defer') {
      validateBindings(node.children, source);
      validateBindings(node.placeholderChildren, source);
      validateBindings(node.loadingChildren, source);
      validateBindings(node.errorChildren, source);
    } else if (node.type === 'for') {
      validateBindings(node.children, source);
      validateBindings(node.emptyChildren, source);
    }
  }
}
