import { nghtml } from '../../src/nghtml';
import { DemoElement } from '../shared';

interface Song {
  title: string;
  artist: string;
  length: number;
}

class MusicPlayerDemo extends DemoElement {
  static properties = {
    songs: { type: Array },
    currentIndex: { type: Number },
    playing: { type: Boolean },
    elapsed: { type: Number },
  };
  declare songs: Song[];
  declare currentIndex: number;
  declare playing: boolean;
  declare elapsed: number;
  private intervalId: number | undefined;

  constructor() {
    super();
    this.songs = [
      { title: 'Soft Focus', artist: 'The Paper Planes', length: 198 },
      { title: 'Afterglow', artist: 'Mira Sol', length: 224 },
      { title: 'Little by Little', artist: 'Northbound', length: 176 },
    ];
    this.currentIndex = 0;
    this.playing = false;
    this.elapsed = 36;
  }

  get current(): Song {
    return this.songs[this.currentIndex];
  }

  get playlist(): Array<Song & { id: number; selected: boolean }> {
    return this.songs.map((song, id) => ({ ...song, id, selected: this.currentIndex === id }));
  }

  get elapsedLabel(): string {
    return this.formatTime(this.elapsed);
  }

  formatTime(seconds: number): string {
    return `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`;
  }

  togglePlayback(): void {
    if (this.playing) {
      this.playing = false;
      if (this.intervalId !== undefined) window.clearInterval(this.intervalId);
      this.intervalId = undefined;
      return;
    }
    this.playing = true;
    this.intervalId = window.setInterval(() => {
      if (this.elapsed >= this.current.length) this.next();
      else this.elapsed++;
    }, 1000);
  }

  next(): void {
    this.currentIndex = (this.currentIndex + 1) % this.songs.length;
    this.elapsed = 0;
  }

  previous(): void {
    this.currentIndex = (this.currentIndex - 1 + this.songs.length) % this.songs.length;
    this.elapsed = 0;
  }

  seek(value: number): void {
    this.elapsed = Math.max(0, Math.min(this.current.length, value));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.intervalId !== undefined) window.clearInterval(this.intervalId);
  }

  render() {
    const song = this.current;
    return nghtml`
      <div class="stack">
        <div class="album"><div class="album-disc">side A</div></div>
        <div class="row between">
          <div><strong>${song.title}</strong><div class="muted small">${song.artist}</div></div>
          <span class="tag">Now playing</span>
        </div>
        <input aria-label="Seek track" type="range" min="0" max=${song.length} .value=${String(this.elapsed)}
          @input=${(event: Event) => this.seek(Number((event.target as HTMLInputElement).value))}>
        <div class="row between muted small"><span>${this.elapsedLabel}</span><span>${this.formatTime(song.length)}</span></div>
        <div class="row" style="justify-content:center">
          <button class="button icon" aria-label="Previous track" @click=${() => this.previous()}>⏮</button>
          @if (${this.playing}) {
            <button class="button primary icon" aria-label="Pause" @click=${() => this.togglePlayback()}>Ⅱ</button>
          } @else {
            <button class="button primary icon" aria-label="Play" @click=${() => this.togglePlayback()}>▶</button>
          }
          <button class="button icon" aria-label="Next track" @click=${() => this.next()}>⏭</button>
        </div>
        <hr class="divider">
        <ul class="list">
          @for (item of ${this.playlist}; track item.id) {
            <li class="row between small">
              <button class="choice" [class.selected]="{{ item.selected }}" data-song-id="{{ item.id }}"
                @click=${(event: Event) => {
                  this.currentIndex = Number((event.currentTarget as HTMLElement).dataset.songId);
                  this.elapsed = 0;
                }}>
                {{ item.title }} <span class="muted">— {{ item.artist }}</span>
              </button>
            </li>
          }
        </ul>
      </div>
    `;
  }
}

if (!customElements.get('music-player-demo')) customElements.define('music-player-demo', MusicPlayerDemo);
