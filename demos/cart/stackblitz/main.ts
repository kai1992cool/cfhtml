import { nghtml } from '@kurama-labs/nghtml';
import { DemoElement } from './shared';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

class CartDemo extends DemoElement {
  static properties = { items: { type: Array }, discount: { type: Boolean } };
  declare items: CartItem[];
  declare discount: boolean;

  constructor() {
    super();
    this.items = [
      { id: 1, name: 'Everyday tote', price: 28, quantity: 1 },
      { id: 2, name: 'Studio mug', price: 16, quantity: 2 },
      { id: 3, name: 'Field notes', price: 9, quantity: 1 },
    ];
    this.discount = false;
  }

  get subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  get total(): number {
    return this.subtotal * (this.discount ? 0.9 : 1);
  }

  changeQuantity(id: number, delta: number): void {
    this.items = this.items
      .map((item) => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
      .filter((item) => item.quantity > 0);
  }

  render() {
    return nghtml`
      <div class="stack">
        <ul class="list">
          @for (item of ${this.items}; track item.id) {
            <li class="list-row">
              <div class="grow"><strong>{{ item.name }}</strong><div class="muted small">$${'{{ item.price }}'} each</div></div>
              <div class="row">
                <button class="button icon" aria-label="Decrease quantity" data-item-id="{{ item.id }}"
                  @click=${(event: Event) => this.changeQuantity(Number((event.currentTarget as HTMLElement).dataset.itemId), -1)}>−</button>
                <span>${'{{ item.quantity }}'}</span>
                <button class="button icon" aria-label="Increase quantity" data-item-id="{{ item.id }}"
                  @click=${(event: Event) => this.changeQuantity(Number((event.currentTarget as HTMLElement).dataset.itemId), 1)}>+</button>
              </div>
            </li>
          } @empty {
            <li class="empty">Your cart is empty.</li>
          }
        </ul>
        <button class="chip" [class.active]=${this.discount} @click=${() => { this.discount = !this.discount; }}>
          ${this.discount ? '✓ ' : ''}Apply studio10 · 10% off
        </button>
        <hr class="divider">
        <div class="row between"><span class="muted">Subtotal</span><strong>$${this.subtotal.toFixed(2)}</strong></div>
        @if (${this.discount}) {
          <div class="row between"><span class="muted">Discount</span><span>−$${(this.subtotal * 0.1).toFixed(2)}</span></div>
        }
        <div class="row between"><strong>Total</strong><strong>$${this.total.toFixed(2)}</strong></div>
        <button class="button primary" @click=${() => { this.items = []; }}>Checkout</button>
      </div>
    `;
  }
}

if (!customElements.get('cart-demo')) customElements.define('cart-demo', CartDemo);
