module.exports = {
  extends: [
    'eslint-config-airbnb-typescript',
    'eslint-config-airbnb/hooks',
    'eslint-config-prettier',
    'eslint-config-prettier/@typescript-eslint',
    'eslint-config-prettier/react',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'eslint-plugin-prettier'],
  rules: {
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'react/require-default-props': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-props-no-spreading': 'off',
    'no-param-reassign': 'off',
    'class-methods-use-this': 'off',
    'react/static-property-placement': 'off',
    'no-underscore-dangle': 'off',
    'prettier/prettier': 'error',
    'import/prefer-default-export': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
