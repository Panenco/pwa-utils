module.exports = {
  extends: ['monorepo'],
  rules: {
    'scope-enum': [
      2,
      'always',
      [
        'all',
        'docs',
        'breadcrumbs',
        'eslint-config-react',
        'formik-wizard-form',
        'formik-form-field',
        'pagination',
        'pwa-utils',
        'rollup-plugin-svg-sprite',
      ],
    ],
  },
};
