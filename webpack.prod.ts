import path from 'path'
import { Configuration } from 'webpack'

const config: Configuration = {
  context: path.resolve(__dirname, 'src'),
  output: {
    path: path.resolve(__dirname, 'public/assets/js'),
  },
  entry: {
    index: {
      import: './js/index.ts',
      filename: `index.js`,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: 'ts-loader',
      },
    ],
  },
  mode: "development",
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
}

export default config
