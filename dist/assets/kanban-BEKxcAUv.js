import{D as c,n as m}from"./shared-D9OPbzUs.js";/* empty css             */const n=class n extends c{constructor(){super(),this.columns=[{id:"todo",title:"To do",tasks:[{id:1,title:"Outline the flow"},{id:2,title:"Pick demo data"}]},{id:"doing",title:"In progress",tasks:[{id:3,title:"Build the UI"}]},{id:"done",title:"Done",tasks:[{id:4,title:"Create a component"}]}],this.draft=""}addTask(){const s=this.draft.trim();s&&(this.columns=this.columns.map((a,i)=>i===0?{...a,tasks:[...a.tasks,{id:Date.now(),title:s}]}:a),this.draft="")}moveTask(s,a){const i=this.columns.find(t=>t.tasks.some(e=>e.id===s)),o=i==null?void 0:i.tasks.find(t=>t.id===s);if(!i||!o)return;const r=(this.columns.findIndex(t=>t.id===a)+1)%this.columns.length,l=this.columns[r].id;this.columns=this.columns.map(t=>t.id===i.id?{...t,tasks:t.tasks.filter(e=>e.id!==s)}:t.id===l?{...t,tasks:[...t.tasks,o]}:t)}render(){return m`
      <div class="stack">
        <form class="row" @submit=${s=>{s.preventDefault(),this.addTask()}}>
          <input class="field" aria-label="New board card" placeholder="Add a card to To do…" .value=${this.draft}
            @input=${s=>{this.draft=s.target.value}}>
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
                    @click=${s=>{const a=s.currentTarget;this.moveTask(Number(a.dataset.taskId),a.dataset.columnId??"")}}>Move →</button>
                </div>
              } @empty {
                <div class="muted small">No cards yet</div>
              }
            </section>
          }
        </div>
      </div>
    `}};n.properties={columns:{type:Array},draft:{type:String}};let d=n;customElements.get("kanban-demo")||customElements.define("kanban-demo",d);
