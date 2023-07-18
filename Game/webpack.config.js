const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin =
    require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const Dotenv = require("dotenv-webpack");
const webpack = require('webpack');

module.exports = (env, options) => {
    // mode: "development",
    const isDevelopment = options.mode === "development";
    const mode = isDevelopment ? "development" : "production"
    return {
        mode: mode,
        entry: {
            main: path.resolve(__dirname, "./src/main.ts"),
        },
        output: {
            path: path.resolve(__dirname, "dist"),
            filename: "[name].bundle.js",
            clean: true,
            assetModuleFilename: (pathData) => {
                const relativePath = pathData.filename.replace("src/", "");
                return relativePath;
            },
            publicPath: "/game/",
        },

        devtool: "source-map",
        devServer: {
            static: {
                directory: path.resolve(__dirname, `dist`),
            },
            port: 3000,
            hot: true,
            compress: true,
            historyApiFallback: true,
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/,
                },
                // {
                //     test: /\.(png)$/i,
                //     type: "asset/resource",
                // },
                // {
                //     test: /\.ttf$/,
                //     type: "asset/inline",
                // },
                {
                    test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/i,
                    type: "asset/resource",
                },
                {
                    test: /\.(css)$/,
                    use: [
                        {
                            loader: "style-loader",
                            options: {
                                insert: "head",
                                injectType: "singletonStyleTag",
                            },
                        },
                        "css-loader",
                    ],
                },
                {
                    test: /assets\/.*\.html$/i,
                    loader: 'html-loader',
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".js", ".json"],
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: "Lost in Code",
                template: "src/template.html",
                filename: "index.html",
            }),
            new Dotenv({
                path: isDevelopment ? './.env.development' : './.env'
            }),
            // new BundleAnalyzerPlugin()
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: "vendors",
                        chunks: "all",
                    },
                },
            },
        },
    };
};
