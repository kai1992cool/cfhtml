import { nghtml } from '../../src/nghtml';
import { DemoElement } from '../shared';

interface QuizQuestion {
  prompt: string;
  choices: string[];
  answer: number;
}

class QuizDemo extends DemoElement {
  static properties = {
    questions: { type: Array },
    questionIndex: { type: Number },
    selected: { type: Number },
    score: { type: Number },
    phase: { type: String },
  };
  declare questions: QuizQuestion[];
  declare questionIndex: number;
  declare selected: number;
  declare score: number;
  declare phase: string;

  constructor() {
    super();
    this.questions = [
      { prompt: 'Which directive repeats a template for each item?', choices: ['@if', '@for', '@switch'], answer: 1 },
      { prompt: 'What powers the custom elements in this demo?', choices: ['Web Components', 'An iframe', 'A server template'], answer: 0 },
      { prompt: 'Which library renders the template?', choices: ['Lit', 'jQuery', 'Handlebars'], answer: 0 },
    ];
    this.questionIndex = 0;
    this.selected = -1;
    this.score = 0;
    this.phase = 'playing';
  }

  answer(index: number): void {
    this.selected = index;
  }

  next(): void {
    if (this.selected < 0) return;
    if (this.selected === this.questions[this.questionIndex].answer) this.score++;
    if (this.questionIndex === this.questions.length - 1) {
      this.phase = 'results';
    } else {
      this.questionIndex++;
      this.selected = -1;
    }
  }

  restart(): void {
    this.questionIndex = 0;
    this.selected = -1;
    this.score = 0;
    this.phase = 'playing';
  }

  get choiceOptions(): Array<{ id: number; text: string; letter: string; selected: boolean }> {
    return this.questions[this.questionIndex].choices.map((text, id) => ({
      id,
      text,
      letter: String.fromCharCode(65 + id),
      selected: this.selected === id,
    }));
  }

  render() {
    const current = this.questions[this.questionIndex];
    return nghtml`
      @switch (${this.phase}) {
        @case ("playing") {
          <div class="stack">
            <div class="row between"><span class="tag">Question ${this.questionIndex + 1} / ${this.questions.length}</span><span class="muted small">${this.score} correct</span></div>
            <div class="progress"><span [style.width]=${((this.questionIndex + 1) / this.questions.length) * 100 + '%'}></span></div>
            <strong>${current.prompt}</strong>
            @for (choice of ${this.choiceOptions}; track choice.id) {
              <button class="choice" [class.selected]="{{ choice.selected }}"
                data-choice-id="{{ choice.id }}"
                @click=${(event: Event) => this.answer(Number((event.currentTarget as HTMLElement).dataset.choiceId))}>
                <span class="muted">{{ choice.letter }}.</span> {{ choice.text }}
              </button>
            }
            <button class="button primary" ?disabled=${this.selected < 0} @click=${() => this.next()}>
              ${this.questionIndex === this.questions.length - 1 ? 'See results' : 'Next question'} →
            </button>
          </div>
        }
        @case ("results") {
          <div class="stack">
            <div class="metric"><strong>${this.score} / ${this.questions.length}</strong><span>correct answers</span></div>
            @if (${this.score === this.questions.length}) {
              <div class="success">Perfect score — you know your way around!</div>
            } @else {
              <p class="muted">Every question is another chance to learn.</p>
            }
            <button class="button primary" @click=${() => this.restart()}>Try again</button>
          </div>
        }
        @default { <div class="empty">Quiz is getting ready…</div> }
      }
    `;
  }
}

if (!customElements.get('quiz-demo')) customElements.define('quiz-demo', QuizDemo);
