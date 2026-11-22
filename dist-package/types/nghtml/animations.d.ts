import { AsyncDirective } from 'lit/async-directive.js';
import { type Part } from 'lit/directive.js';
import type { Disconnectable } from 'lit-html';
export interface AnimationCallbackEvent {
    target: Element;
    animationComplete(): void;
}
export declare function normalizeAnimationClasses(value: unknown): string[];
export declare function getAnimationCallback(value: unknown): ((event: AnimationCallbackEvent) => void) | undefined;
declare class EnterAnimationDirective extends AsyncDirective {
    private element;
    private classes;
    private callback?;
    private timeout;
    private isStarting;
    _$initialize(part: Part, parent: Disconnectable, attributeIndex: number | undefined): void;
    render(value: unknown, callback?: (event: AnimationCallbackEvent) => void): string;
    private startEnter;
    disconnected(): void;
    reconnected(): void;
}
declare class LeaveAnimationDirective extends AsyncDirective {
    private element;
    private classes;
    private callback?;
    _$initialize(part: Part, parent: Disconnectable, attributeIndex: number | undefined): void;
    render(value: unknown, callback?: (event: AnimationCallbackEvent) => void): string;
    disconnected(): void;
    reconnected(): void;
}
export declare const enterAnimation: (value: unknown, callback?: ((event: AnimationCallbackEvent) => void) | undefined) => import("lit-html/directive.js").DirectiveResult<typeof EnterAnimationDirective>;
export declare const leaveAnimation: (value: unknown, callback?: ((event: AnimationCallbackEvent) => void) | undefined) => import("lit-html/directive.js").DirectiveResult<typeof LeaveAnimationDirective>;
export {};
