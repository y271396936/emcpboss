<template>
  <div class="ms-pin-notify">
    <slot>&nbsp;</slot>
    <span class="pin" v-show="value"></span>
  </div>
</template>

<script>
  export default {
    name: 'ms-pin-notify',
    props: {
      value: {
        type: Boolean
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/env";

  .ms-pin-notify {
    position: relative;
    display: inline-block;
    .pin {
      position: absolute;
      display: inline-block;
      background: $color-caution;
      border-radius: 10px;
      top: 2px;
      right: -3px;
      padding: 4px 4px;
    }
  }
</style>
