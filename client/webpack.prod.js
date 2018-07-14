const webpack = require ('webpack');
const path = require ('path');
const devMode = process.env.NODE_ENV !== 'production';

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require ('uglifyjs-webpack-plugin');

/*
 * We've enabled ExtractTextPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/extract-text-webpack-plugin
 *
 */

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

/*
 * HtmlWebpackPlugin (see https://github.com/jantimon/html-webpack-plugin)
 */
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry:  {
        app: './app/index.js'
    },
    output: {
        filename:      '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].js',
        path:          path.resolve (__dirname, 'dist')
    },

    module: {
        rules: [
            {
                test:    /\.html$/,
                exclude: [/node_modules/, /index.html/, /index.tpl.html/],
                use:     [
                    {
                        loader:  'ngtemplate-loader',
                        options: {
                            relativeTo: 'app/'
                        }
                    },
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.css$/,

                use: [
                    {
                        loader: devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',

                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,

                use: [
                    'file-loader'
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },

    plugins: [
        new UglifyJSPlugin (),
        new HtmlWebpackPlugin({
                                  template: 'app/index.tpl.html'
                              }),
        new MiniCssExtractPlugin({ filename: devMode ? '[name].css' : '[name].[hash].css' })
    ],
    mode:    'development',
    devtool: devMode ? 'cheap-module-eval-source-map' : 'source-map',

    optimization: {
        splitChunks: {
            chunks:    'async',
            minSize:   30000,
            minChunks: 1,
            name:      false,

            cacheGroups: {
                vendors: {
                    test:     /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        }
    }
};
