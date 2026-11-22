# Publishing the NGHTML VS Code Extension

The VS Code extension is under `language-server/vscode`. The scripts in
`language-server/scripts/publish-vscode.js` bundle the language server,
install its runtime dependencies, copy the repository license and README,
and create or publish the VSIX package.

## Prerequisites

- Node.js and npm
- A Visual Studio Marketplace publisher account
- A publisher name matching `kurama-labs` in
  `language-server/vscode/package.json`
- A Personal Access Token (PAT) authorized for the **Marketplace: Manage**
  scope

Create or manage the publisher at:

<https://marketplace.visualstudio.com/manage>

Install the language-server dependencies first:

```powershell
npm install --prefix .\language-server
```

## Package the extension

From the repository root, run:

```powershell
npm run vscode:package --prefix .\language-server
```

This bundles the language server and creates:

```text
language-server\vscode\nghtml-vscode-0.1.0.vsix
```

The script also copies `LICENSE` and `README.md` into the VS Code extension
package.

## Test the VSIX locally

Install the generated package into VS Code:

```powershell
code --install-extension .\language-server\vscode\nghtml-vscode-0.1.0.vsix
```

Alternatively, open the Extensions view in VS Code, choose
**Extensions: Install from VSIX...**, and select the `.vsix` file.

Verify that:

- NGHTML diagnostics appear in `.html` and `.nghtml` files.
- Directive completions appear after `@`.
- Hover and document symbols work.
- The language server starts without console errors.

Open **View > Output**, then select **NGHTML Language Server** from the
Output channel dropdown. You can also run **NGHTML: Show Language Server
Output** from the Command Palette.

The channel logs extension activation, server module resolution, server
startup state, opened/changed/saved/closed documents, validation runs,
and published diagnostic counts. Set `nghtml.trace.server` to `messages`
or `verbose` for protocol tracing.

The channel is created during `onStartupFinished`, so it should appear even
before a NGHTML document is opened. If it is not listed:

1. Reload VS Code with **Developer: Reload Window**.
2. Run **NGHTML: Show Language Server Output** from the Command Palette.
3. Open **View > Output** and select **NGHTML Language Server**.
4. Check **Developer: Show Running Extensions** to confirm
   `nghtml-vscode` is running.

## Authenticate with VSCE

Log in with the Marketplace publisher name:

```powershell
npx @vscode/vsce login kurama-labs
```

You can also use an environment variable on automation machines:

```powershell
$env:VSCE_PAT = "your-marketplace-token"
```

Do not commit the PAT or add it to `package.json`.

## Publish the extension

From the repository root, run:

```powershell
npm run vscode:publish --prefix .\language-server
```

The publish script packages and uploads the same VSIX contents that are
produced by `npm run vscode:package --prefix .\language-server`.

Before publishing a later release, update `version` in
`language-server/vscode/package.json` and the server package version if
appropriate. For example:

```powershell
npx @vscode/vsce publish 0.1.1
```

The publish script can also be invoked directly:

```powershell
npm run vscode:publish --prefix .\language-server
```

## Script locations

- Publish script: `language-server/scripts/publish-vscode.js`
- Extension manifest: `language-server/vscode/package.json`
- Extension activation: `language-server/vscode/client/extension.js`
- Bundled server destination: `language-server/vscode/server`

## Troubleshooting

### Publisher does not match

`publisher` in `language-server/vscode/package.json` must be registered under
the Marketplace account used for publishing.

### Authentication fails

Verify that:

- The PAT has the **Marketplace: Manage** scope.
- The PAT is not expired.
- `VSCE_PAT` is set in the current PowerShell session.
- You logged in with `npx @vscode/vsce login kurama-labs`.

### VSIX is missing the server

Run the package script again. It recreates
`language-server/vscode/server` from `language-server/src/core.js` and
`language-server/src/server.js`, then installs the bundled server dependencies.

### Marketplace validation fails

Run a package before publishing:

```powershell
npm run vscode:package --prefix .\language-server
npx @vscode/vsce ls --packagePath .\language-server\vscode\nghtml-vscode-0.1.0.vsix
```
