import{D as a,n as o}from"./shared-D9OPbzUs.js";/* empty css             */const s=class s extends a{constructor(){super(),this.expenses=[{id:1,title:"Coffee & croissant",category:"Food",amount:8.5},{id:2,title:"Metro pass",category:"Travel",amount:24},{id:3,title:"Notebook",category:"Other",amount:12}],this.category="All",this.draft=""}get visibleExpenses(){return this.category==="All"?this.expenses:this.expenses.filter(t=>t.category===this.category)}get total(){return this.visibleExpenses.reduce((t,i)=>t+i.amount,0).toFixed(2)}addExpense(){const t=Number(this.draft);!Number.isFinite(t)||t<=0||(this.expenses=[...this.expenses,{id:Date.now(),title:"Quick add",category:this.category==="All"?"Other":this.category,amount:t}],this.draft="")}render(){return o`
      <div class="stack">
        <div class="metric"><strong>$${this.total}</strong><span>shown in this view</span></div>
        <div class="row">
          <select class="select" aria-label="Filter by category" .value=${this.category}
            @change=${t=>{this.category=t.target.value}}>
            <option>All</option><option>Food</option><option>Travel</option><option>Other</option>
          </select>
          <input class="field" aria-label="Expense amount" type="number" min="0.01" step="0.01"
            placeholder="Amount" .value=${this.draft}
            @input=${t=>{this.draft=t.target.value}}>
          <button class="button primary" @click=${()=>this.addExpense()}>Add</button>
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
    `}};s.properties={expenses:{type:Array},category:{type:String},draft:{type:String}};let e=s;customElements.get("expense-demo")||customElements.define("expense-demo",e);
