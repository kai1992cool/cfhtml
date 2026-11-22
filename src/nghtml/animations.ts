import { AsyncDirective } from 'lit/async-directive.js';
import { directive, type Part } from 'lit/directive.js';
import type { Disconnectable } from 'lit-html';

export interface AnimationCallbackEvent {
  target: Element;
  animationComplete(): void;
}

type AnimationConfig = {
  classes: string[];
  callback?: (event: AnimationCallbackEvent) => void;
};

type LeaveConfig = AnimationConfig & {
  parent: Node;
};

const leaveConfigs = new WeakMap<Element, LeaveConfig>();
const rootObservers = new WeakMap<Node, MutationObserver>();
const leaveRemoval = new WeakSet<Element>();
const enteredElements = new WeakSet<Element>();

export function normalizeAnimationClasses(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      typeof item === 'string' ? item.trim().split(/\s+/).filter(Boolean) : [],
    );
  }
  if (typeof value === 'string') {
    return value.trim().split(/\s+/).filter(Boolean);
  }
  return [];
}

export function getAnimationCallback(value: unknown): ((event: AnimationCallbackEvent) => void) | undefined {
  return typeof value === 'function'
    ? value as (event: AnimationCallbackEvent) => void
    : undefined;
}

class EnterAnimationDirective extends AsyncDirective {
  private element: Element | null = null;
  private classes: string[] = [];
  private callback?: (event: AnimationCallbackEvent) => void;
  private timeout: number | undefined;
  private isStarting = false;

  override _$initialize(
    part: Part,
    parent: Disconnectable,
    attributeIndex: number | undefined,
  ): void {
    super._$initialize(part, parent, attributeIndex);
    if ('element' in part) this.element = part.element;
  }

  render(value: unknown, callback?: (event: AnimationCallbackEvent) => void): string {
    const nextClasses = normalizeAnimationClasses(value);
    if (this.element) {
      const previousClasses = this.classes;
      this.classes = nextClasses;
      if (!enteredElements.has(this.element)) {
        queueMicrotask(() => this.startEnter(callback));
      } else {
        this.element.classList.remove(...previousClasses);
      }
    }
    this.callback = callback;
    return '';
  }

  private startEnter(callback?: (event: AnimationCallbackEvent) => void): void {
    if (!this.element || this.isStarting || enteredElements.has(this.element)) return;
    enteredElements.add(this.element);
    this.isStarting = true;
    if (this.timeout !== undefined) window.clearTimeout(this.timeout);

    const element = this.element;
    element.classList.add(...this.classes);

    let completed = false;
    const complete = () => {
      if (completed) return;
      completed = true;
      element.classList.remove(...this.classes);
      this.isStarting = false;
      if (this.timeout !== undefined) window.clearTimeout(this.timeout);
    };

    const event: AnimationCallbackEvent = {
      target: element,
      animationComplete: complete,
    };
    callback?.(event);

    if (!callback) {
      void waitForAnimation(element, complete);
    }

    this.timeout = window.setTimeout(complete, 4000);
  }

  disconnected(): void {
    if (this.timeout !== undefined) window.clearTimeout(this.timeout);
  }

  reconnected(): void {
    if (this.element && !enteredElements.has(this.element)) {
      queueMicrotask(() => this.startEnter(this.callback));
    }
  }
}

class LeaveAnimationDirective extends AsyncDirective {
  private element: Element | null = null;
  private classes: string[] = [];
  private callback?: (event: AnimationCallbackEvent) => void;

  override _$initialize(
    part: Part,
    parent: Disconnectable,
    attributeIndex: number | undefined,
  ): void {
    super._$initialize(part, parent, attributeIndex);
    if ('element' in part) this.element = part.element;
  }

  render(value: unknown, callback?: (event: AnimationCallbackEvent) => void): string {
    if (this.element) {
      this.classes = normalizeAnimationClasses(value);
      this.callback = callback;
      leaveConfigs.set(this.element, {
        classes: this.classes,
        callback,
        parent: this.element.parentNode ?? this.element,
      });
      observeLeaveRoot(this.element);
    }
    return '';
  }

  disconnected(): void {
    if (this.element) leaveConfigs.delete(this.element);
  }

