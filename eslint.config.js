export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.github/**', '*.config.*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
        process: 'readonly',
        localStorage: 'readonly',
        Set: 'readonly',
        Map: 'readonly',
        AudioContext: 'readonly',
        webkitAudioContext: 'readonly',
      },
    },
    plugins: {
      react: await import('eslint-plugin-react'),
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-debugger': 'off',
    },
  },
]
