import{D as i,n as o}from"./shared-D9OPbzUs.js";/* empty css             */const s=class s extends i{constructor(){super(),this.service="",this.date="",this.time="",this.confirmed=!1}get canConfirm(){return!!(this.service&&this.date&&this.time)}get timeSlots(){return["09:30","11:00","13:30","15:00"].map(t=>({time:t,selected:this.time===t}))}render(){return o`
      @if (${this.confirmed}) {
        <div class="stack">
          <div class="success">Your appointment is booked. We’ll see you there!</div>
          <div class="metric"><strong>${this.service}</strong><span>${this.date} · ${this.time}</span></div>
          <button class="button" @click=${()=>{this.confirmed=!1}}>Book another</button>
        </div>
      } @else {
        <form class="stack" @submit=${t=>{t.preventDefault(),this.canConfirm&&(this.confirmed=!0)}}>
          <label class="stack small">Choose a service
            <select class="select" .value=${this.service}
              @change=${t=>{this.service=t.target.value}}>
              <option value="">Select a service…</option><option>Studio consultation</option><option>Design review</option><option>Quick support</option>
            </select>
          </label>
          <label class="stack small">Choose a date
            <input class="field" type="date" .value=${this.date}
              @input=${t=>{this.date=t.target.value}}>
          </label>
          <div class="stack small">Choose a time
            <div class="grid-two">
              @for (slot of ${this.timeSlots}; track slot.time) {
                <button class="chip" type="button" [class.active]="{{ slot.selected }}"
                  data-time="{{ slot.time }}"
                  @click=${t=>{this.time=t.currentTarget.dataset.time??""}}>{{ slot.time }}</button>
              }
            </div>
          </div>
          <button class="button primary" type="submit" ?disabled=${!this.canConfirm}>Confirm appointment</button>
        </form>
      }
    `}};s.properties={service:{type:String},date:{type:String},time:{type:String},confirmed:{type:Boolean}};let e=s;customElements.get("booking-demo")||customElements.define("booking-demo",e);
