import { nghtml } from '../../src/nghtml';
import { DemoElement } from '../shared';

interface Habit {
  id: number;
  name: string;
  days: Array<{ id: number; label: string; done: boolean }>;
}

class HabitDemo extends DemoElement {
  static properties = { habits: { type: Array } };
  declare habits: Habit[];
  constructor() {
    super();
    this.habits = [
      { id: 1, name: 'Read 10 pages', days: this.createDays([true, true, false, true, false, false, false]) },
      { id: 2, name: 'Take a walk', days: this.createDays([true, false, true, false, false, false, false]) },
      { id: 3, name: 'Drink water', days: this.createDays([true, true, true, true, true, false, false]) },
    ];
  }

  private createDays(done: boolean[]): Habit['days'] {
    return ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, id) => ({
      id,
      label,
      done: done[id],
    }));
  }

  get checkedCount(): number {
    return this.habits.reduce((sum, habit) => sum + habit.days.filter((day) => day.done).length, 0);
  }

  get completion(): number {
    return Math.round((this.checkedCount / (this.habits.length * 7)) * 100);
  }

  toggle(habitId: number, dayId: number): void {
    this.habits = this.habits.map((habit) => habit.id === habitId
      ? {
          ...habit,
          days: habit.days.map((day) => day.id === dayId ? { ...day, done: !day.done } : day),
        }
      : habit);
  }

  render() {
    return nghtml`
      <div class="stack">
        <div class="row between">
          <div><strong>${this.checkedCount}</strong><span class="muted small"> / ${this.habits.length * 7} check-ins</span></div>
          <span class="tag">${this.completion}% this week</span>
        </div>
        <div class="progress"><span [style.width]=${this.completion + '%'}></span></div>
        <div class="row between muted small"><span>Your habits</span><span>This week →</span></div>
        @for (habit of ${this.habits}; track habit.id) {
          <div class="stack">
            <div class="row between"><strong>{{ habit.name }}</strong><span class="muted small">{{ habit.days.length }} days</span></div>
            <div class="week">
              @for (day of habit.days; track day.id) {
                <button class="day" [class.checked]="{{ day.done }}"
                  data-habit-id="{{ habit.id }}" data-day-id="{{ day.id }}"
                  aria-label="Toggle habit day"
                  @click=${(event: Event) => {
                    const button = event.currentTarget as HTMLElement;
                    this.toggle(Number(button.dataset.habitId), Number(button.dataset.dayId));
                  }}>{{ day.label }}</button>
              }
            </div>
          </div>
        } @empty {
          <div class="empty">Add a habit to start building a streak.</div>
        }
      </div>
    `;
  }
}

if (!customElements.get('habit-demo')) customElements.define('habit-demo', HabitDemo);
