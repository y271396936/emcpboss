# Support SASS

Usage

```
npm install node-sass sass-loader --save-dev
```

在 `build` 文件夹下的 `webpack.base.conf.js` 的 rules 里面添加配置

```
{
  test: /\.sass$/,
  loaders: ['style', 'css', 'sass']
}
```



