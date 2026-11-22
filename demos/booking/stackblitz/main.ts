import { nghtml } from '@kurama-labs/nghtml';
import { DemoElement } from './shared';

class BookingDemo extends DemoElement {
  static properties = {
    service: { type: String },
    date: { type: String },
    time: { type: String },
    confirmed: { type: Boolean },
  };
  declare service: string;
  declare date: string;
  declare time: string;
  declare confirmed: boolean;

  constructor() {
    super();
    this.service = '';
    this.date = '';
    this.time = '';
    this.confirmed = false;
  }

  get canConfirm(): boolean {
    return Boolean(this.service && this.date && this.time);
  }

  get timeSlots(): Array<{ time: string; selected: boolean }> {
    return ['09:30', '11:00', '13:30', '15:00'].map((time) => ({
      time,
      selected: this.time === time,
    }));
  }

  render() {
    return nghtml`
      @if (${this.confirmed}) {
        <div class="stack">
          <div class="success">Your appointment is booked. We’ll see you there!</div>
          <div class="metric"><strong>${this.service}</strong><span>${this.date} · ${this.time}</span></div>
          <button class="button" @click=${() => { this.confirmed = false; }}>Book another</button>
        </div>
      } @else {
        <form class="stack" @submit=${(event: Event) => { event.preventDefault(); if (this.canConfirm) this.confirmed = true; }}>
          <label class="stack small">Choose a service
            <select class="select" .value=${this.service}
              @change=${(event: Event) => { this.service = (event.target as HTMLSelectElement).value; }}>
              <option value="">Select a service…</option><option>Studio consultation</option><option>Design review</option><option>Quick support</option>
            </select>
          </label>
          <label class="stack small">Choose a date
            <input class="field" type="date" .value=${this.date}
              @input=${(event: Event) => { this.date = (event.target as HTMLInputElement).value; }}>
          </label>
          <div class="stack small">Choose a time
            <div class="grid-two">
              @for (slot of ${this.timeSlots}; track slot.time) {
                <button class="chip" type="button" [class.active]="{{ slot.selected }}"
                  data-time="{{ slot.time }}"
                  @click=${(event: Event) => { this.time = (event.currentTarget as HTMLElement).dataset.time ?? ''; }}>{{ slot.time }}</button>
              }
            </div>
          </div>
          <button class="button primary" type="submit" ?disabled=${!this.canConfirm}>Confirm appointment</button>
        </form>
      }
    `;
  }
}

if (!customElements.get('booking-demo')) customElements.define('booking-demo', BookingDemo);
