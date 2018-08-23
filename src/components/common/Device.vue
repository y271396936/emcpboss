<template>
  <span class="ms-device">
    <span v-if="clientId === 0">综合</span>
    <span v-else-if="clientId === 1"><icon name="desktop"></icon></span>
    <span v-else-if="clientId === 2"><icon name="mobile"></icon></span>
    <span v-else-if="clientId === 3">APP</span>
    <span v-else class="ms-gray">未知</span>
  </span>
</template>

<script>
  export default {
    name: 'ms-device',
    props: {
      clientId: {
        type: Number
      }
    }
  }
</script>

<style scoped>

</style>
