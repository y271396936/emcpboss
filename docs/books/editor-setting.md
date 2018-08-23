# 编辑器设置

## .editorconfig 文件

项目根目录下的 `.editorconfig` 文件定义了编辑器的一些基本配置，如行长度、分行符、缩进风格、缩进长度等

- 该文件 **严禁修改** ！

## WebStorm 设置

1. 设置 WebStorm 的行结束符：

   `File -> Settings -> Editor -> Code Style` 中，设置右侧 `Line separator (for new files):`，选择 `Unix and OS X(\n)`

2. 安装 .editorconfig 支援插件

   - `File -> Settings -> Plugins` 中，点击右侧 `Browse repositories...` 按钮，在搜索框中输入关键词 `editorconfig` ，并点击出现的结果，在其右侧点击 `Install` 按钮进行安装，安装完毕后重启IDE
   - `File -> Settings -> Editor -> Code Style` 中，右侧 `EditorConfig` 中勾选 `Enable EditorConfig support`
   - **禁止** 点击 `Export` 按钮覆写项目的 `.editorconfig` 文件

