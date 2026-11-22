import type { TemplateResult } from 'lit';

export type Expression =
  | { type: 'value'; index: number }
  | { type: 'scope'; path: string }
  | { type: 'literal'; value: unknown };

export interface IfBranch {
  condition: Expression | null;
  alias: string | null;
  children: AstNode[];
}

export interface ForAlias {
  name: string;
  source: string;
}

export type AstNode =
  | { type: 'text'; value: string }
  | { type: 'let'; name: string; value: Expression }
  | { type: 'if'; branches: IfBranch[]; elseChildren: AstNode[] }
  | {
      type: 'switch';
      value: Expression;
      cases: Array<{ values: Expression[]; children: AstNode[] }>;
      defaultChildren: AstNode[];
    }
  | {
      type: 'defer';
      trigger: 'idle' | 'immediate' | 'viewport';
      children: AstNode[];
      placeholderChildren: AstNode[];
      loadingChildren: AstNode[];
      errorChildren: AstNode[];
    }
  | {
      type: 'for';
      name: string;
      iterable: Expression;
      track: Expression;
      aliases: ForAlias[];
      children: AstNode[];
      emptyChildren: AstNode[];
    };

export type NghtmlTemplate = TemplateResult;
