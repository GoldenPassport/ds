import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // React + hooks
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed with React 17+ JSX transform
      'react/prop-types': 'off', // TypeScript handles this
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // src/ files — enable project-aware type checking (tsconfig.json covers src/ only)
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Project-wide rules (no type-aware parsing required)
  {
    rules: {
      // Allow _-prefixed variables to be unused (intentional ignore convention)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Story files — relax rules that fire false positives on Storybook's
  // render() pattern (which is a valid React component, ESLint just can't tell).
  {
    files: ['src/**/*.stories.{ts,tsx}'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react/no-unescaped-entities': 'off',
    },
  },

  // Ignore compiled output and config files
  {
    ignores: ['dist/**', 'coverage/**', 'storybook-static/**', '*.config.*'],
  },
);
