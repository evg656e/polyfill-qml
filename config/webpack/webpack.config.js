const path = require('path');

module.exports = {
    mode: 'development',
    devtool: '',
    output: {
        libraryTarget: 'this'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.resolve(__dirname, '../ts/es5.tsconfig.json')
                        }
                    }
                ]
            }
        ]
    }
};
