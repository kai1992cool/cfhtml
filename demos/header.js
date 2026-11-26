const header = document.querySelector('[data-site-header]');

if (header) {
  const demoName = window.location.pathname.replace(/\/+$/, '').split('/').pop();
  const stackblitzUrl = `https://stackblitz.com/github/kai1992cool/nghtml/tree/main/demos/${encodeURIComponent(demoName)}/stackblitz`;

  header.innerHTML = `
    <a class="brand" href="../../" aria-label="NGHTML home">
      <span class="brand-mark">&lt;/&gt;</span>
      <span>nghtml<span class="brand-period">.</span></span>
    </a>
    <nav class="topbar-actions" aria-label="Project links">
      <a class="header-link" href="../../getting-started/">Getting started</a>
      <a class="header-link" href="../">Demos</a>
      <a class="header-button" href="https://www.npmjs.com/package/@kurama-labs/nghtml" target="_blank" rel="noopener noreferrer" aria-label="View NGHTML on npm">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1.5 1.5h21v21h-21v-21Zm3.75 3.75v13.5h6.75v-3.75H9v-6h3v9.75h6.75V5.25H5.25Z"/></svg>
        <span aria-hidden="true">npm</span>
      </a>
      <a class="header-button" href="https://github.com/kai1992cool/nghtml" target="_blank" rel="noopener noreferrer" aria-label="View NGHTML on GitHub">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0C3.58 0 0 3.67 0 8.19c0 3.62 2.29 6.69 5.47 7.77.4.08.55-.18.55-.39 0-.19-.01-.83-.01-1.51-2.01.38-2.53-.5-2.69-.95-.09-.23-.48-.95-.82-1.14-.28-.15-.68-.52-.01-.53.63-.01 1.08.59 1.23.83.72 1.23 1.87.88 2.33.67.07-.53.28-.88.51-1.08-1.78-.21-3.64-.91-3.64-4.04 0-.89.31-1.62.82-2.19-.08-.21-.36-1.04.08-2.16 0 0 .67-.22 2.2.84A7.54 7.54 0 0 1 8 3.78c.68 0 1.36.09 2 .27 1.53-1.06 2.2-.84 2.2-.84.44 1.12.16 1.95.08 2.16.51.57.82 1.29.82 2.19 0 3.14-1.87 3.83-3.65 4.04.29.25.54.74.54 1.5 0 1.08-.01 1.95-.01 2.22 0 .21.15.47.55.39A8.03 8.03 0 0 0 16 8.19C16 3.67 12.42 0 8 0Z"/></svg>
        <span>GitHub</span>
      </a>
      <a class="header-button" href="https://github.com/kai1992cool/nghtml" target="_blank" rel="noopener noreferrer" aria-label="Star NGHTML on GitHub">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="m8 11.3-4.33 2.28.83-4.82L.78 5.57l4.84-.7L8 .66l2.38 4.21 4.84.7-3.72 3.19.83 4.82L8 11.3Z"/></svg>
        <span>Star</span>
      </a>
      <a class="header-button issue-button" href="https://github.com/kai1992cool/nghtml/issues" target="_blank" rel="noopener noreferrer" aria-label="Open NGHTML GitHub issues">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm0 1.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13ZM7.25 3.5h1.5v5h-1.5v-5Zm0 6.5h1.5v1.5h-1.5V10Z"/></svg>
        <span>Issue</span>
      </a>
    </nav>
  `;

  const demoIntro = document.querySelector('.demo-intro');

  if (demoIntro) {
    demoIntro.insertAdjacentHTML(
      'beforeend',
      `<div class="stackblitz-demo-action">
        <a class="header-button stackblitz-button" href="${stackblitzUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open this demo in StackBlitz">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M9.3 0 3 8h4l-.3 8L13 7H9l.3-7Z"/></svg>
          <span>StackBlitz</span>
        </a>
        <p class="stackblitz-note">If the stackblitz link doesn’t load, wait 2 minutes, then refresh the opened tab.</p>
      </div>`,
    );
  }
}
