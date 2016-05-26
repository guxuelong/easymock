var path = require('path');
var HtmlwebpackPlugin = require('html-webpack-plugin');

var HelloWorldPlugin = require('hello-world-plugin');
//定义了一些文件夹的路径
var ROOT_PATH = path.resolve(__dirname);
var APP_PATH = path.resolve(ROOT_PATH, 'dev');
var BUILD_PATH = path.resolve(ROOT_PATH, 'dist');
module.exports = {
  //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
  entry: APP_PATH,
  //输出的文件名 合并以后的js会命名为bundle.js
  output: {
    path: BUILD_PATH,
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
        test: /\.(js|jsx)?$/,
        loader: 'babel',
        exclude: /node_modules/
      },

    ]
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    port: 3000
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    alias: {
      src: path.join(process.cwd(), '/src/')
    }
  },
  //添加我们的插件 会自动生成一个html文件
  plugins: [
    new HtmlwebpackPlugin({
      title: 'EASY MOCK'
    }),
    new HelloWorldPlugin({options: true})
  ]
};