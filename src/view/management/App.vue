<template>
  <div id="app">
    <transition name="fade">
      <div v-show="!ready" class="el-loading-mask is-fullscreen app-loading">
        <div class="el-loading-spinner">
          <svg viewBox="25 25 50 50" class="circular">
            <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
          </svg>
        </div>
      </div>
    </transition>
    <ms-login v-if="!isLogin"/>
    <ms-container v-else/>
  </div>
</template>

<script>
  import MsLogin from '@/view/management/Login'
  import MsContainer from '@/components/common/layout/Container'
  import UserApi from '@/api/system/user'
  import { userAction } from '@/store/action-names'
  import RouterUtils from '@/router/utils'

  export default {
    name: 'managementApp',
    components: {
      MsContainer,
      MsLogin
    },
    data () {
      return {
        ready: false,
        type: false
      }
    },
    created () {
      // 获取登陆信息
      UserApi.getInfo(response => {
        let status = response.status || 0
        let body = response.data || {}

        if (status === 200 || status === 204) {
          this.$store.dispatch(userAction.login, {user: body})
          this.type = body.systemType === 'management'
        }

        // 动态加载路由表
        RouterUtils.autoload()

        setTimeout(() => {
          this.ready = true
        }, 1500)
      })
    },
    computed: {
      isLogin () {
        if (this.$store.state.user.info === null) {
          return false
        } else {
          return this.type && this.$store.getters.isLogin
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "./../../assets/styles/env";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 0;
    padding: 0;
    height: 100%;
    .app-loading {
      background-color: $color-white;
    }
  }
</style>
