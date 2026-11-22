import { afterEach, describe, expect, it, vi } from 'vitest';
import './hello-world';
import { NghtmlSyntaxError, nghtml } from './nghtml';
import type { HelloWorld } from './hello-world';
import { render } from 'lit';

afterEach(() => {
  document.body.replaceChildren();
  vi.unstubAllGlobals();
});

describe('hello-world', () => {
  it('renders its default greeting', async () => {
    const element = document.createElement('hello-world') as HelloWorld;
    document.body.append(element);
    await element.updateComplete;

    expect(element.shadowRoot?.textContent).toContain('Hello, world!');
  });

  it('updates when its name property changes', async () => {
    const element = document.createElement('hello-world') as HelloWorld;
    element.name = 'Lit';
    document.body.append(element);
    await element.updateComplete;

    expect(element.shadowRoot?.textContent).toContain('Hello, Lit!');
  });

  it('renders conditional, loop, and let directives', async () => {
    const element = document.createElement('hello-world') as HelloWorld;
    document.body.append(element);
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('p')?.textContent).toBe('Hello, world!');
    expect(
      [...(element.shadowRoot?.querySelectorAll('li') ?? [])].map((item) => item.textContent),
    ).toEqual(['Lit', 'web components']);

    element.showGreeting = false;
    await element.updateComplete;
    expect(element.shadowRoot?.querySelector('p')?.textContent)
      .toContain('The greeting is hidden.');
  });

  it('supports Angular @if aliases and else branches', () => {
    const template = nghtml`
      @if (${true}; as result) {
        <p>{{ result }}</p>
      } @else if (${false}) {
        <p>else-if</p>
      } @else {
        <p>else</p>
      }
    `;

    expect(template).toBeDefined();
  });

  it('supports Angular @for tracking, aliases, and @empty', () => {
    const withItems = nghtml`
      @for (item of ${[{ id: 1, name: 'One' }]}; track item.id; let first = $first, idx = $index) {
        <p>{{ idx }} {{ item.name }} {{ first }}</p>
      } @empty {
        <p>empty</p>
      }
    `;
    expect(withItems).toBeDefined();

    expect(nghtml`
      @for (item of ${[]}; track $index) {
        <p>{{ item }}</p>
      } @empty {
        <p>empty</p>
      }
    `).toBeDefined();
  });

  it('supports Angular class and style bindings', async () => {
    const element = document.createElement('hello-world') as HelloWorld;
    document.body.append(element);
    await element.updateComplete;

    const paragraph = element.shadowRoot?.querySelector('p');
    expect(paragraph?.classList.contains('featured')).toBe(true);
    expect(paragraph?.style.width).toBe('12px');
    expect(paragraph?.style.borderRadius).toBe('4px');
  });

  it('supports Angular attr and data attribute bindings', () => {
    const host = document.createElement('div');
    render(nghtml`
      <button [attr.aria-label]=${'Save'} [attr.data-id]=${42} data-kind="primary">Save</button>
    `, host);

    const button = host.querySelector('button');
    expect(button?.getAttribute('aria-label')).toBe('Save');
    expect(button?.getAttribute('data-id')).toBe('42');
    expect(button?.getAttribute('data-kind')).toBe('primary');
  });

  it('resolves mixed interpolation and quoted commas in binding and switch syntax', () => {
    const host = document.createElement('div');
    render(nghtml`
      <p [attr.title]="Hello ${'Lit'}">Text</p>
      @switch (${'a,b'}) {
        @case ("a,b") { <span>matched</span> }
        @default { <span>not matched</span> }
      }
    `, host);

    expect(host.querySelector('p')?.getAttribute('title')).toBe('Hello Lit');
    expect(host.querySelector('span')?.textContent).toBe('matched');
  });

  it('supports Angular @switch blocks', () => {
    const host = document.createElement('div');
    render(nghtml`
      @switch (${2}) {
        @case (1) { <p>one</p> }
        @case (2) { <p>two</p> }
        @default { <p>other</p> }
      }
    `, host);

    expect(host.textContent?.trim()).toBe('two');
  });

  it('supports Angular animate.enter CSS classes', async () => {
    const host = document.createElement('div');
    render(nghtml`
      <p animate.enter="fade-in slide-up">Animated</p>
    `, host);
    await Promise.resolve();

    expect(host.querySelector('p')?.classList.contains('fade-in')).toBe(true);
  });

  it('supports animate.enter callback events', async () => {
    const callback = vi.fn((event: { target: Element; animationComplete(): void }) => {
      event.animationComplete();
    });
    const host = document.createElement('div');
    render(nghtml`
      <p (animate.enter)=${callback}>Animated</p>
    `, host);
    await Promise.resolve();

    expect(callback).toHaveBeenCalled();
    expect(callback.mock.calls[0][0].target).toBe(host.querySelector('p'));
  });

  it('only reruns enter animation when an @if block becomes visible', async () => {
    const callback = vi.fn((event: { target: Element; animationComplete(): void }) => {
      event.animationComplete();
    });
    const host = document.createElement('div');
    let visible = true;
    let count = 0;
    const renderView = () => render(nghtml`
      @if (${visible}) {
        <p (animate.enter)=${callback}>Animated</p>
      }
      <button @click=${() => { count++; renderView(); }}>Clicked ${count}</button>
    `, host);

    renderView();
    await Promise.resolve();
    expect(callback).toHaveBeenCalledTimes(1);
    const paragraph = host.querySelector('p');

    host.querySelector('button')?.click();
    await Promise.resolve();
    expect(callback).toHaveBeenCalledTimes(1);
    expect(host.querySelector('p')).toBe(paragraph);

    visible = false;
    renderView();
    expect(host.querySelector('p')).toBeNull();

    visible = true;
    renderView();
    await Promise.resolve();
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('supports @defer with immediate trigger and placeholder', async () => {
    const host = document.createElement('div');
    render(nghtml`
      @defer (on immediate) {
        <p class="loaded">Loaded</p>
      } @placeholder {
        <p class="placeholder">Loading soon</p>
      }
    `, host);
    await Promise.resolve();
    await new Promise((resolve) => window.setTimeout(resolve, 5));

    expect(host.querySelector('.loaded')?.textContent).toBe('Loaded');
  });

  it('preserves Lit click event bindings', async () => {
    const element = document.createElement('hello-world') as HelloWorld;
    document.body.append(element);
    await element.updateComplete;

    element.shadowRoot?.querySelector('button')?.click();
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('button')?.textContent)
      .toBe('Clicked 1 times');
  });

  it('throws template analysis errors directly to the caller', () => {
    expect(() => nghtml`@if (${true}) { <p>{{ missing }}</p> }`)
      .toThrow(NghtmlSyntaxError);
    expect(() => nghtml`@if (${true}) <p>missing block</p>`)
      .toThrow(NghtmlSyntaxError);
    expect(() => nghtml`@for (item of ${[]}) { <p>{{ item }}</p> }`)
      .toThrow(NghtmlSyntaxError);
  });
});
