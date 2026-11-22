Understood. The package is a standalone domain-specific language or templating format; Angular was irrelevant.

# Revised plan

## 1. Build one language core

Create a package independent of editors:

```text
your-language/
  parser/
  validator/
  resolver/
  formatter/
  lsp-server/
  clients/
  test-fixtures/
```

The core should contain:

- Lexer and parser
- Syntax and semantic validator
- Error recovery for incomplete edits
- Document and symbol indexing
- Incremental parsing where practical
- Public diagnostic types
- A CLI or API used by the build system
- Configuration discovery
- Optional completions and hover support

The editor clients should remain thin.

```text
Editor
  -> editor-specific adapter
  -> LSP client
  -> language server
  -> shared parser and validator
  -> project/config resolver
```

## 2. Put diagnostics in the core

Do not let each editor implement validation.

Return structured diagnostics such as:

```json
{
  "range": {
    "start": { "line": 12, "character": 8 },
    "end": { "line": 12, "character": 15 }
  },
  "severity": "error",
  "code": "invalid-argument",
  "message": "Unknown option \"colour\"",
  "source": "my-package",
  "suggestions": ["Add \"color\"", "Remove this option"]
}
```

Recommended severity levels:

- Error: build will fail
- Warning: suspicious but build may succeed
- Information: documentation or style hint
- Hint: optional suggestion

Keep stable diagnostic codes so users and CI can filter or suppress them.

## 3. Language Server Protocol

Implement an LSP server over `stdio`:

- `textDocument/publishDiagnostics`
- `textDocument/didOpen`
- `textDocument/didChange`
- `textDocument/didSave`
- `textDocument/completion`
- `textDocument/hover`
- `textDocument/definition`
- `textDocument/documentSymbol`
- `workspace/didChangeConfiguration`
- `workspace/didChangeWatchedFiles`

A good first implementation needs only:

- Document synchronization
- Diagnostics
- Code actions for quick fixes
- Formatting, if the format is stable
- Completions, if there is a schema or reference model

Use Node.js/TypeScript if the package is already JavaScript or TypeScript. Rust or Go may be preferable for large files or expensive validation.

## 4. Syntax recovery

The parser must remain useful while users are still typing.

Examples:

```text
section {
  missing:
}
```

For incomplete input:

- Report the expected token once
- Avoid cascading errors
- Do not mark the entire file as invalid
- Preserve enough structure for later completions
- Re-run only affected sections after edits

Debounce diagnostics:

- 100–200 ms for validation
- Longer for workspace-wide or external resolution
- Immediately on save
- Immediately after configuration changes

## 5. File associations

Do not guess files solely from extension if the format can appear inside other files.

Support:

- Custom extension, such as `.mypackage`
- Embedded blocks inside existing documents
- VS Code language IDs
- Zed language patterns
- JetBrains file-type patterns
- Kiro-supported extension or LSP configuration

For embedded syntax, provide an LSP range only for the embedded block so diagnostics do not incorrectly highlight the surrounding document.

## 6. Build-system integration

Share the exact validator with:

- The CLI
- The editor server
- Library consumers
- CI validation
- Pre-commit hooks

The CLI should support:

```bash
my-tool check .
my-tool check file.mypackage --format=json
my-tool check file.mypackage --pretty
```

The editor server should consume the same parser and diagnostic code, but formatting and exit statuses belong in the CLI.

## 7. Editor integrations

| Editor | Approach |
|---|---|
| VS Code | Marketplace extension containing LSP client and server |
| Kiro | Reuse the VS Code-compatible package if it supports VS Code extensions; validate publishing separately |
| Zed | Zed extension registering the language and server command |
| JetBrains IDEs | Plugin using JetBrains LSP support or a native file/PSI integration |
| Neovim | Generic LSP configuration and server package |
| Sublime Text | LSP package configuration |
| Emacs | LSP-mode or eglot configuration |
| Helix | `languages.toml` plus server command |
| Eclipse/Theia | Generic LSP integration |

VS Code should be the reference implementation.

## 8. Distribution

Offer all of these:

```text
@vendor/my-language-server
@vendor/my-language-vscode
@vendor/my-language-cli
```

Serve the server in multiple forms:

- NPM package for Node.js projects
- Single standalone binary for each OS/architecture
- VS Code-bundled server
- JetBrains plugin-bundled server
- Zed extension-bundled or auto-downloaded binary
- Docker image, for custom environments

Avoid downloading a server during editor activation. If downloading is necessary, show an explicit error and provide offline installation.

## 9. Configuration

Use an editor-independent configuration file:

```json
{
  "diagnostics": {
    "delay": 150,
    "warnings": true
  },
  "rules": {
    "noDeprecatedOption": "error",
    "requireName": "error"
  }
}
```

The LSP settings can map to this format:

```json
{
  "myLanguage.diagnostics.enabled": true,
  "myLanguage.diagnostics.delay": 150,
  "myLanguage.trace.server": "off"
}
```

Support:

- Workspace configuration
- Project-local configuration
- Global defaults
- Editor settings
- Config-file precedence
- Configuration hot reload

## 10. Testing

Test the validator independently from the editor.

### Unit tests

- Valid documents
- Each syntax error
- Offset handling
- CRLF and Unicode
- Incomplete expressions
- Configuration errors
- Duplicate definitions
- Reference resolution
- Rule suppression

### Integration tests

- LSP initialization
- File open/change/save
- Diagnostic updates
- Workspace changes
- Quick fixes
- Completion insertion
- Multiple projects opened at once
- Server restart
- Corrupt or unsupported configuration

### Snapshot tests

Store representative invalid documents and expected:

- Diagnostic ranges
- Messages
- Error codes
- Severity
- Applied quick fixes

## 11. Packaging phases

### Phase 1: Core MVP

- Stable parser
- Syntax diagnostics
- CLI validation
- VS Code extension
- Unit and LSP integration tests
- One npm/package release

### Phase 2: Editor coverage

- Zed
- Kiro, after confirming supported extension mechanics
- JetBrains IDE
- Neovim/Helix configuration
- Binary releases

### Phase 3: Developer experience

- Completions
- Hover documentation
- Go to definition
- Find references
- Rename
- Formatting
- Code actions
- Workspace-wide diagnostics
- Monorepo support
- Telemetry, opt-in only

## 12. Repository structure

```text
packages/
  core/
  cli/
  lsp-server/
  vscode/
  jetbrains/
  zed/
  shared-test-fixtures/
docs/
examples/
scripts/
```

The release pipeline should publish packages and binaries automatically only after:

- Parser tests pass
- LSP tests pass
- CLI output is stable
- Platform binaries run in smoke tests
- VSIX/plugin packages validate

The essential principle is that **the parser and diagnostics are your product**. Editors are delivery adapters around a stable core.