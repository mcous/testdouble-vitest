import * as path from 'node:path'
import { defineConfig } from 'vitest/config'

import pkg from './package.json'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
    },
    rollupOptions: {
      external: Object.keys(pkg.peerDependencies),
    },
  },
  test: {
    alias: {
      'testdouble-vitest': path.join(__dirname, 'src/index.ts'),
    },
  },
})
