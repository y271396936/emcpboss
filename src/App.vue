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
  import MsLogin from '@/components/common/Login'
  import MsContainer from '@/components/common/layout/Container'
  import UserApi from '@/api/system/user'
  import { userAction } from '@/store/action-names'
  import RouterUtils from '@/router/utils'
  import http from '@/utils/http'

  export default {
    name: 'app',
    components: {
      MsContainer,
      MsLogin
    },
    data () {
      return {
        ready: false,
        websock: null
      }
    },
    created () {
      // 获取登陆信息
      UserApi.getInfo(response => {
        let status = response.status || 0
        let body = response.data || {}

        if (status === 200 || status === 204) {
          this.$store.dispatch(userAction.login, {user: body})

          if (!body.sso) {
            this.connect()
          }
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
          const type = this.$store.state.user.info.type === 'customer'
          return type && this.$store.getters.isLogin
        }
      }
    },
    methods: {
      connect () {
        const wsuri = 'ws://emcp.qudao51.com/websocket'
        this.websock = new WebSocket(wsuri)
        this.initWebSocket()
      },
      initWebSocket () {
        var self1 = this
        let heartCheck = {
          timeout: 60000,
          timeoutObj: null,
          serverTimeoutObj: null,
          reset: function () {
            var self = this
            clearTimeout(self.timeoutObj)
            clearTimeout(self.serverTimeoutObj)
            self.start()
          },
          start: function () {
            var self = this
            this.timeoutObj = setTimeout(function () {
              http.get('rest/support/reset').then(response => {
                let status = response.status || 0
                if (status === 200 || status === 204) {
                  self1.websock.send('心跳检测')
                } else {
                  window.location.reload()
                }
              }).catch(trace => window.location.reload())
              self.serverTimeoutObj = setTimeout(function () {
                self1.websock.close()
              }, self.timeout)
            }, this.timeout)
          }
        }
        this.websock.onopen = function () {
          heartCheck.start()
        }
        this.websock.onmessage = function (event) {
          heartCheck.reset()
        }
        window.onbeforeunload = function () {
          self1.websock.close()
        }
      }
    }
  }
</script>

<style lang="scss">
  @import "assets/styles/env";

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
