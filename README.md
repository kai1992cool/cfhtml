# NGHTML

NGHTML adds Angular-inspired control-flow syntax to Lit templates. Install it
from npm and import `nghtml` from the package root:

```sh
npm install lit
npm install -D @kurama-labs/nghtml
```

```ts
import { LitElement } from 'lit';
import { nghtml } from '@kurama-labs/nghtml';

class TaskList extends LitElement {
  static properties = { tasks: { type: Array } };
  tasks = [{ id: 1, label: 'Use NGHTML from npm' }];

  render() {
    return nghtml`
      @for (task of ${this.tasks}; track task.id) {
        <p>{{ task.label }}</p>
      } @empty {
        <p>No tasks yet.</p>
      }
    `;
  }
}

customElements.define('task-list', TaskList);
```

`nghtml` returns a Lit `TemplateResult`. Lit is a peer dependency and should
also be installed by applications using it. Template analysis errors are
thrown to the caller as `NghtmlSyntaxError`; they are not replaced with fallback
markup.

The package publishes an ES module and TypeScript declarations. `npm run
build:package` builds the distributable package into `dist-package/`, and
`npm pack --dry-run` previews the files that will be included in an npm release.

- `@if (${condition}; as alias) { ... } @else if (...) { ... } @else { ... }`
- `@for (item of ${iterable}; track item.id; let idx = $index) { ... } @empty { ... }`
- `@let name = ${value};` adds a value to the following directive scope.
- Use `{{ name }}` or a property path such as `{{ item.name }}` to reference
  directive-scope values. `$index` is available inside `@for`.
- `[class]=${value}` and `[class.name]=${value}` bind classes.
- `[style]=${value}` and `[style.property]=${value}` bind styles.
- `[style.width.px]=${value}` adds the unit suffix to a numeric style value.
- `[attr.name]=${value}` and `[attr.data-name]=${value}` bind attributes.
- Native `data-name="value"` attributes are supported directly.
- `@switch (value) { @case (one) { ... } @default { ... } }`
- `@defer (on immediate) { ... } @placeholder { ... } @loading { ... } @error { ... }`
- `@defer (on idle) { ... }` and `@defer (on viewport) { ... }` triggers are supported.
- `animate.enter="fade-in"` and `[animate.enter]=${classes}` apply enter CSS classes.
- `animate.leave="fade-out"` and `[animate.leave]=${classes}` apply leave CSS classes.
- `(animate.enter)=${handler}` and `(animate.leave)=${handler}` support callback animation event handlers.
- Lit event bindings such as `@click=${handler}` pass through unchanged.
- Directive expressions are supplied as normal JavaScript template
  interpolations, so their evaluation errors propagate normally.

Run `npm test` for tests and `npm run build` to create the production bundle.

## Interactive demos

Run `npm run dev` and open `/demos/` to explore ten interactive examples built
as independent custom elements with `LitElement` and `nghtml` templates. Each
demo lives in its own folder with an `index.html` route and component module:
task list, focus timer, expense tracker, habit tracker, shopping cart, quiz,
guest list, Kanban board, appointment booking, and music player. The production
build includes the landing page, [Getting Started](./getting-started/), gallery,
and all ten standalone demo routes.

## GitHub Pages

The `.github/workflows/pages.yml` workflow runs tests and builds the site on
pull requests and pushes to `main`. Pushes to `main` and manual workflow runs
deploy the generated `dist/` directory to GitHub Pages. In repository settings,
set **Pages → Build and deployment → Source** to **GitHub Actions**.

The deployment uses GitHub's Pages artifact workflow. See GitHub's
[custom workflows for Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
documentation for workflow setup and deployment permissions.

## Compiler layout

- `src/nghtml.ts` — compatibility export for application imports.
- `src/nghtml/index.ts` — public `nghtml` tagged-template entry point.
- `src/nghtml/types.ts` — typed AST and expression contracts.
- `src/nghtml/errors.ts` — source-aware `NghtmlSyntaxError`.
- `src/nghtml/parser.ts` — structural directive parsing and brace matching.
- `src/nghtml/expressions.ts` — expression parsing and quote-aware header splitting.
- `src/nghtml/analyzer.ts` — scope validation and template analysis.
- `src/nghtml/bindings.ts` — `[class]`, `[style]`, and `[attr.*]` transforms.
- `src/nghtml/renderer.ts` — Lit template generation and directive rendering.
- `src/nghtml/defer.ts` — deferred-loading lifecycle, triggers, and cleanup.

The recommended change flow is: update the AST contract, parser, analyzer,
renderer, and tests in that order. Keep syntax recognition in the parser;
keep scope and unknown-variable rules in the analyzer; keep DOM directive
normalization in bindings; and keep browser scheduling in defer.
