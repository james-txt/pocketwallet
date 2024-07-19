module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:chromium/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    browser: true,
    webextensions: true 
  },
  rules: {
    'no-console': 'warn',  // Adjust based on your preference for console statements
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',  // Enforce no usage of `any` type
    'prettier/prettier': ['error', { endOfLine: 'auto' }]  // Ensure code formatting rules
  },
  settings: {
    'import/resolver': {
      typescript: {}  // Resolve TypeScript imports
    }
  }
};
