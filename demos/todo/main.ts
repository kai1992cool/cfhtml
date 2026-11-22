import { nghtml } from '../../src/nghtml';
import { DemoElement } from '../shared';

interface TodoTask {
  id: number;
  title: string;
  done: boolean;
}

class TodoDemo extends DemoElement {
  static properties = { tasks: { type: Array }, draft: { type: String }, filter: { type: String } };
  declare tasks: TodoTask[];
  declare draft: string;
  declare filter: string;

  constructor() {
    super();
    this.tasks = [
      { id: 1, title: 'Sketch the component API', done: true },
      { id: 2, title: 'Build a useful empty state', done: false },
      { id: 3, title: 'Ship the first working demo', done: false },
    ];
    this.draft = '';
    this.filter = 'all';
  }

  get visibleTasks(): TodoTask[] {
    if (this.filter === 'active') return this.tasks.filter((task) => !task.done);
    if (this.filter === 'done') return this.tasks.filter((task) => task.done);
    return this.tasks;
  }

  get remaining(): number {
    return this.tasks.filter((task) => !task.done).length;
  }

  addTask(): void {
    const title = this.draft.trim();
    if (!title) return;
    this.tasks = [...this.tasks, { id: Date.now(), title, done: false }];
    this.draft = '';
  }

  toggleTask(id: number): void {
    this.tasks = this.tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task);
  }

  removeTask(id: number): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  render() {
    return nghtml`
      @let pendingCount = ${this.remaining};
      <div class="stack">
        <form class="row" @submit=${(event: Event) => { event.preventDefault(); this.addTask(); }}>
          <input class="field" aria-label="New task" placeholder="Add a task…" .value=${this.draft}
            @input=${(event: Event) => { this.draft = (event.target as HTMLInputElement).value; }}>
          <button class="button primary" type="submit">Add task</button>
        </form>
        <div class="row between">
          <span class="muted small">{{ pendingCount }} left to do</span>
          <div class="row">
            <button class="chip" [class.active]=${this.filter === 'all'} @click=${() => { this.filter = 'all'; }}>All</button>
            <button class="chip" [class.active]=${this.filter === 'active'} @click=${() => { this.filter = 'active'; }}>Active</button>
            <button class="chip" [class.active]=${this.filter === 'done'} @click=${() => { this.filter = 'done'; }}>Done</button>
          </div>
        </div>
        <ul class="list">
          @for (task of ${this.visibleTasks}; track task.id) {
            <li class="list-row">
              @if (task.done) {
                <input class="check" type="checkbox" aria-label="Toggle task" checked data-task-id="{{ task.id }}"
                  @change=${(event: Event) => this.toggleTask(Number((event.currentTarget as HTMLElement).dataset.taskId))}>
              } @else {
                <input class="check" type="checkbox" aria-label="Toggle task" data-task-id="{{ task.id }}"
                  @change=${(event: Event) => this.toggleTask(Number((event.currentTarget as HTMLElement).dataset.taskId))}>
              }
              <span class="grow" [class.done]="{{ task.done }}">{{ task.title }}</span>
              <button class="button danger" aria-label="Remove task" data-task-id="{{ task.id }}"
                @click=${(event: Event) => this.removeTask(Number((event.currentTarget as HTMLElement).dataset.taskId))}>Remove</button>
            </li>
          } @empty {
            <li class="empty">Nothing here yet. Add a task to get moving.</li>
          }
        </ul>
      </div>
    `;
  }
}

if (!customElements.get('todo-demo')) customElements.define('todo-demo', TodoDemo);
