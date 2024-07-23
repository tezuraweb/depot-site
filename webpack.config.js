const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PreloadFontPlugin = require("./plugins/preloadFontPlugin");
const generatePreloadLinks = require('./plugins/generatePreloadLinks');
const generateCssLinks = require('./plugins/generateCssLinks');
const generateScriptLinks = require('./plugins/generateScriptLinks');

module.exports = {
    entry: [
        './src/js/index.js',
        './src/css/style.scss',
    ],

    output: {
        path: path.resolve(__dirname, 'static/dist'),
        publicPath: '/dist/',
        filename: 'bundle.[contenthash].js',
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.scss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer(),
                                ],
                            },
                            sourceMap: true
                        }
                    },
                    'sass-loader',
                ],
            },
            {
                test: /\.css$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer(),
                                ],
                            },
                            sourceMap: true
                        }
                    }
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|webp)$/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/resource',
            }
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx'],
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'views/includes/preload.njk'),
            templateContent: ({ htmlWebpackPlugin }) => generatePreloadLinks(htmlWebpackPlugin.tags.headTags),
            inject: false,
        }),
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'views/includes/versionCss.njk'),
            templateContent: ({ htmlWebpackPlugin }) => generateCssLinks(htmlWebpackPlugin.tags.headTags),
            inject: false,
        }),
        new HtmlWebpackPlugin({
            filename: path.join(__dirname, 'views/includes/versionJs.njk'),
            templateContent: ({ htmlWebpackPlugin }) => generateScriptLinks(htmlWebpackPlugin.tags.headTags),
            inject: false,
        }),
        new PreloadFontPlugin(),
        new MiniCssExtractPlugin({
            filename: 'bundle.[contenthash].css',
        }),
    ],
};