import { LitElement, css } from 'lit';

const demoStyles = css`
  :host {
    display: block;
    color: #f1eadc;
    font: 400 16px/1.5 'DM Sans', sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  button,
  input,
  select {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  .stack {
    display: grid;
    gap: 14px;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .between {
    justify-content: space-between;
  }

  .muted {
    color: #c1c5d2;
  }

  .small {
    font-size: 14px;
  }

  .field,
  .select {
    min-width: 0;
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #40506d;
    border-radius: 9px;
    outline: none;
    color: #f1eadc;
    background: #101624;
  }

  .field:focus,
  .select:focus {
    border-color: #718bb9;
    box-shadow: 0 0 0 3px #718bb920;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    border: 1px solid #40506d;
    border-radius: 9px;
    padding: 9px 13px;
    color: #f1eadc;
    background: #20283a;
    transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
  }

  .button:hover {
    border-color: #718bb9;
    background: #263451;
  }

  .button:active {
    transform: translateY(1px);
  }

  .button.primary {
    border-color: #d6c6ac;
    color: #172038;
    background: #dbcdb5;
    font-weight: 700;
  }

  .button.primary:hover {
    background: #eadfc9;
  }

  .button.danger {
    padding: 5px 9px;
    color: #ff9a9a;
  }

  .button.icon {
    width: 34px;
    height: 34px;
    padding: 0;
    font-size: 18px;
  }

  .chip {
    border: 1px solid #35343f;
    border-radius: 99px;
    padding: 6px 11px;
    color: #c1c5d2;
    background: transparent;
    font-size: 14px;
  }

  .chip.active {
    border-color: #718bb9;
    color: #eadfc9;
    background: #718bb920;
  }

  .list {
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .list-row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 10px;
    border: 1px solid #2c2b35;
    border-radius: 10px;
    background: #191920;
  }

  .list-row > .grow {
    flex: 1;
    min-width: 0;
  }

  .check {
    accent-color: #a68aff;
    width: 16px;
    height: 16px;
  }

  .done {
    color: #858493;
    text-decoration: line-through;
  }

  .empty {
    padding: 22px 12px;
    border: 1px dashed #383743;
    border-radius: 10px;
    color: #8f8e9b;
    text-align: center;
  }

  .metric {
    border: 1px solid #302f3a;
    border-radius: 12px;
    padding: 12px;
    background: #1a1921;
  }

  .metric strong {
    display: block;
    color: #f5f2ff;
    font: 700 22px/1.2 'Manrope', sans-serif;
  }

  .metric span {
    color: #9695a4;
    font-size: 13px;
  }

  .progress {
    height: 7px;
    overflow: hidden;
    border-radius: 99px;
    background: #30303a;
  }

  .progress > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #8e6dff, #d29aff);
    transition: width 250ms ease;
  }

  .tag {
    display: inline-block;
    border: 1px solid #45404f;
    border-radius: 99px;
    padding: 3px 8px;
    color: #c3b4ff;
    background: #9c7bff14;
    font-size: 13px;
  }

  .success {
    border: 1px solid #315d4a;
    border-radius: 10px;
    padding: 12px;
    color: #9ee0bd;
    background: #193126;
  }

  .choice {
    width: 100%;
    padding: 11px 13px;
    border: 1px solid #363540;
    border-radius: 9px;
    color: #eae8f0;
    background: #191920;
    text-align: left;
  }

  .choice:hover,
  .choice.selected {
    border-color: #9778ec;
    background: #8b6de51a;
  }

  .divider {
    height: 1px;
    border: 0;
    background: #2d2c36;
  }

  .timer-face {
    display: grid;
    place-items: center;
    min-height: 150px;
    border: 1px solid #37313f;
    border-radius: 16px;
    background: radial-gradient(circle at 50% 45%, #533d762d, #191820 65%);
  }

  .timer-face strong {
    font: 800 48px/1 'DM Mono', monospace;
    letter-spacing: -3px;
  }

  .timer-face span {
    margin-top: 8px;
    color: #aaa4bb;
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
  }

  .day {
    display: grid;
    place-items: center;
    width: 100%;
    aspect-ratio: 1;
    border: 1px solid #363540;
    border-radius: 8px;
    color: #aaa8b5;
    background: #191920;
    font-size: 13px;
  }

  .day.checked {
    border-color: #9474ee;
    color: #e2d9ff;
    background: #8264d7;
  }

  .grid-two {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 9px;
  }

  .kanban {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  .lane {
    min-width: 0;
    padding: 10px;
    border: 1px solid #2d2c36;
    border-radius: 11px;
    background: #17171e;
  }

  .lane-title {
    margin: 0 0 9px;
    color: #bbb9c7;
    font-size: 14px;
    font-weight: 700;
  }

  .lane-card {
    margin-top: 7px;
    padding: 9px;
    border: 1px solid #34333e;
    border-radius: 8px;
    color: #dedce6;
    background: #22212a;
    font-size: 14px;
  }

  .album {
    display: grid;
    place-items: center;
    min-height: 170px;
    border: 1px solid #443853;
    border-radius: 14px;
    background:
      radial-gradient(circle at 35% 35%, #c290ef88, transparent 34%),
      radial-gradient(circle at 70% 70%, #7b67ee77, transparent 38%),
      linear-gradient(145deg, #312239, #181721 70%);
  }

  .album-disc {
    display: grid;
    place-items: center;
    width: 96px;
    height: 96px;
    border: 1px solid #ffffff3a;
    border-radius: 50%;
    color: #dfcdfc;
    background: radial-gradient(circle, #221b2a 0 10%, #b181cf 12% 14%, #342746 16% 100%);
    box-shadow: 0 10px 35px #05040966;
    font-size: 14px;
  }

  input[type='range'] {
    width: 100%;
    accent-color: #ab8aff;
  }

  @media (max-width: 560px) {
    .kanban {
      grid-template-columns: 1fr;
    }
  }
`;

export abstract class DemoElement extends LitElement {
  static styles = demoStyles;
}
