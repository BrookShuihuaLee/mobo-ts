module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react-hooks', 'dirs'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
      },
      {
        selector: ['memberLike', 'property', 'method'],
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'require',
        modifiers: ['private'],
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': ['error'],
    '@typescript-eslint/explicit-function-return-type': ['error'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useUpdateEffect|useEffectOnce|useDeepCompareEffect)',
      },
    ],
    '@typescript-eslint/no-shadow': 'error',
    'import/order': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
    'dirs/dirnames': ['error', { pattern: '^([a-z0-9\\-]+)|__tests__$' }],
    'dirs/filenames': [
      'error',
      {
        '**/*.md/*': '.*',
        '**/*': '^[a-z0-9\\-\\.]+$',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}
