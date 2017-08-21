module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true
  },
  // extends: 'eslint:recommended',
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    }
  },
  plugins: [
    'babel',
    'react',
    "import"
  ],
  rules: {
    'indent': ['error', 2, {SwitchCase: 1}],
  }
}