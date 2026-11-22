export declare class NghtmlSyntaxError extends SyntaxError {
    readonly line: number;
    readonly column: number;
    constructor(message: string, source: string, offset?: number);
}
