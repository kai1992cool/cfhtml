import type { Expression } from './types';
export declare function parseExpression(expression: string, source: string, offset: number): Expression;
export declare function evaluateExpression(expression: Expression, scope: Map<string, unknown>, values: unknown[]): unknown;
export declare function resolveScopeValue(scope: Map<string, unknown>, path: string): unknown;
export declare function splitOutsideMarkers(value: string, separator: string): string[];
