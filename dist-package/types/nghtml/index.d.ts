import { type TemplateResult } from 'lit';
export { NghtmlSyntaxError } from './errors';
export type NghtmlTemplate = TemplateResult;
export declare function nghtml(strings: TemplateStringsArray, ...values: unknown[]): TemplateResult;
