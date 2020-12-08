module.exports = {
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  overrides: [
    {
      files: ['**/*.spec.js'],
      env: {
        jest: true
      }
    }
  ]
}
