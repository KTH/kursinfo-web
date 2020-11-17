module.exports = {
  env: {
    test: {
      presets: ['@babel/preset-env'],
      plugins: [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        "@babel/plugin-transform-runtime"
      ]
    }
  }
}
