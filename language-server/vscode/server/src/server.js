import {
  createConnection,
  ProposedFeatures,
  TextDocuments,
  TextDocumentSyncKind,
} from 'vscode-languageserver/node.js';
import { TextDocument } from 'vscode-languageserver-textdocument';
import {
  getCompletions,
  getDocumentSymbols,
  getFoldingRanges,
  getHover,
  formatNghtmlDocument,
  validateNghtmlDocument,
} from './core.js';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);
const debounceTimers = new Map();

connection.onInitialize(() => ({
  capabilities: {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    completionProvider: { resolveProvider: false, triggerCharacters: ['@'] },
    hoverProvider: true,
    documentSymbolProvider: true,
    documentFormattingProvider: true,
    foldingRangeProvider: true,
  },
}));

connection.onInitialized(() => {
  connection.console.info('[NGHTML] Language server initialized');
});

documents.onDidOpen((event) => scheduleValidation(event.document));
documents.onDidChangeContent((event) => scheduleValidation(event.document));
documents.onDidSave((event) => scheduleValidation(event.document));
documents.onDidClose((event) => {
  clearTimeout(debounceTimers.get(event.document.uri));
  debounceTimers.delete(event.document.uri);
  connection.sendDiagnostics({ uri: event.document.uri, diagnostics: [] });
});

function scheduleValidation(document) {
  clearTimeout(debounceTimers.get(document.uri));
  connection.console.info(`[NGHTML] Validating ${document.uri}`);
  const timer = setTimeout(() => {
    const diagnostics = validateNghtmlDocument(document.getText()).map((item) => ({
      ...item,
      severity: item.severity === 'warning' ? 2 : 1,
    }));
    connection.console.info(`[NGHTML] Published ${diagnostics.length} diagnostic(s) for ${document.uri}`);
    connection.sendDiagnostics({ uri: document.uri, diagnostics });
  }, 150);
  debounceTimers.set(document.uri, timer);
}

connection.onCompletion((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return null;
  return getCompletions(document.getText(), params.position).map((item) => ({
    label: item.label,
    kind: item.kind,
    detail: item.detail,
    insertText: item.insertText,
    insertTextFormat: 2,
  }));
});

connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  return document ? getHover(document.getText(), params.position) : null;
});

connection.onDocumentSymbol((params) => {
  const document = documents.get(params.textDocument.uri);
  return document ? getDocumentSymbols(document.getText()) : [];
});

connection.onFoldingRanges((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return [];
  return getFoldingRanges(
    document.getText(),
    /\.nghtml(?:$|[?#])/i.test(params.textDocument.uri),
  );
});

connection.onDocumentFormatting((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) return [];
  const text = document.getText();
  const formatted = formatNghtmlDocument(text);
  if (formatted === text) return [];

  return [{
    range: {
      start: { line: 0, character: 0 },
      end: document.positionAt(text.length),
    },
    newText: formatted,
  }];
});

documents.listen(connection);
connection.listen();
