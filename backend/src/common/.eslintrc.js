module.exports = {
  env: {
    browser: false,
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': ['warn'],
    'no-console': 'off',
  },
};
