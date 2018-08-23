# 书写规则

- 代码每行最大可书写 120 个字符
- 当一个元素开始标记长度超过每行最大书写字符数时，需要分行书写：
  - 原生元素按 [HTML规范](./code-style.md) 来处理
  - 组件元素分行时，组件名单独一行，其他属性按下文中[属性顺序](#属性)缩进书写

## 一、属性顺序

本项目所有元素的属性按以下顺序书写：

1. `v-show`
2. `v-for :key`
3. `v-if`，`v-else-if`，`v-else`
4. `v-model`
5. 原生属性，如：`class`，`style`
6. 自定义属性，如：`data-id`，`closable`
7. `v-bind`
8. `v-on`
9. `ref`

## 二、Vue

### 2.1 组件基本元素

每一个 Vue 组件的根都必须包含以下三个标签：template, script, style，其顺序为：

```html
<template>
  <!-- 模板 -->
</template>
<script>
  // JS 逻辑
</script>
<style scoped>
  /* 私有样式 */
</style>
<style>
  /* 公有样式，默认无次标签。一般建议公有样式提取到外部单独文件中 */
</style>
```

### 2.2 vue 实例

每一个 vue 实例的属性书写顺序如下：

1. 标识名：`name`
2. 挂载元素：`el`
3. 组件：`componts`
4. 特性：`mixins`，`directives`，`render`
5. 外部数据：`props`
6. 数据：`data`
7. 过滤器：`filters`
8. 生命周期函数：`beforeCreate`, `created`, `beforeMount`, `mounted`, `beforeUpdate`, `updated`, `beforeDestroy`, `destroyed`
9. 计算属性：`computed`
10. 方法：`methods`

