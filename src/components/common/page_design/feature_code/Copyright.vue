<template>
  <div class="copyright">
    <p>版权所有：xxx有限公司</p>
    <p>地址：XXX工业慧谷园8号楼 京ICP备88888888号-88 投资有风险 入市需谨慎</p>
  </div>
</template>

<script>
  export default {
    name: 'Copyright'
  }
</script>

<style lang="scss" scoped>
  .copyright {
    min-height: 30px;
    line-height: 1.5em;
    text-align: center;
    color: gray;

    p {
      margin: 0;
      font-size: 12px;
    }
  }
</style>
