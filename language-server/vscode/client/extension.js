const path = require('node:path');
const vscode = require('vscode');
const { LanguageClient, TransportKind, State } = require('vscode-languageclient/node');

let client;
let outputChannel;

function activate(context) {
  const here = __dirname;
  const serverModule = path.resolve(here, '..', 'server', 'src', 'server.js');
  outputChannel = vscode.window.createOutputChannel('NGHTML Language Server');
  context.subscriptions.push(outputChannel);
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.name = 'NGHTML Language Server';
  statusBarItem.text = '$(symbol-method) NGHTML';
  statusBarItem.tooltip = 'Show NGHTML language server output';
  statusBarItem.command = 'nghtml.showOutput';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
  context.subscriptions.push(
    vscode.commands.registerCommand('nghtml.showOutput', () => {
      outputChannel.show(true);
      outputChannel.appendLine('[NGHTML] Output requested');
    }),
  );

  outputChannel.appendLine('[NGHTML] Extension activating');
  outputChannel.appendLine(`[NGHTML] Server module: ${serverModule}`);

  const fs = require('node:fs');
  outputChannel.appendLine(
    fs.existsSync(serverModule)
      ? '[NGHTML] Server module found'
      : '[NGHTML] ERROR: Server module was not found',
  );

  const options = {
    run: { module: serverModule, transport: TransportKind.stdio },
    debug: { module: serverModule, transport: TransportKind.stdio },
  };
  client = new LanguageClient(
    'nghtml',
    'NGHTML Language Server',
    options,
    {
      documentSelector: [
        { scheme: 'file', language: 'html' },
        { scheme: 'file', language: 'nghtml' },
        { scheme: 'file', language: 'typescript' },
        { scheme: 'file', language: 'javascript' },
        { scheme: 'file', pattern: '**/*.html' },
        { scheme: 'file', pattern: '**/*.nghtml' },
        { scheme: 'file', pattern: '**/*.ts' },
        { scheme: 'file', pattern: '**/*.tsx' },
        { scheme: 'file', pattern: '**/*.js' },
        { scheme: 'file', pattern: '**/*.jsx' },
      ],
      outputChannel,
      traceOutputChannel: outputChannel,
      synchronize: {
        fileEvents: vscode.workspace.createFileSystemWatcher('**/*.{html,nghtml,ts,tsx,js,jsx}'),
      },
      middleware: {
        didOpen: (document, next) => {
          outputChannel.appendLine(`[NGHTML] Open: ${document.uri.toString()}`);
          return next(document);
        },
        didChange: (event, next) => {
          outputChannel.appendLine(`[NGHTML] Change: ${event.document.uri.toString()}`);
          return next(event);
        },
        didSave: (document, next) => {
          outputChannel.appendLine(`[NGHTML] Save: ${document.uri.toString()}`);
          return next(document);
        },
        didClose: (document, next) => {
          outputChannel.appendLine(`[NGHTML] Close: ${document.uri.toString()}`);
          return next(document);
        },
      },
    },
  );
  client.onDidChangeState((event) => {
    if (event.newState === State.Starting) {
      outputChannel.appendLine('[NGHTML] Language server starting');
    } else if (event.newState === State.Running) {
      outputChannel.appendLine('[NGHTML] Language server running');
    } else if (event.newState === State.Stopped) {
      outputChannel.appendLine('[NGHTML] Language server stopped');
    }
  });
  context.subscriptions.push(client);
  client.start();
}

function deactivate() {
  outputChannel?.appendLine('[NGHTML] Extension deactivating');
  return client?.stop();
}

module.exports = { activate, deactivate };
