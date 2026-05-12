/**
 * Conventional commits configuration for Kàff GUI mobile.
 * Spec: https://www.conventionalcommits.org/
 */
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting, no logic change
        'refactor', // Code refactor
        'perf', // Performance improvement
        'test', // Add or update tests
        'build', // Build system / dependencies
        'ci', // CI configuration
        'chore', // Other changes
        'revert', // Revert previous commit
      ],
    ],
    'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [1, 'always', 200],
  },
};
