import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{D as n,n as o}from"./shared-RCEx0mSF.js";const a=class a extends n{constructor(){super(),this.items=[{id:1,name:"Everyday tote",price:28,quantity:1},{id:2,name:"Studio mug",price:16,quantity:2},{id:3,name:"Field notes",price:9,quantity:1}],this.discount=!1}get subtotal(){return this.items.reduce((t,s)=>t+s.price*s.quantity,0)}get total(){return this.subtotal*(this.discount?.9:1)}changeQuantity(t,s){this.items=this.items.map(i=>i.id===t?{...i,quantity:Math.max(0,i.quantity+s)}:i).filter(i=>i.quantity>0)}render(){return o`
      <div class="stack">
        <ul class="list">
          @for (item of ${this.items}; track item.id) {
            <li class="list-row">
              <div class="grow"><strong>{{ item.name }}</strong><div class="muted small">$${"{{ item.price }}"} each</div></div>
              <div class="row">
                <button class="button icon" aria-label="Decrease quantity" data-item-id="{{ item.id }}"
                  @click=${t=>this.changeQuantity(Number(t.currentTarget.dataset.itemId),-1)}>−</button>
                <span>${"{{ item.quantity }}"}</span>
                <button class="button icon" aria-label="Increase quantity" data-item-id="{{ item.id }}"
                  @click=${t=>this.changeQuantity(Number(t.currentTarget.dataset.itemId),1)}>+</button>
              </div>
            </li>
          } @empty {
            <li class="empty">Your cart is empty.</li>
          }
        </ul>
        <button class="chip" [class.active]=${this.discount} @click=${()=>{this.discount=!this.discount}}>
          ${this.discount?"✓ ":""}Apply studio10 · 10% off
        </button>
        <hr class="divider">
        <div class="row between"><span class="muted">Subtotal</span><strong>$${this.subtotal.toFixed(2)}</strong></div>
        @if (${this.discount}) {
          <div class="row between"><span class="muted">Discount</span><span>−$${(this.subtotal*.1).toFixed(2)}</span></div>
        }
        <div class="row between"><strong>Total</strong><strong>$${this.total.toFixed(2)}</strong></div>
        <button class="button primary" @click=${()=>{this.items=[]}}>Checkout</button>
      </div>
    `}};a.properties={items:{type:Array},discount:{type:Boolean}};let e=a;customElements.get("cart-demo")||customElements.define("cart-demo",e);
