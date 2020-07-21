module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['google', 'eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: 'module',
  },
};
