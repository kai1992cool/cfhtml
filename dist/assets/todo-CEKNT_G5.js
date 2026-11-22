import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{D as i,n as l}from"./shared-RCEx0mSF.js";const a=class a extends i{constructor(){super(),this.tasks=[{id:1,title:"Sketch the component API",done:!0},{id:2,title:"Build a useful empty state",done:!1},{id:3,title:"Ship the first working demo",done:!1}],this.draft="",this.filter="all"}get visibleTasks(){return this.filter==="active"?this.tasks.filter(t=>!t.done):this.filter==="done"?this.tasks.filter(t=>t.done):this.tasks}get remaining(){return this.tasks.filter(t=>!t.done).length}addTask(){const t=this.draft.trim();t&&(this.tasks=[...this.tasks,{id:Date.now(),title:t,done:!1}],this.draft="")}toggleTask(t){this.tasks=this.tasks.map(s=>s.id===t?{...s,done:!s.done}:s)}removeTask(t){this.tasks=this.tasks.filter(s=>s.id!==t)}render(){return l`
      @let pendingCount = ${this.remaining};
      <div class="stack">
        <form class="row" @submit=${t=>{t.preventDefault(),this.addTask()}}>
          <input class="field" aria-label="New task" placeholder="Add a task…" .value=${this.draft}
            @input=${t=>{this.draft=t.target.value}}>
          <button class="button primary" type="submit">Add task</button>
        </form>
        <div class="row between">
          <span class="muted small">{{ pendingCount }} left to do</span>
          <div class="row">
            <button class="chip" [class.active]=${this.filter==="all"} @click=${()=>{this.filter="all"}}>All</button>
            <button class="chip" [class.active]=${this.filter==="active"} @click=${()=>{this.filter="active"}}>Active</button>
            <button class="chip" [class.active]=${this.filter==="done"} @click=${()=>{this.filter="done"}}>Done</button>
          </div>
        </div>
        <ul class="list">
          @for (task of ${this.visibleTasks}; track task.id) {
            <li class="list-row">
              @if (task.done) {
                <input class="check" type="checkbox" aria-label="Toggle task" checked data-task-id="{{ task.id }}"
                  @change=${t=>this.toggleTask(Number(t.currentTarget.dataset.taskId))}>
              } @else {
                <input class="check" type="checkbox" aria-label="Toggle task" data-task-id="{{ task.id }}"
                  @change=${t=>this.toggleTask(Number(t.currentTarget.dataset.taskId))}>
              }
              <span class="grow" [class.done]="{{ task.done }}">{{ task.title }}</span>
              <button class="button danger" aria-label="Remove task" data-task-id="{{ task.id }}"
                @click=${t=>this.removeTask(Number(t.currentTarget.dataset.taskId))}>Remove</button>
            </li>
          } @empty {
            <li class="empty">Nothing here yet. Add a task to get moving.</li>
          }
        </ul>
      </div>
    `}};a.properties={tasks:{type:Array},draft:{type:String},filter:{type:String}};let e=a;customElements.get("todo-demo")||customElements.define("todo-demo",e);
