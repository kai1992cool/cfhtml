import { AsyncDirective } from 'lit/async-directive.js';
import { directive } from 'lit/directive.js';
import type { Disconnectable, Part } from 'lit-html';

export type DeferTrigger = 'idle' | 'immediate' | 'viewport';

class DeferAsyncDirective extends AsyncDirective {
  private timeout: number | undefined;
  private idleHandle: number | undefined;
  private observer: IntersectionObserver | undefined;
  private active = false;
  private loaded = false;
  private currentMain: unknown;
  private currentError: unknown;
  private observationTarget: Element | null = null;
  private startNode: Node | null = null;

  override _$initialize(
    part: Part,
    parent: Disconnectable,
    attributeIndex: number | undefined,
  ): void {
    super._$initialize(part, parent, attributeIndex);
    if (part.type === 2) {
      this.startNode = part.startNode;
      const parent = part.startNode?.parentNode;
      if (parent instanceof Element) {
        this.observationTarget = parent;
      } else if ('firstElementChild' in (parent ?? {}) &&
        (parent as DocumentFragment).firstElementChild instanceof Element) {
        this.observationTarget =
          (parent as DocumentFragment).firstElementChild as Element;
      }
    }
  }

  render(
    main: unknown,
    placeholder: unknown,
    loading: unknown,
    error: unknown,
    trigger: DeferTrigger,
  ): unknown {
    this.currentMain = main;
    this.currentError = error;

    if (this.loaded) return main;
    this.active = true;

    if (trigger === 'immediate') {
      queueMicrotask(() => {
        if (this.active) this.activate();
      });
      return loading ?? placeholder;
    }

    if (typeof window === 'undefined') {
      queueMicrotask(() => {
        if (this.active) this.activate();
      });
      return loading ?? placeholder;
    }

    if (trigger === 'idle') {
      const idleWindow = window as Window & {
        requestIdleCallback?: (callback: IdleRequestCallback) => number;
        cancelIdleCallback?: (handle: number) => void;
      };
      if (idleWindow.requestIdleCallback) {
        this.idleHandle = idleWindow.requestIdleCallback(() => {
          if (this.active) this.activate();
        });
      } else {
        this.timeout = window.setTimeout(() => {
          if (this.active) this.activate();
        }, 0);
      }
    } else if (trigger === 'viewport') {
      const IntersectionObserverCtor =
        (window as Window & { IntersectionObserver?: typeof IntersectionObserver })
          .IntersectionObserver ??
        (globalThis as typeof globalThis & {
          IntersectionObserver?: typeof IntersectionObserver;
        }).IntersectionObserver;

      if (IntersectionObserverCtor) {
        this.observer = new IntersectionObserverCtor((entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.activate();
        }
        });
        queueMicrotask(() => {
          this.discoverAndObserveViewport();
          if (!this.observationTarget) {
            this.timeout = window.setTimeout(() => {
              this.discoverAndObserveViewport();
            }, 0);
          }
        });
      } else {
        this.timeout = window.setTimeout(() => {
          if (this.active) this.activate();
        }, 0);
      }
    }

    return loading ?? placeholder;
  }

  private discoverAndObserveViewport(): void {
    const node = this.startNode?.nextSibling;
    if (node instanceof Element) {
      this.observationTarget = node;
    }
    if (!this.observationTarget && this.startNode?.parentNode &&
      'firstElementChild' in this.startNode.parentNode &&
      (this.startNode.parentNode as DocumentFragment).firstElementChild instanceof Element) {
      this.observationTarget =
        (this.startNode.parentNode as DocumentFragment).firstElementChild as Element;
    }
    if (this.observationTarget) {
      this.observer?.observe(this.observationTarget);
    }
  }

  private activate(): void {
    if (!this.active || this.loaded) return;
    this.loaded = true;
    this.cleanupScheduling();
    this.setValue(this.currentMain);
  }

  disconnected(): void {
    this.active = false;
    this.cleanupScheduling();
  }

  reconnected(): void {
    this.active = true;
    if (this.loaded) this.setValue(this.currentMain);
  }

  private cleanupScheduling(): void {
    if (this.timeout !== undefined) {
      window.clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    if (this.idleHandle !== undefined) {
      const idleWindow = window as Window & {
        cancelIdleCallback?: (handle: number) => void;
      };
      idleWindow.cancelIdleCallback?.(this.idleHandle);
      this.idleHandle = undefined;
    }
    this.observer?.disconnect();
    this.observer = undefined;
  }

  fail(): void {
    this.loaded = false;
    this.cleanupScheduling();
    this.setValue(this.currentError);
  }
}

export const deferDirective = directive(DeferAsyncDirective);
