<template>
  <div>
    <div>
      <el-button class="go-home" type="primary" size="medium" @click="goHome">主页</el-button>
    </div>
    <!--<div>-->
      <!--<el-button class="go-home" type="primary" size="medium" @click="goOldSystem">回到旧版</el-button>-->
    <!--</div>-->
  </div>
</template>

<script>
  export default {
    name: 'control-panel-menu',
    methods: {
      goHome () {
        let url = window.location.href
        location.href = url.split('#')[0]
      },
      goOldSystem () {
        location.href = '/boss/main/index'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .go-home {
    margin: 20px 0 0 20px;
  }
</style>
