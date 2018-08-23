# SEARCH_CONDITION Argument

| 参数          | 说明      | 类型      | 可选值                       | 默认值   |
| ----------- | ------- | ------- | ------------------------- | ----- |
| name        | 表单参数，必填 | string  | -                         | -     |
| title       | 表单项名，必填 | string  | -                         | -     |
| type        | 组件类型，必填 | string  | text/select/date/datetime | -     |
| placeholder | 占位符     | string  | -                         | -     |
| value       | 搜索默认值   | string  | -                         | -     |
| visible     | 是否默认显示  | boolean | -                         | false |
| config      | 扩展配置    | object  |                           |       |

## SELECT Config Argument

| 参数     | 说明                          | 类型     | 可选值  | 默认值  |
| ------ | --------------------------- | ------ | ---- | ---- |
| list   | `option` 列表                 | array  | -    | -    |
| remote | 远程搜索。通过关键词从服务器搜索数据，在列表中进行查找 | object | -    | -    |

### Option Argument

下拉列表 `list` 是一个有多个 `option` 组成的数组，每个 `option` 含有以下参数：

| 参数    | 说明        | 类型     | 可选值  | 默认值  |
| ----- | --------- | ------ | ---- | ---- |
| value | option 值  | mixed  | -    | -    |
| label | option 文本 | string | -    | -    |



### 远程搜索

| 参数      | 说明                                       | 类型              | 可选值  | 默认值   |
| ------- | ---------------------------------------- | --------------- | ---- | ----- |
| enabled | 是否启用远程搜索                                 | boolean         | -    | false |
| loading | 是否正在远程请求数据                               | boolean         | -    | false |
| method  | 远程搜索的方法。每当搜索框中数据改变时，会调用该方法，并传递当前搜索框的值作为第一个参数。 | function(query) | -    |       |

注意：在每次远程搜索执行完毕后，均需要将所有获得的数据，转换成一个合法的`option` 列表，否则数据显示可能会存在异常。

