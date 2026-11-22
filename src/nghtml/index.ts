import { html, type TemplateResult } from 'lit';
import { analyzeTemplate } from './analyzer';
import { NghtmlSyntaxError } from './errors';
import { parseTemplate } from './parser';
import { renderNodes } from './renderer';
import type { AstNode } from './types';

export { NghtmlSyntaxError } from './errors';
export type NghtmlTemplate = TemplateResult;

const parsedTemplates = new WeakMap<
  TemplateStringsArray,
  { ast: AstNode[]; source: string }
>();

export function nghtml(
  strings: TemplateStringsArray,
  ...values: unknown[]
): TemplateResult {
  let template = parsedTemplates.get(strings);
  if (!template) {
    const source = strings.raw.reduce(
      (result, part, index) =>
        result + part + (index < values.length ? `__NGHTML_VALUE_${index}__` : ''),
      '',
    );
    const ast = parseTemplate(source);
    analyzeTemplate(ast, source);
    template = { ast, source };
    parsedTemplates.set(strings, template);
  }
  return renderNodes(template.ast, new Map(), values, template.source);
}
