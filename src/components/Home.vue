<template>
  <div>
    <ms-boss-home v-if="userType === 'boss'"/>
    <ms-customer-home v-else-if="userType === 'customer'"/>
  </div>
</template>
<script>
  import MsBossHome from './common/layout/boss/Home'
  import MsCustomerHome from './common/layout/customer/Home'

  export default {
    name: 'ms-home',
    components: {
      MsBossHome,
      MsCustomerHome
    },
    computed: {
      userType () {
        const userInfo = this.$store.state.user.info || {}
        return userInfo['type'] || ''
      }
    }
  }
</script>
