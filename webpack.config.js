module.exports = {
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(woff2?|ttf|eot|svg)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' }
    ]
  }
}
