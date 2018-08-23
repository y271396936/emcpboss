# 代码规范

## 一、命名规范

### 1.1 目录命名

- 开发人员只需操作 `src` 和 `static` 目录。
- `static` 目录为存放第三方不需要打包的资源或插件（以下称"第三方独立资源"），每一个第三方独立资源都需要单独设立一个目录，并且目录名保持其原有格式和规范。
- `src` 目录下除 `VueJs` 自有目录外，其他的目录必须遵循以下规范：
  - 组成目录的__单词数量__尽量控制__<3__个，单词过长尽量简写或更换较短的单词
  - 所有目录必须由小写的单词组成，多个单词间使用下划线隔开；如：`crm_system`
  - __同类资源、工具__的目录必须是单词复数形式；如：`filters` 用于存放数据过滤器
  - __功能模块__目录必须是单词单数形式；如：`components/crm_system` 用于存放 CRM 系统模块的组件

### 1.2 文件命名

- Vue 组件必须是以大写开头的驼峰命名；如 `HighSea.vue`
- 除 Vue 组件以外的所有文件，必须是由小写字母或单词组成，多个单词间使用中划线隔开；如 `logo-small.png`，`response-parse.js`

## 二、CSS 规范

### 2.1 强制

- 使用类选择器，放弃ID选择器。ID在一个页面中的唯一性导致了如果以ID为选择器来写CSS，就无法重用。

- 禁止把样式写在行内。

- 使用__中划线__作为分隔符和扩展符。如：

  ```css
  .logo_bar { ... }  /* 反对 */
  .logo-bar { ... }  /* 推荐 */
  ```

- 使用__语义化__的__小写__单词或字母对类命名。

  ````css
  /* 反对：未语义化，需要看到具体颜色才知道是什么，加大了理解难度 */
  .green2 { ... }
  /* 反对：使用了驼峰命名 */
  .lightGreen { ... }

  /* 推荐：偏向语义化*/
  /* 主绿色 */
  .green { ... }
  /* 亮绿色 */
  .light-green { ... }
  /* 次要绿色 */
  .minor-green { ... }
  ````

- 省略值为零时的单位，去掉小数点前的零。如：

  ```css
  .box { margin: 0px 10px; }  /* 反对 */

  /* 推荐 */
  .box {
    margin: 0 10px;
    font-size: .8em;
  }
  ```

- 引号：省略 url 引用中的引号，其他地方使用单引号。如：

  ```css
  .box { background: url(../bg.png); }
  .box:after { content: '.'; }
  ```

- 颜色：除非需要透明度而使用 rgba，否则都使用 16进制表示。如：

  ```css
  .box {
    color: #f00;
    background: rgba(0, 0, 0, .5);
  }
  ```

- 私有在前，标准在后。如：

  ```css
  .box {
    -webkit-box-shadow: 0 0 0 #000;
    -moz-box-shadow: 0 0 0 #000;
    box-shadow: 0 0 0 #000;
  }
  ```

- 使用约定俗称的缩写，或者尽量不失语义的缩写。如：

  ```css
  .mt5 { margin-top: 5px; }   /* 推荐 */
  .mt5 { margin-left: 5px; }  /* 反对：加大理解难度 */
  .abc { color: #0ff; }       /* 反对：意义不明 */
  ```

- 值缩写：某一类属性值均有设置，或者超过半数需要设置时，必须使用缩写形式。如：

  ```css
  /* 反对 */
  .box {
    margin-top: 5px;
    margin-left: 10px;
    margin-right: 12px;
  }

  /* 推荐 */
  .box { margin: 5px 12px 0 10px; }
  ```

- 选择器合并：多个选择器的属性一致时，必须合并这些选择器。如：

  ```css
  /* 反对 */
  .header { margin: 10px; }
  .footer { margin: 10px; }
  .box { margin: 10px; }

  /* 推荐 */
  .header, .footer, .box { margin: 10px; }
  ```

### 2.2 建议

- 属性书写顺序：
  - 位置(position, top, right, z-index, display, float等)
  - 大小(width, height, padding, margin)
  - 文字系列(font, line-height, letter-spacing, color- text-align等)
  - 背景(background, border等)
  - 其他(animation, transition等)

## 三、HTML 规范

- 多个块元素必须分行写；行内元素允许在同一行：

  ```html
  <!-- 反对 -->
  <div><p> 段落块 </p></div>

  <!-- 推荐 -->
  <div>
    <p> <span>段落快</span> </p>
  </div>
  ```

- 同一行的行内元素不应该超过2层：

  ```html
  <!-- 反对 -->
  <p>一行<span><storng>嵌套超过2层</storng></span></p>

  <!-- 推荐 -->
  <p>
    一行<span><storng>嵌套2层</storng></span>
  </p>
  ```

- 元素的属性应该优先写在元素定义的同行；属性数量太多时，允许分行书写，但是必须悬挂对齐：

  ```html
  <!-- 反对 -->
  <div
       class="oppose"
       style="padding: 8px;">
    属性和元素分离
    <span class="oppose" data-id="1" data-title="多属性" data-account-id="12222"
      data-description="无对齐">
      多属性分行对齐不对
    </span>
  </div>

  <!-- 推荐 -->
  <div class="recommend" style="color: green;">
    <span class="section" data-id="1" data-title="多属性" data-account-id="12222"
          data-description="分行悬挂对齐">
      something...
    </p>
  </div>
  ```

- 层次分明，结构简单优先：

  ```html
  <!-- 反对 -->
  <div class="table">
    <table>
      <tr class="header">
        <td><span>A</span></td>
      </tr>
      <tr>
        <td><span>a</span></td>
      </tr>
      <tr class="footer">
        <td>总计：</td>
      </tr>
    </table>
  </div>

  <!-- 推荐 -->
  <table>
    <thead>
      <tr>
        <th>A</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>a</td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <td>总计：</td>
      </tr>
    </tfoot>
  </table>
  ```

- 语义化优先

  ```html
  <!-- 反对 -->
  <div class="section">
    <p>
      abc...
    </p>
  </div>

  <!-- 推荐 -->
  <section>
    abc...
  </section>
  ```

## 四、JS 规范

### 4.1 标准规范

- 使用 ES6 语法，依照 [ES6 代码标准规范](https://github.com/yuche/javascript)。
- 所有变量必须先申明后使用，优先使用 `const > let` 申明。
- 变量及函数采用小写开头的驼峰命名（如：camelCaseNames）。
- 常量使用以下底线分割单词的大写形式命名（如：UPPER_CASE），声明常量必须使用 `const`。

### 4.2 WebStorm 自动代码格式设置

1. 设置 WebStorm 的 JavaScript 语言版本支持 JSX 语法：

   - 打开 `File -> Settings -> Languages & Frameworks -> JavaScript`
   - 设置 `JavaScript language version` 为 `React JSX`
2. 设置 WebStorm 的 JavaScript 语言风格：

   - 打开 `File -> Settings -> Editor -> Code Style -> JavaScript`
   - 设置 `Scheme`，点击右侧的 `Set from... `，选择 `Predefined Style -> JavaScript Standard Style`
   - 设置 `Punctuation` 中的 `Trailing comma:` 为 `Remove`


