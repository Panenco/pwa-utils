module.exports = {
  extends: ['plugin:react/recommended', 'prettier/react'],
  plugins: ['react-hooks', 'jsx-a11y'],
  rules: {
    'arrow-parens': ['error', 'always'],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'react/jsx-props-no-spreading': 0,
    'react/static-property-placement': ['error', 'static public field'],
    'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
  },
};
