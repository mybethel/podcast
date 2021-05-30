module.exports = {
  collectCoverage: true,
  coverageReporters: ['html', 'lcovonly', 'text-summary'],
  preset: '@vue/cli-plugin-unit-jest',
  testMatch: [
    '**/*.spec.js'
  ]
}
