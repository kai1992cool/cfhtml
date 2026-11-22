import { defineConfig } from 'vitest/config';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        demos: 'demos/index.html',
        gettingStarted: 'getting-started/index.html',
        todo: 'demos/todo/index.html',
        focusTimer: 'demos/focus-timer/index.html',
        expenses: 'demos/expenses/index.html',
        habits: 'demos/habits/index.html',
        cart: 'demos/cart/index.html',
        quiz: 'demos/quiz/index.html',
        guestList: 'demos/guest-list/index.html',
        kanban: 'demos/kanban/index.html',
        booking: 'demos/booking/index.html',
        musicPlayer: 'demos/music-player/index.html',
      },
    },
  },
  test: {
    environment: 'jsdom',
    restoreMocks: true,
    exclude: ['language-server/test/**', 'node_modules/**', 'dist/**'],
  },
});
