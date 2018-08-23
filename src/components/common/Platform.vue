<template>
  <span v-if="platform" :class="['ms-platform', platform.status === 0 ? 'ms-gray' : '']">
    {{platform.title}}
  </span>
</template>

<script>
  import { PLATFORM_LIST } from '@/utils/constants'

  export default {
    name: 'ms-platform',
    props: {
      platformId: {
        type: Number
      }
    },
    computed: {
      platform () {
        const index = PLATFORM_LIST.findIndex(item => item.id === this.platformId)
        return PLATFORM_LIST[index]
      }
    }
  }
</script>
