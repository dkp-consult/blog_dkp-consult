import path from 'path'
import { defineConfig } from 'vitest/config'

// Mirrors the path aliases declared in jsconfig.json
const alias = {
  '@/components': path.resolve(import.meta.dirname, 'components'),
  '@/data': path.resolve(import.meta.dirname, 'data'),
  '@/layouts': path.resolve(import.meta.dirname, 'layouts'),
  '@/lib': path.resolve(import.meta.dirname, 'lib'),
  '@/css': path.resolve(import.meta.dirname, 'css'),
}

export default defineConfig({
  resolve: { alias },
  test: {
    environment: 'node',
    include: ['{lib,scripts,components,layouts,pages}/**/*.test.js'],
  },
})
