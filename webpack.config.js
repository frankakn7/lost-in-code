const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname, './src/main.ts'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        clean: true,
        assetModuleFilename: 'assets/[name][ext]'
    },
    devtool: 'source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, `dist`)
        },
        port: 3000,
        hot: true,
        compress: true,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/, 
            },
            {
                test: /\.(png)$/i,
                type: 'asset/resource'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Sample Project',
            template: 'src/template.html',
            filename: 'index.html'
        }),
        // new BundleAnalyzerPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: "all"
                }
            }
        }
    }
};