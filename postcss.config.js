module.exports = {
  plugins: [
    require('postcss-custom-media')({
      extensions: {
        '--phone': '(max-width: 43em)',
        '--tablet': '(min-width: 43em)',
        '--desktop': '(min-width: 64em)',
        '--retina': '(min-width: 100em)'
      }
    })
  ]
}
