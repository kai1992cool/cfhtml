import { type TemplateResult } from 'lit';
import type { AstNode } from './types';
export declare function renderNodes(nodes: AstNode[], scope: Map<string, unknown>, values: unknown[], source: string): TemplateResult;
