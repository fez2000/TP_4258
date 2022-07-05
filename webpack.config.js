const path = require("path");
const fs = require("fs");
const webpack = require("webpack");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LiveReloadPlugin = require("webpack-livereload-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const autoprefixer = require("autoprefixer");
const CompressionPlugin = require('compression-webpack-plugin');
var PurgeCssPlugin = require('purgecss-webpack-plugin');
var glob = require('glob-all');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const {
    VuetifyProgressiveModule
} = require("vuetify-loader");
const {
    InjectManifest
} = require("workbox-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
//const PrerenderSPAPlugin = require("prerender-spa-plugin");
//const Renderer = PrerenderSPAPlugin.PuppeteerRenderer;

const isDev = process.env.NODE_ENV === "development";
const SRC_DIR = path.resolve(__dirname, "src");
const DIST = path.resolve(__dirname, "public");

const entries = [{
    name: "main",
    filename: `${SRC_DIR}/main.js`
}];

const appDirectory = fs.realpathSync(process.cwd());
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
process.env.NODE_PATH = (process.env.NODE_PATH || "")
    .split(path.delimiter)
    .filter(folder => folder && !path.isAbsolute(folder))
    .map(folder => path.resolve(appDirectory, folder))
    .join(path.delimiter);

module.exports = {
    watch: isDev,
    devtool: true,
    watchOptions: {
        ignored: /(node_modules|bower_components)/,
    },
    entry: {
        ...entries.reduce((acc, entry) => {
            acc[entry.name] = entry.filename;
            return acc;
        }, {})
    },

    output: {
        path: DIST,
        publicPath: "/",
        filename:
            !isDev ?
            "[name].[chunkhash].[contenthash].js" :
            "[name].js"
    },

    resolve: {
       // fallback: { "crypto": require.resolve("crypto-browserify") },
        modules: [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, "bower_components")            
        ].concat(process.env.NODE_PATH.split(path.delimiter).filter(Boolean)),
        alias: {
            vue$: "vue/dist/vue.js",
            "@": SRC_DIR
        },
        extensions: [".js", ".ts", ".json", ".vue", ".css"]
    },

    module: {
        rules: [{
                resourceQuery: /blockType=i18n/,
                type: "javascript/auto",
                loader: "@kazupon/vue-i18n-loader"
            },
            {
                          test: /\.worker\.js$/,
                          loader: "worker-loader"
            },
            {
                test: /\.ts$/i,
                loader: "ts-loader",
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/i,
                loader: require.resolve("vue-loader"),
                include: SRC_DIR,
                options: {
                    compilerOptions: {
                        modules: [VuetifyProgressiveModule]
                    },
                    loaders: {
                        i18n: "@kazupon/vue-i18n-loader"
                    }
                }
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                include: SRC_DIR,
                loader: require.resolve("babel-loader"),
                options: {
                    cacheDirectory: true,
                    sourceMap: !isDev,
                    envName: !isDev ? "production" : "development"
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                   
                  "vue-style-loader",
                  !isDev? MiniCssExtractPlugin.loader:
                    "style-loader",
                  "css-loader",
                  {
                    loader: require.resolve("postcss-loader"),
                    /*options: {
                        ident: "postcss",
                        plugins: () => [
                            require("postcss-focus"), 
                            require("postcss-flexbugs-fixes"), //eslint-disable-line
                            autoprefixer({
                                browsers: [
                                    ">1%",
                                    "last 4 versions",
                                    "Firefox ESR",
                                    "not ie < 9" // React doesn't support IE8 anyway
                                ],
                                flexbox: "no-2009"
                            })
                        ]
                    }*/
                },
                  {
                    loader: "sass-loader",
                    options: {
                      webpackImporter: true,
                      sourceMap: isDev,
                    //  implementation: require("sass"),
                      sassOptions: {
                        outputStyle: "compressed",
                      },
                    },
                  },
                ],
              },
            {
                test: /\.css$/i,
                use: [
                    !isDev? MiniCssExtractPlugin.loader:
                    "style-loader", {
                        loader: require.resolve("css-loader"),
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                       /* options: {
                            ident: "postcss",
                            plugins: () => [
                                require("postcss-flexbugs-fixes"), //eslint-disable-line
                                autoprefixer({
                                    browsers: [
                                        ">1%",
                                        "last 4 versions",
                                        "Firefox ESR",
                                        "not ie < 9" // React doesn't support IE8 anyway
                                    ],
                                    flexbox: "no-2009"
                                })
                            ]
                        }*/
                    }
                ],
                include: /\.module\.css$/
            },
            {
                test: /\.css$/,
                use: [
                   !isDev? MiniCssExtractPlugin.loader:
                    "style-loader",
                    {
                        loader: require.resolve("css-loader"),
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: require.resolve("postcss-loader"),
                        /*options: {
                            ident: "postcss",
                            plugins: () => [
                                require("postcss-flexbugs-fixes"), //eslint-disable-line
                                autoprefixer({
                                    browsers: [
                                        ">1%",
                                        "last 4 versions",
                                        "Firefox ESR",
                                        "not ie < 9" // React doesn't support IE8 anyway
                                    ],
                                    flexbox: "no-2009"
                                }),
                             //   require('cssnano')
                            ]
                        }*/
                    }
                ],
                exclude: /\.module\.css$/
            },
            {
                test: /\.styl(us)$/,
                use: [
                    
                    "vue-style-loader",
                    !isDev? MiniCssExtractPlugin.loader:
                    "style-loader",
                    "css-loader",
                    {
                        loader: "stylus-loader"
                    }
                ]
            },
            {
                test: /\.pug$/,
                oneOf: [
                    // this applies to `<template lang="pug">` in Vue components
                    {
                        resourceQuery: /^\?vue/,
                        use: ["pug-plain-loader"]
                    },
                    // this applies to pug imports inside JavaScript
                    {
                        use: ["raw-loader", "pug-plain-loader"]
                    }
                ]
            },
            {
                test: /\.(bmp|gif|jpe?g|png|svg)$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: !isDev ? "assets/images/[name].[contenthash].[ext]" : "assets/images/[name].[ext]"
                }
            },
            {
                test: /\.(woff|woff2|otf|ttf|eot)$/,
                loader: require.resolve("file-loader"),
                options: {
                    limit: 10000,
                    name: !isDev ? "assets/fonts/[name].[contenthash].[ext]" : "assets/fonts/[name].[ext]" 
                }
            }
        ]
    },

    optimization: {
        minimize: !isDev,
        minimizer: [new CssMinimizerPlugin()],
        // Once your build outputs multiple chunks, this option will ensure they share the webpack runtime
        // instead of having their own. This also helps with long-term caching, since the chunks will only
        // change when actual code changes, not the webpack runtime.
        runtimeChunk: {
          name: 'runtime',
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    },

    devtool: isDev ? 'cheap-module-source-map' : 'source-map',

    plugins: [
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new VueLoaderPlugin(),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),
        new Dotenv({
            path: path.resolve(__dirname, ".env.vue-app"),
            systemvars: true
        }),
        new CleanWebpackPlugin(DIST),
        ...entries.map(
            entry =>
            new HtmlWebpackPlugin({
                title: "vue",
                favicon: "src/assets/favicons/favicon.ico",
                template: `${SRC_DIR}/index.html`,
                filename: "index.html",
                chunks: ["vendor", "index", entry.name]
            })
        ),
        new CopyWebpackPlugin([{
                from: path.resolve(__dirname, "src/assets"),
                to: path.resolve(__dirname, "public/assets"),
                toType: "dir"
            },
            {
                from: path.resolve(__dirname, "src/manifest.json"),
                to: path.resolve(__dirname, "public/manifest.json"),
                toType: "file"
            },
            {
                from: path.resolve(__dirname, "src/sw-precache.js"),
                to: path.resolve(__dirname, "public/sw-precache.js"),
                toType: "file"
            },
            {
                from: path.resolve(__dirname, "src/sitemap.xml"),
                to: path.resolve(__dirname, "public/sitemap.xml"),
                toType: "file"
            },
            {
                from: path.resolve(__dirname, "src/robots.txt"),
                to: path.resolve(__dirname, "public/robots.txt"),
                toType: "file"
            },
            {
                from: path.resolve(__dirname, "src/push.js"),
                to: path.resolve(__dirname, "public/push.js"),
                toType: "file"
            }
        ]),
     
        new LiveReloadPlugin({
            protocol: "http",
            appendScriptTag: true
        }),
        new InjectManifest({
            swSrc: "./src/push.js",
            swDest: "service-worker.js",
            exclude: [/\.map$/],
           // importWorkboxFrom: process.env.mode === "production" ? "cdn" : "local"
            //    maximumFileSizeToCacheInBytes: 7 * 1024 * 1024
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: isDev ? "[name].css" : "[name].[contenthash].css",
            chunkFilename: isDev ? "[id].css" : "[id].[contenthash].css",
        }),new PurgeCssPlugin({
            paths: glob.sync([
                './src/**/*.html',
                './src/**/*.js',
                './src/**/*.vue',
            ]),
            safelist: [/easy-autocomplete/,/snackbar/,/bottom-left/, /vue-tel-input/],
                  
        }),
        new CompressionPlugin({
            //    filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css)$'),
            threshold: 10240,
            exclude: /.map$/,
            minRatio: 0.8
        }),   
        
    ]
};
