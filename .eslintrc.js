module.exports = {
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
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
