import { nghtml } from '@kurama-labs/nghtml';
import { DemoElement } from './shared';

class FocusTimerDemo extends DemoElement {
  static properties = {
    seconds: { type: Number },
    duration: { type: Number },
    running: { type: Boolean },
  };
  declare seconds: number;
  declare duration: number;
  declare running: boolean;
  private intervalId: number | undefined;

  constructor() {
    super();
    this.duration = 5 * 60;
    this.seconds = this.duration;
    this.running = false;
  }

  get clock(): string {
    const minutes = Math.floor(this.seconds / 60).toString().padStart(2, '0');
    const seconds = (this.seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  get progressPercent(): number {
    return this.duration ? ((this.duration - this.seconds) / this.duration) * 100 : 0;
  }

  start(): void {
    if (this.running || this.seconds <= 0) return;
    this.running = true;
    this.intervalId = window.setInterval(() => {
      if (this.seconds <= 1) {
        this.seconds = 0;
        this.pause();
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  pause(): void {
    this.running = false;
    if (this.intervalId !== undefined) window.clearInterval(this.intervalId);
    this.intervalId = undefined;
  }

  reset(): void {
    this.pause();
    this.seconds = this.duration;
  }

  setDuration(minutes: number): void {
    this.pause();
    this.duration = minutes * 60;
    this.seconds = this.duration;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.pause();
  }

  render() {
    return nghtml`
      <div class="stack">
        <div class="timer-face"><div><strong>${this.clock}</strong><span>deep work session</span></div></div>
        <div class="progress"><span [style.width]=${this.progressPercent + '%'}></span></div>
        <div class="row between">
          <span class="muted small">Session length</span>
          <div class="row">
            <button class="chip" [class.active]=${this.duration === 5 * 60} @click=${() => this.setDuration(5)}>5 min</button>
            <button class="chip" [class.active]=${this.duration === 15 * 60} @click=${() => this.setDuration(15)}>15 min</button>
            <button class="chip" [class.active]=${this.duration === 25 * 60} @click=${() => this.setDuration(25)}>25 min</button>
          </div>
        </div>
        <div class="row">
          @if (${this.running}) {
            <button class="button primary" @click=${() => this.pause()}>Pause</button>
          } @else {
            <button class="button primary" @click=${() => this.start()}>Start focus</button>
          }
          <button class="button" @click=${() => this.reset()}>Reset</button>
          @if (${this.seconds === 0}) { <span class="success">Session complete. Nice work!</span> }
        </div>
      </div>
    `;
  }
}

if (!customElements.get('focus-timer-demo')) customElements.define('focus-timer-demo', FocusTimerDemo);
