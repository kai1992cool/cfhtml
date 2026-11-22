import { nghtml } from '../../src/nghtml';
import { DemoElement } from '../shared';

interface Guest {
  id: number;
  name: string;
  attending: boolean;
}

class GuestListDemo extends DemoElement {
  static properties = { guests: { type: Array }, draft: { type: String } };
  declare guests: Guest[];
  declare draft: string;

  constructor() {
    super();
    this.guests = [
      { id: 1, name: 'Alex Morgan', attending: true },
      { id: 2, name: 'Sam Rivera', attending: false },
      { id: 3, name: 'Jamie Chen', attending: true },
    ];
    this.draft = '';
  }

  get attendingCount(): number {
    return this.guests.filter((guest) => guest.attending).length;
  }

  addGuest(): void {
    const name = this.draft.trim();
    if (!name) return;
    this.guests = [...this.guests, { id: Date.now(), name, attending: false }];
    this.draft = '';
  }

  toggle(id: number): void {
    this.guests = this.guests.map((guest) =>
      guest.id === id ? { ...guest, attending: !guest.attending } : guest);
  }

  removeGuest(id: number): void {
    this.guests = this.guests.filter((guest) => guest.id !== id);
  }

  render() {
    return nghtml`
      <div class="stack">
        <div class="grid-two">
          <div class="metric"><strong>${this.guests.length}</strong><span>invited</span></div>
          <div class="metric"><strong>${this.attendingCount}</strong><span>confirmed</span></div>
        </div>
        <form class="row" @submit=${(event: Event) => { event.preventDefault(); this.addGuest(); }}>
          <input class="field" aria-label="Guest name" placeholder="Guest name" .value=${this.draft}
            @input=${(event: Event) => { this.draft = (event.target as HTMLInputElement).value; }}>
          <button class="button primary" type="submit">Invite</button>
        </form>
        <ul class="list">
          @for (guest of ${this.guests}; track guest.id) {
            <li class="list-row">
              <span class="grow">{{ guest.name }}</span>
              @if (guest.attending) {
                <span class="tag">Going</span>
              } @else {
                <span class="muted small">No reply</span>
              }
              <button class="button" aria-label="Toggle RSVP" data-guest-id="{{ guest.id }}"
                @click=${(event: Event) => this.toggle(Number((event.currentTarget as HTMLElement).dataset.guestId))}>
                @if (guest.attending) { Undo } @else { RSVP }
              </button>
              <button class="button danger" aria-label="Remove guest" data-guest-id="{{ guest.id }}"
                @click=${(event: Event) => this.removeGuest(Number((event.currentTarget as HTMLElement).dataset.guestId))}>×</button>
            </li>
          } @empty {
            <li class="empty">No guests yet. Send your first invite.</li>
          }
        </ul>
      </div>
    `;
  }
}

if (!customElements.get('guest-list-demo')) customElements.define('guest-list-demo', GuestListDemo);
