// Flat config for ESLint v9+
// Docs: https://eslint.org/docs/latest/use/configure/configuration-files
//
// `eslint-config-expo/flat` already registers the `import`, `react`,
// `react-hooks`, `react-native`, `expo`, and TypeScript plugins. Do NOT
// redeclare them here — ESLint flat config rejects duplicate plugin keys.
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = [
  ...expoConfig,
  {
    ignores: [
      'node_modules/**',
      '.expo/**',
      'dist/**',
      'android/**',
      'ios/**',
      'coverage/**',
      'expo-env.d.ts',
      'metro.config.js',
      'babel.config.js',
      'jest.config.js',
      'tailwind.config.js',
    ],
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      // TypeScript ergonomics
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Import order
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-native', group: 'external', position: 'before' },
            { pattern: 'expo*', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-native'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-duplicates': 'error',

      // Hygiene
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],

      // axios / i18next export style is intentional — default object exposes
      // utility methods (axios.create, axios.isCancel, i18n.use, ...). The
      // named-as-default-member check is a false positive here.
      'import/no-named-as-default-member': 'off',
    },
  },
  {
    files: ['jest.setup.ts', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  prettierConfig,
];
