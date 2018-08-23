<template>
  <div>
    <div class="box">
      <el-menu
        class="menu"
        :default-active="activeIndex"
        mode="horizontal"
        router
        text-color="#676363"
        active-text-color="#ffffff">
        <el-menu-item class="border-left" index="/screen/word">词性分析</el-menu-item>
        <el-menu-item class="border-right" index="/screen/province">地域分析</el-menu-item>
      </el-menu>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        activeName: 'first',
        activeIndex: '/screen/word'
      }
    }
  }
</script>
<style scoped>
  .main .main-section{
    padding:0;
  }
  .border-left {
    font-size: 19px;
    font-weight: 500;
    border-left:1px solid #f1f1f1;
    border-right:1px solid #f1f1f1;
  }
  .border-right {
    font-size: 19px;
    font-weight: 500;
    border-right:1px solid #f1f1f1;
  }
  .box {
    background: #f5f5f5;
    padding: 10px 0;
    font-size:32px;
    font-weight:600;
  }
  .el-menu--horizontal>.el-menu-item.is-active {
    background: #409EFF !important;
  }
</style>

