import{D as e,n as o}from"./shared-D9OPbzUs.js";/* empty css             */const i=class i extends e{constructor(){super(),this.duration=300,this.seconds=this.duration,this.running=!1}get clock(){const s=Math.floor(this.seconds/60).toString().padStart(2,"0"),n=(this.seconds%60).toString().padStart(2,"0");return`${s}:${n}`}get progressPercent(){return this.duration?(this.duration-this.seconds)/this.duration*100:0}start(){this.running||this.seconds<=0||(this.running=!0,this.intervalId=window.setInterval(()=>{this.seconds<=1?(this.seconds=0,this.pause()):this.seconds--},1e3))}pause(){this.running=!1,this.intervalId!==void 0&&window.clearInterval(this.intervalId),this.intervalId=void 0}reset(){this.pause(),this.seconds=this.duration}setDuration(s){this.pause(),this.duration=s*60,this.seconds=this.duration}disconnectedCallback(){super.disconnectedCallback(),this.pause()}render(){return o`
      <div class="stack">
        <div class="timer-face"><div><strong>${this.clock}</strong><span>deep work session</span></div></div>
        <div class="progress"><span [style.width]=${this.progressPercent+"%"}></span></div>
        <div class="row between">
          <span class="muted small">Session length</span>
          <div class="row">
            <button class="chip" [class.active]=${this.duration===300} @click=${()=>this.setDuration(5)}>5 min</button>
            <button class="chip" [class.active]=${this.duration===900} @click=${()=>this.setDuration(15)}>15 min</button>
            <button class="chip" [class.active]=${this.duration===1500} @click=${()=>this.setDuration(25)}>25 min</button>
          </div>
        </div>
        <div class="row">
          @if (${this.running}) {
            <button class="button primary" @click=${()=>this.pause()}>Pause</button>
          } @else {
            <button class="button primary" @click=${()=>this.start()}>Start focus</button>
          }
          <button class="button" @click=${()=>this.reset()}>Reset</button>
          @if (${this.seconds===0}) { <span class="success">Session complete. Nice work!</span> }
        </div>
      </div>
    `}};i.properties={seconds:{type:Number},duration:{type:Number},running:{type:Boolean}};let t=i;customElements.get("focus-timer-demo")||customElements.define("focus-timer-demo",t);
