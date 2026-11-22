import { nghtml } from '../../src/nghtml';
import { DemoElement } from '../shared';

interface BoardTask {
  id: number;
  title: string;
}

interface BoardColumn {
  id: string;
  title: string;
  tasks: BoardTask[];
}

class KanbanDemo extends DemoElement {
  static properties = { columns: { type: Array }, draft: { type: String } };
  declare columns: BoardColumn[];
  declare draft: string;

  constructor() {
    super();
    this.columns = [
      { id: 'todo', title: 'To do', tasks: [{ id: 1, title: 'Outline the flow' }, { id: 2, title: 'Pick demo data' }] },
      { id: 'doing', title: 'In progress', tasks: [{ id: 3, title: 'Build the UI' }] },
      { id: 'done', title: 'Done', tasks: [{ id: 4, title: 'Create a component' }] },
    ];
    this.draft = '';
  }

  addTask(): void {
    const title = this.draft.trim();
    if (!title) return;
    this.columns = this.columns.map((column, index) => index === 0
      ? { ...column, tasks: [...column.tasks, { id: Date.now(), title }] }
      : column);
    this.draft = '';
  }

  moveTask(taskId: number, columnId: string): void {
    const source = this.columns.find((column) => column.tasks.some((task) => task.id === taskId));
    const task = source?.tasks.find((item) => item.id === taskId);
    if (!source || !task) return;
    const targetIndex = (this.columns.findIndex((column) => column.id === columnId) + 1) % this.columns.length;
    const targetId = this.columns[targetIndex].id;
    this.columns = this.columns.map((column) => {
      if (column.id === source.id) return { ...column, tasks: column.tasks.filter((item) => item.id !== taskId) };
      if (column.id === targetId) return { ...column, tasks: [...column.tasks, task] };
      return column;
    });
  }

  render() {
    return nghtml`
      <div class="stack">
        <form class="row" @submit=${(event: Event) => { event.preventDefault(); this.addTask(); }}>
          <input class="field" aria-label="New board card" placeholder="Add a card to To do…" .value=${this.draft}
            @input=${(event: Event) => { this.draft = (event.target as HTMLInputElement).value; }}>
          <button class="button primary" type="submit">Add card</button>
        </form>
        <div class="kanban">
          @for (column of ${this.columns}; track column.id) {
            <section class="lane">
              <h3 class="lane-title">{{ column.title }} <span class="muted">· {{ column.tasks.length }}</span></h3>
              @for (task of column.tasks; track task.id) {
                <div class="lane-card">
                  <div>{{ task.title }}</div>
                  <button class="chip" aria-label="Move card to next column"
                    data-task-id="{{ task.id }}" data-column-id="{{ column.id }}"
                    @click=${(event: Event) => {
                      const button = event.currentTarget as HTMLElement;
                      this.moveTask(Number(button.dataset.taskId), button.dataset.columnId ?? '');
                    }}>Move →</button>
                </div>
              } @empty {
                <div class="muted small">No cards yet</div>
              }
            </section>
          }
        </div>
      </div>
    `;
  }
}

if (!customElements.get('kanban-demo')) customElements.define('kanban-demo', KanbanDemo);
