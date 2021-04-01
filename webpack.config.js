require('dotenv').config();
const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); //to access built-in plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const isProd = process.env.NODE_ENV == 'production';
const browserBuild = process.env.BROWSER_ENV || 'chrome';
let _manifestBrowser = './manifest.json';
if (browserBuild == 'firefox') {
    _manifestBrowser = './manifest.firefox.json';
}

function modifyManifest(buffer) {
    
    let manifest = JSON.parse(buffer.toString());
    manifest.name = process.env.MANIFEST_NAME || 'Etisalat Wider Web';
    manifest.version = process.env.MANIFEST_VERSION || '0.0.1';
    manifest.description = process.env.MANIFEST_DESCRIPTION || 'The first Autistic friendly web extension';
    manifest.homepage_url = process.env.MANIFEST_HOMEPAGEURL || 'https://www.etisalat.ae';    
    return JSON.stringify(manifest, null, 2);
  }
const plugins = [
    new CleanWebpackPlugin(),
    new webpack.ProgressPlugin(),
    new CompressionPlugin(),
    new CopyPlugin({
        patterns: [
            {
                from: _manifestBrowser,
                to: "manifest.json",
                transform(content, path) {
                  return modifyManifest(content)
                },
                
            },
            {
                from: "**/*",
                context: path.resolve(__dirname, "src", "_locales"),
                to: "_locales",
                force: true,
                toType: "dir"
            },
            {
                from: "**/*",
                context: path.resolve(__dirname, "src", "assets/json"),
                to: "assets/json",
                force: true,
                toType: "dir"
            },
            {
                from: "**/*",
                context: path.resolve(__dirname, "src", "assets/images"),
                to: "assets/images",
                force: true,
                toType: "dir"
            },
            {
                from: "**/*",
                context: path.resolve(__dirname, "src", "assets/fonts"),
                to: "assets/fonts",
                force: true,
                toType: "dir"
            },
            {
                from: "**/*",
                context: path.resolve(__dirname, "src", "popup"),
                to: "popup",
                force: true,
                toType: "dir"
            }
        ],
    }),
    new MiniCssExtractPlugin({
        filename: 'assets/css/[name].css',
        chunkFilename: 'assets/css/[id].css',
    }),
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        'jquery': 'jquery',
        React: "react"
    }),
    new webpack.DefinePlugin({
        'process.env.BROWSER_ENV': JSON.stringify(process.env.BROWSER_ENV),
    }),
    new Dotenv()
];
module.exports = env => {
    return {
        mode: process.env.NODE_ENV, // "production" | "development" | "none"
        devtool: isProd ? false : "source-map",
        watch: isProd ? false : true,
        plugins,
        watchOptions: {
            ignored: 'node_modules/**'
        },
        entry: {
            background: path.join(__dirname, 'src/ext_scripts/background.js'),
            setting: path.join(__dirname, 'src/ext_scripts/setting.js'),
            inject: path.join(__dirname, 'src/inject/inject.js'),
            inject_ds: path.join(__dirname, 'src/inject/inject-ds.js'),
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'assets/js/[name].bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    use: 'babel-loader'
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: './',
                                esModule: false,
                            },
                        },
                        "css-loader",
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            "autoprefixer", {
                                                // Options
                                            },
                                        ],
                                        [
                                            "postcss-preset-env", {
                                                // Options
                                            },
                                        ],
                                    ],
                                },
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: !isProd,
                                implementation: require("sass"),
                                additionalData: browserBuild == 'firefox' ? "$browserEnv: moz;" : "$browserEnv: chrome;",
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg)$/i,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                outputPath: 'assets/images',
                                name: '[name].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            url: false,
                            outputPath: 'assets/fonts',
                            name: '[name].[ext]'
                        }
                    },
                }
            ]
        },
        resolve: {
            extensions: ['*', '.js', '.jsx'],
            fallback: { "url": false, "path": false }
        },
        optimization: {
            removeEmptyChunks: true,
            mergeDuplicateChunks: true,
            minimize: isProd,
            minimizer: [
                new TerserPlugin({
                    extractComments: isProd,
                    parallel: true,
                }),
                new CssMinimizerPlugin(),
            ]
        },
    };
};