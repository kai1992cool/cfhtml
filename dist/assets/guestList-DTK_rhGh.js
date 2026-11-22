import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{D as i,n}from"./shared-RCEx0mSF.js";const a=class a extends i{constructor(){super(),this.guests=[{id:1,name:"Alex Morgan",attending:!0},{id:2,name:"Sam Rivera",attending:!1},{id:3,name:"Jamie Chen",attending:!0}],this.draft=""}get attendingCount(){return this.guests.filter(t=>t.attending).length}addGuest(){const t=this.draft.trim();t&&(this.guests=[...this.guests,{id:Date.now(),name:t,attending:!1}],this.draft="")}toggle(t){this.guests=this.guests.map(s=>s.id===t?{...s,attending:!s.attending}:s)}removeGuest(t){this.guests=this.guests.filter(s=>s.id!==t)}render(){return n`
      <div class="stack">
        <div class="grid-two">
          <div class="metric"><strong>${this.guests.length}</strong><span>invited</span></div>
          <div class="metric"><strong>${this.attendingCount}</strong><span>confirmed</span></div>
        </div>
        <form class="row" @submit=${t=>{t.preventDefault(),this.addGuest()}}>
          <input class="field" aria-label="Guest name" placeholder="Guest name" .value=${this.draft}
            @input=${t=>{this.draft=t.target.value}}>
          <button class="button primary" type="submit">Invite</button>
        </form>
        <ul class="list">
          @for (guest of ${this.guests}; track guest.id) {
            <li class="list-row">
              <span class="grow">{{ guest.name }}</span>
              @if (guest.attending) {
                <span class="tag">Going</span>
              } @else {
                <span class="muted small">No reply</span>
              }
              <button class="button" aria-label="Toggle RSVP" data-guest-id="{{ guest.id }}"
                @click=${t=>this.toggle(Number(t.currentTarget.dataset.guestId))}>
                @if (guest.attending) { Undo } @else { RSVP }
              </button>
              <button class="button danger" aria-label="Remove guest" data-guest-id="{{ guest.id }}"
                @click=${t=>this.removeGuest(Number(t.currentTarget.dataset.guestId))}>×</button>
            </li>
          } @empty {
            <li class="empty">No guests yet. Send your first invite.</li>
          }
        </ul>
      </div>
    `}};a.properties={guests:{type:Array},draft:{type:String}};let e=a;customElements.get("guest-list-demo")||customElements.define("guest-list-demo",e);
