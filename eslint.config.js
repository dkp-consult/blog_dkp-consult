const { defineConfig, globalIgnores } = require('eslint/config')
const globals = require('globals')
const js = require('@eslint/js')
const { FlatCompat } = require('@eslint/eslintrc')

// eslint-config-next and eslint-plugin-prettier still ship eslintrc-style
// presets, so they are pulled in through FlatCompat rather than rewritten.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
      },
    },

    extends: compat.extends(
      'eslint:recommended',
      'plugin:prettier/recommended',
      'next/core-web-vitals'
    ),

    // Carried over verbatim from .eslintrc.js
    rules: {
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 0,
      'no-unused-vars': 0,
      'react/no-unescaped-entities': 0,
    },
  },

  // Build output and tooling copies. `.claude/worktrees` matters: it holds a
  // full checkout of this repository, so linting it would report every problem
  // twice over.
  globalIgnores(['**/node_modules', '.next', 'out', 'public', '.claude']),
])