  reconnected(): void {
    if (this.element) {
      leaveConfigs.set(this.element, {
        classes: this.classes,
        callback: this.callback,
        parent: this.element.parentNode ?? this.element,
      });
      observeLeaveRoot(this.element);
    }
  }
}

export const enterAnimation = directive(EnterAnimationDirective);
export const leaveAnimation = directive(LeaveAnimationDirective);

async function waitForAnimation(element: Element, complete: () => void): Promise<void> {
  if (typeof element.getAnimations !== 'function') {
    const onFinish = () => complete();
    element.addEventListener('animationend', onFinish, { once: true });
    element.addEventListener('transitionend', onFinish, { once: true });
    window.setTimeout(onFinish, 4000);
    return;
  }

  const animations = element.getAnimations();
  if (animations.length === 0) {
    queueMicrotask(complete);
    return;
  }
  await Promise.allSettled(animations.map((animation) => animation.finished));
  complete();
}

function observeLeaveRoot(element: Element): void {
  const root = element.getRootNode();
  if (!(root instanceof Node) || rootObservers.has(root)) return;

  const observer = new MutationObserver((records) => {
    for (const record of records) {
      for (const removed of record.removedNodes) {
        processLeaveRemoval(removed, record);
      }
    }
  });
  observer.observe(root, { childList: true, subtree: true });
  rootObservers.set(root, observer);
}

function processLeaveRemoval(
  removed: Node,
  record: MutationRecord,
): void {
  const elements: Element[] = [];
  if (removed instanceof Element) {
    if (leaveConfigs.has(removed)) elements.push(removed);
    removed.querySelectorAll('*').forEach((child) => {
      if (leaveConfigs.has(child)) elements.push(child);
    });
  }
  if (elements.length === 0) return;

  const leaving = elements.find((element) => leaveConfigs.has(element));
  if (!leaving || leaveRemoval.has(leaving)) return;
  leaveRemoval.add(leaving);

  if (!leaving.isConnected && record.nextSibling?.parentNode) {
    record.nextSibling.parentNode.insertBefore(leaving, record.nextSibling);
  } else if (!leaving.isConnected) {
    record.target.appendChild(leaving);
  }

  const leaveConfigsToRun = elements
    .map((element) => leaveConfigs.get(element))
    .filter((config): config is LeaveConfig => Boolean(config));

  for (const element of elements) {
    const config = leaveConfigs.get(element);
    if (config) element.classList.add(...config.classes);
  }

  void runLeaveAnimations(elements, leaveConfigsToRun).finally(() => {
    if (record.nextSibling?.parentNode) {
      for (const element of elements) element.remove();
    } else {
      for (const element of elements) element.remove();
    }
  });
}

async function runLeaveAnimations(
  elements: Element[],
  configs: LeaveConfig[],
): Promise<void> {
  const callbackConfigs = configs.filter((config) => config.callback);
  if (callbackConfigs.length > 0) {
    await Promise.all(callbackConfigs.map((config) =>
      new Promise<void>((resolve) => {
        const element = elements.find((item) =>
          leaveConfigs.get(item)?.callback === config.callback,
        );
        if (!element) {
          resolve();
          return;
        }
        let completed = false;
        const complete = () => {
          if (completed) return;
          completed = true;
          resolve();
        };
        config.callback?.({
          target: element,
          animationComplete: complete,
        });
        window.setTimeout(complete, 4000);
      }),
    ));
  } else {
    await Promise.all(elements.map((element) =>
      waitForLeaveAnimation(element),
    ));
  }
}

async function waitForLeaveAnimation(element: Element): Promise<void> {
  if (typeof element.getAnimations !== 'function') {
    await new Promise<void>((resolve) => {
      const finish = () => resolve();
      element.addEventListener('animationend', finish, { once: true });
      element.addEventListener('transitionend', finish, { once: true });
      window.setTimeout(finish, 4000);
    });
    return;
  }

  const animations = element.getAnimations();
  if (animations.length === 0) {
    await new Promise((resolve) => window.setTimeout(resolve, 0));
    return;
  }
  await Promise.allSettled(animations.map((animation) => animation.finished));
}
