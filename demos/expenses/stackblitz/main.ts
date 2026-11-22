import { nghtml } from '@kurama-labs/nghtml';
import { DemoElement } from './shared';

interface Expense {
  id: number;
  title: string;
  category: string;
  amount: number;
}

class ExpenseDemo extends DemoElement {
  static properties = { expenses: { type: Array }, category: { type: String }, draft: { type: String } };
  declare expenses: Expense[];
  declare category: string;
  declare draft: string;

  constructor() {
    super();
    this.expenses = [
      { id: 1, title: 'Coffee & croissant', category: 'Food', amount: 8.5 },
      { id: 2, title: 'Metro pass', category: 'Travel', amount: 24 },
      { id: 3, title: 'Notebook', category: 'Other', amount: 12 },
    ];
    this.category = 'All';
    this.draft = '';
  }

  get visibleExpenses(): Expense[] {
    return this.category === 'All'
      ? this.expenses
      : this.expenses.filter((item) => item.category === this.category);
  }

  get total(): string {
    return this.visibleExpenses.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
  }

  addExpense(): void {
    const amount = Number(this.draft);
    if (!Number.isFinite(amount) || amount <= 0) return;
    this.expenses = [...this.expenses, {
      id: Date.now(),
      title: 'Quick add',
      category: this.category === 'All' ? 'Other' : this.category,
      amount,
    }];
    this.draft = '';
  }

  render() {
    return nghtml`
      <div class="stack">
        <div class="metric"><strong>$${this.total}</strong><span>shown in this view</span></div>
        <div class="row">
          <select class="select" aria-label="Filter by category" .value=${this.category}
            @change=${(event: Event) => { this.category = (event.target as HTMLSelectElement).value; }}>
            <option>All</option><option>Food</option><option>Travel</option><option>Other</option>
          </select>
          <input class="field" aria-label="Expense amount" type="number" min="0.01" step="0.01"
            placeholder="Amount" .value=${this.draft}
            @input=${(event: Event) => { this.draft = (event.target as HTMLInputElement).value; }}>
          <button class="button primary" @click=${() => this.addExpense()}>Add</button>
        </div>
        <ul class="list">
          @for (item of ${this.visibleExpenses}; track item.id) {
            <li class="list-row">
              <span class="grow">{{ item.title }} <span class="tag">{{ item.category }}</span></span>
              <strong>$ {{ item.amount }}</strong>
            </li>
          } @empty {
            <li class="empty">No expenses in this category.</li>
          }
        </ul>
      </div>
    `;
  }
}

if (!customElements.get('expense-demo')) customElements.define('expense-demo', ExpenseDemo);
