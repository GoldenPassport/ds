import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  external: ['react', 'react-dom', '@headlessui/react', 'tailwindcss'],
  esbuildOptions(options, context) {
    if (context.format === 'esm') {
      options.banner = { js: '"use client";' };
    }
  },
});
