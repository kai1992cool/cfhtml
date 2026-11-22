import { AsyncDirective } from 'lit/async-directive.js';
import type { Disconnectable, Part } from 'lit-html';
export type DeferTrigger = 'idle' | 'immediate' | 'viewport';
declare class DeferAsyncDirective extends AsyncDirective {
    private timeout;
    private idleHandle;
    private observer;
    private active;
    private loaded;
    private currentMain;
    private currentError;
    private observationTarget;
    private startNode;
    _$initialize(part: Part, parent: Disconnectable, attributeIndex: number | undefined): void;
    render(main: unknown, placeholder: unknown, loading: unknown, error: unknown, trigger: DeferTrigger): unknown;
    private discoverAndObserveViewport;
    private activate;
    disconnected(): void;
    reconnected(): void;
    private cleanupScheduling;
    fail(): void;
}
export declare const deferDirective: (main: unknown, placeholder: unknown, loading: unknown, error: unknown, trigger: DeferTrigger) => import("lit-html/directive.js").DirectiveResult<typeof DeferAsyncDirective>;
export {};
