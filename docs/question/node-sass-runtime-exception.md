# Node-sass 运行时异常处理

在安装或使用 node-sass 时，报如下错误：

```shell
Error: ENOENT: no such file or directory, scandir '{PATH}\node-sass\vendor'
    at Error (native)
    at Object.fs.readdirSync (fs.js:856:18)
    ...
```

或者以下错误：

```shell
Run `npm rebuild node-sass` to build the binding for your current environment.
    at module.exports ({PATH}\node_modules\node-sass\lib\binding.js:
15:13)
    at Object.<anonymous> ({PATH}\node_modules\node-sass\lib\index.j
s:14:35)
    at Module._compile (module.js:435:26)
    ...
```

解决办法为运行下面的命令：

``` bash
npm rebuild node-sass
```
