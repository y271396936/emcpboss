<template>
  <span v-if="service" :class="['ms-service', service.status === 0 ? 'ms-gray' : '']">
    {{service.title}}
  </span>
</template>

<script>
  import { SERVICE_LIST } from '@/utils/constants'

  export default {
    name: 'ms-service',
    props: {
      serviceId: {
        type: Number
      }
    },
    computed: {
      service () {
        const index = SERVICE_LIST.findIndex(item => item.id === this.serviceId)
        return SERVICE_LIST[index]
      }
    }
  }
</script>
