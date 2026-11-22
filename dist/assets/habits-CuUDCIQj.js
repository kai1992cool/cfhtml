import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{D as r,n}from"./shared-RCEx0mSF.js";const d=class d extends r{constructor(){super(),this.habits=[{id:1,name:"Read 10 pages",days:this.createDays([!0,!0,!1,!0,!1,!1,!1])},{id:2,name:"Take a walk",days:this.createDays([!0,!1,!0,!1,!1,!1,!1])},{id:3,name:"Drink water",days:this.createDays([!0,!0,!0,!0,!0,!1,!1])}]}createDays(a){return["M","T","W","T","F","S","S"].map((s,t)=>({id:t,label:s,done:a[t]}))}get checkedCount(){return this.habits.reduce((a,s)=>a+s.days.filter(t=>t.done).length,0)}get completion(){return Math.round(this.checkedCount/(this.habits.length*7)*100)}toggle(a,s){this.habits=this.habits.map(t=>t.id===a?{...t,days:t.days.map(e=>e.id===s?{...e,done:!e.done}:e)}:t)}render(){return n`
      <div class="stack">
        <div class="row between">
          <div><strong>${this.checkedCount}</strong><span class="muted small"> / ${this.habits.length*7} check-ins</span></div>
          <span class="tag">${this.completion}% this week</span>
        </div>
        <div class="progress"><span [style.width]=${this.completion+"%"}></span></div>
        <div class="row between muted small"><span>Your habits</span><span>This week →</span></div>
        @for (habit of ${this.habits}; track habit.id) {
          <div class="stack">
            <div class="row between"><strong>{{ habit.name }}</strong><span class="muted small">{{ habit.days.length }} days</span></div>
            <div class="week">
              @for (day of habit.days; track day.id) {
                <button class="day" [class.checked]="{{ day.done }}"
                  data-habit-id="{{ habit.id }}" data-day-id="{{ day.id }}"
                  aria-label="Toggle habit day"
                  @click=${a=>{const s=a.currentTarget;this.toggle(Number(s.dataset.habitId),Number(s.dataset.dayId))}}>{{ day.label }}</button>
              }
            </div>
          </div>
        } @empty {
          <div class="empty">Add a habit to start building a streak.</div>
        }
      </div>
    `}};d.properties={habits:{type:Array}};let i=d;customElements.get("habit-demo")||customElements.define("habit-demo",i);
