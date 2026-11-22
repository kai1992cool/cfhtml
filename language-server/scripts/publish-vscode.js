import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const action = process.argv[2];
if (!['package', 'publish'].includes(action)) {
  console.error('Usage: node scripts/publish-vscode.js <package|publish>');
  process.exit(2);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const languageServerDir = path.resolve(scriptDir, '..');
const vscodeDir = path.join(languageServerDir, 'vscode');
const serverDir = path.join(vscodeDir, 'server');

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

main();

async function main() {
  try {
    await cp(path.join(languageServerDir, '..', 'LICENSE'), path.join(vscodeDir, 'LICENSE'), {
      force: true,
    });
    await cp(path.join(languageServerDir, '..', 'README.md'), path.join(vscodeDir, 'README.md'), {
      force: true,
    });
    await rm(serverDir, { recursive: true, force: true });
    await mkdir(path.join(serverDir, 'src'), { recursive: true });
    await cp(path.join(languageServerDir, 'src', 'core.js'), path.join(serverDir, 'src', 'core.js'));
    await cp(path.join(languageServerDir, 'src', 'server.js'), path.join(serverDir, 'src', 'server.js'));
    await writeFile(
      path.join(serverDir, 'package.json'),
      `${JSON.stringify({
        name: 'nghtml-language-server-bundle',
        private: true,
        type: 'module',
        dependencies: {
          'vscode-languageserver': '^9.0.0',
          'vscode-languageserver-textdocument': '^1.0.0',
        },
      }, null, 2)}\n`,
    );

    console.log('Installing VS Code extension dependencies...');
    await run('npm', ['install', '--omit=dev'], vscodeDir);

    console.log('Installing bundled language server dependencies...');
    await run('npm', ['install', '--omit=dev'], serverDir);

    const vsce = process.platform === 'win32'
      ? path.join(languageServerDir, 'node_modules', '.bin', 'vsce.cmd')
      : path.join(languageServerDir, 'node_modules', '.bin', 'vsce');

    if (action === 'package') {
      console.log('Packaging NGHTML VSIX...');
      await run(vsce, ['package'], vscodeDir);
      console.log('VSIX package created in language-server/vscode.');
    } else {
      console.log('Publishing NGHTML VSIX...');
      await run(vsce, ['publish'], vscodeDir);
      console.log('NGHTML extension published.');
    }
  } catch (error) {
    console.error(`\nVS Code deployment failed: ${error.message}`);
    process.exitCode = 1;
  }
}
