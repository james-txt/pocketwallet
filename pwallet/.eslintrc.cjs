module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended', // Add React linting rules
    'plugin:react-hooks/recommended', // Add React Hooks linting rules
    'plugin:jsx-a11y/recommended', // Add accessibility linting rules
    'plugin:testing-library/react', // Add Testing Library linting rules
    'plugin:jest-dom/recommended', // Add Jest DOM linting rules
    'plugin:prettier/recommended', // Add Prettier for code formatting
    'plugin:chromium/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true // Enable JSX parsing
    }
  },
  env: {
    browser: true,
    webextensions: true,
    jest: true, // Support for Jest globals
    'vitest/globals': true // Support for Vitest globals
  },
  rules: {
    'no-console': 'warn', 
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error', 
    'prettier/prettier': ['error', { endOfLine: 'auto' }],
    'react/prop-types': 'off', // Disable prop-types since using TypeScript
    'react/react-in-jsx-scope': 'off' // Not necessary with React 17+
  },
  settings: {
    react: {
      version: 'detect' // Automatically detect the react version
    },
    'import/resolver': {
      typescript: {} 
    }
  }
};
