import { LitElement } from 'lit';
import { afterEach, describe, expect, it } from 'vitest';
import './todo/main';
import './focus-timer/main';
import './expenses/main';
import './habits/main';
import './cart/main';
import './quiz/main';
import './guest-list/main';
import './kanban/main';
import './booking/main';
import './music-player/main';

afterEach(() => {
  document.body.replaceChildren();
});

describe('standalone NGHTML demos', () => {
  const demos = [
    ['todo-demo', 'Sketch the component API'],
    ['focus-timer-demo', '05:00'],
    ['expense-demo', 'Coffee & croissant'],
    ['habit-demo', 'Read 10 pages'],
    ['cart-demo', 'Everyday tote'],
    ['quiz-demo', 'Which directive repeats a template for each item?'],
    ['guest-list-demo', 'Alex Morgan'],
    ['kanban-demo', 'Outline the flow'],
    ['booking-demo', 'Confirm appointment'],
    ['music-player-demo', 'Soft Focus'],
  ];

  it.each(demos)('%s renders its initial flow', async (tagName, expectedText) => {
    const element = document.createElement(tagName) as LitElement;
    document.body.append(element);
    await element.updateComplete;

    expect(element.shadowRoot?.textContent).toContain(expectedText);
  });

  it('updates scoped task checkboxes and filter state', async () => {
    const element = document.createElement('todo-demo') as LitElement;
    document.body.append(element);
    await element.updateComplete;

    const checkboxes = Array.from(
      element.shadowRoot?.querySelectorAll('input[type="checkbox"]') ?? [],
    ) as HTMLInputElement[];
    expect(checkboxes.map((checkbox) => checkbox.checked)).toEqual([true, false, false]);

    checkboxes[1].click();
    await element.updateComplete;
    const updatedCheckboxes = Array.from(
      element.shadowRoot?.querySelectorAll('input[type="checkbox"]') ?? [],
    ) as HTMLInputElement[];
    expect(updatedCheckboxes.map((checkbox) => checkbox.checked)).toEqual([true, true, false]);

    const activeFilter = [...(element.shadowRoot?.querySelectorAll('button') ?? [])]
      .find((button) => button.textContent?.trim() === 'Active');
    activeFilter?.click();
    await element.updateComplete;
    expect(element.shadowRoot?.querySelectorAll('li.list-row')).toHaveLength(1);
  });
});
