import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/nghtml.ts',
      formats: ['es'],
      fileName: 'nghtml',
    },
    outDir: 'dist-package',
    rollupOptions: {
      external: (id) => id === 'lit' || id.startsWith('lit/'),
    },
  },
});
