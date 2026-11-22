import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css             */import{D as a,n as l}from"./shared-RCEx0mSF.js";const i=class i extends a{constructor(){super(),this.songs=[{title:"Soft Focus",artist:"The Paper Planes",length:198},{title:"Afterglow",artist:"Mira Sol",length:224},{title:"Little by Little",artist:"Northbound",length:176}],this.currentIndex=0,this.playing=!1,this.elapsed=36}get current(){return this.songs[this.currentIndex]}get playlist(){return this.songs.map((t,e)=>({...t,id:e,selected:this.currentIndex===e}))}get elapsedLabel(){return this.formatTime(this.elapsed)}formatTime(t){return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}togglePlayback(){if(this.playing){this.playing=!1,this.intervalId!==void 0&&window.clearInterval(this.intervalId),this.intervalId=void 0;return}this.playing=!0,this.intervalId=window.setInterval(()=>{this.elapsed>=this.current.length?this.next():this.elapsed++},1e3)}next(){this.currentIndex=(this.currentIndex+1)%this.songs.length,this.elapsed=0}previous(){this.currentIndex=(this.currentIndex-1+this.songs.length)%this.songs.length,this.elapsed=0}seek(t){this.elapsed=Math.max(0,Math.min(this.current.length,t))}disconnectedCallback(){super.disconnectedCallback(),this.intervalId!==void 0&&window.clearInterval(this.intervalId)}render(){const t=this.current;return l`
      <div class="stack">
        <div class="album"><div class="album-disc">side A</div></div>
        <div class="row between">
          <div><strong>${t.title}</strong><div class="muted small">${t.artist}</div></div>
          <span class="tag">Now playing</span>
        </div>
        <input aria-label="Seek track" type="range" min="0" max=${t.length} .value=${String(this.elapsed)}
          @input=${e=>this.seek(Number(e.target.value))}>
        <div class="row between muted small"><span>${this.elapsedLabel}</span><span>${this.formatTime(t.length)}</span></div>
        <div class="row" style="justify-content:center">
          <button class="button icon" aria-label="Previous track" @click=${()=>this.previous()}>⏮</button>
          @if (${this.playing}) {
            <button class="button primary icon" aria-label="Pause" @click=${()=>this.togglePlayback()}>Ⅱ</button>
          } @else {
            <button class="button primary icon" aria-label="Play" @click=${()=>this.togglePlayback()}>▶</button>
          }
          <button class="button icon" aria-label="Next track" @click=${()=>this.next()}>⏭</button>
        </div>
        <hr class="divider">
        <ul class="list">
          @for (item of ${this.playlist}; track item.id) {
            <li class="row between small">
              <button class="choice" [class.selected]="{{ item.selected }}" data-song-id="{{ item.id }}"
                @click=${e=>{this.currentIndex=Number(e.currentTarget.dataset.songId),this.elapsed=0}}>
                {{ item.title }} <span class="muted">— {{ item.artist }}</span>
              </button>
            </li>
          }
        </ul>
      </div>
    `}};i.properties={songs:{type:Array},currentIndex:{type:Number},playing:{type:Boolean},elapsed:{type:Number}};let s=i;customElements.get("music-player-demo")||customElements.define("music-player-demo",s);
