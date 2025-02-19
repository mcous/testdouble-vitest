import path from 'node:path'

import { defineConfig } from 'vitest/config'

import packageMeta from './package.json'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: Object.keys(packageMeta.peerDependencies),
    },
  },
  test: {
    alias: {
      'testdouble-vitest': path.join(import.meta.dirname, './src/index.ts'),
    },
  },
})
