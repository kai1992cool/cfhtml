export class NghtmlSyntaxError extends SyntaxError {
  readonly line: number;
  readonly column: number;

  constructor(message: string, source: string, offset = 0) {
    const safeOffset = Math.max(0, Math.min(offset, source.length));
    const beforeError = source.slice(0, safeOffset);
    const line = beforeError.split('\n').length;
    const column = safeOffset - beforeError.lastIndexOf('\n');
    super(`${message} (line ${line}, column ${column})`);
    this.line = line;
    this.column = column;
    this.name = 'NghtmlSyntaxError';
  }
}
