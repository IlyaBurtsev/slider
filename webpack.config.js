const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv = {}) => {
  const { mode = 'development' } = argv;
  const isProduction = mode === 'production';
  const isDevelopment = mode === 'development';
  const pagesDir = path.resolve(__dirname);

  const getStyleLoaders = () => {
    return [isProduction ? MiniCssExtractPlugin.loader : 'style-loader', 'css-loader'];
  };
  const getPlugins = () => {
    const plugins = [
      new webpack.ProgressPlugin(),
      new HtmlWebpackPlugin({
        template: `${pagesDir}/example/example.pug`,
        minify: isProduction
          ? {
              html5: true,
              collapseWhitespace: true,
              minifyCSS: true,
              minifyJS: true,
              minifyURLs: false,
              removeAttributeQuotes: false,
              removeComments: true,
              removeEmptyAttributes: true,
              removeOptionalTags: true,
              removeRedundantAttributes: false,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributese: true,
              useShortDoctype: true,
            }
          : false,
      }),
    ];
    if (isProduction) {
      plugins.push(
        new MiniCssExtractPlugin({
          filename: '[name].css?version=[contenthash]',
          chunkFilename: '[id].css?version=[contenthash]',
        }),
      );
    }
    return plugins;
  };
  return {
		target: 'web',
    mode: isProduction ? 'production' : 'development',
    output: {
			path: path.resolve(__dirname, 'dist'),
			filename: isDevelopment ? 'js/[name].js' : `Plugin.js`,
			publicPath: '/',
			chunkFilename: 'js/[name].js',
			library: isDevelopment ? undefined : 'RangeSlider',
			libraryTarget: isDevelopment ? undefined : 'umd',
			libraryExport: isDevelopment ? undefined : 'default',
			globalObject: 'this',
			clean: true,
    },
    entry: {
			index:  isDevelopment ? `${pagesDir}/example/example.js` : `${pagesDir}/src/plugin/Plugin.ts`,
		},
    resolve: {
			modules: [`${__dirname}/src/js`, `${__dirname}/src`, `${__dirname}/dist`, 'node_modules'],
      extensions: ['.js', '.ts', '.scss'],
      alias: {
        '@theme': path.resolve(__dirname, 'style'),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            allowTsInNodeModules: true,
          },
        },
        {
          test: /\.css$/,
          use: getStyleLoaders(),
        },
        {
          test: /\.scss$/,
          use: [...getStyleLoaders(), 'sass-loader'],
        },
        {
          test: /\.pug$/,
          loader: 'simple-pug-loader',
          options: {
            pretty: true,
          },
        },
        {
          test: /\.(png|jpg|svg|gif)$/i,
          exclude: /(fonts)/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/images/[name]-[contenthash].[ext]',
          },
        },
        {
          test: /\.(ttf|woff|woff2|eot|svg)$/i,
          include: /fonts/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name][ext]',
          },
        },
      ],
    },

    plugins: getPlugins(),

    devServer: {
      open: '/index.html',
      hot: false,
      open: false,
    },
  };
};
