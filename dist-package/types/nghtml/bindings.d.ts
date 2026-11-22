export interface BindingResult {
    text: string;
    directives: Map<string, unknown>;
}
export declare function transformAngularOpeningTag(tag: string, scope: Map<string, unknown>, values: unknown[]): BindingResult;
