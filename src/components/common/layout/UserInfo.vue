<template>
  <div class="user-info">
    <div v-if="userInfo.sso" class="sso-bar">
      <icon name="exclamation-sign"/>
      您正在通过 SSO 方式访问后台，请谨慎操作。
      <code v-if="userInfo.info && userInfo.info.status === -1" class="ms-caution">已离职</code>
      <a href="javascript:" @click="logout()">退出登陆</a>
    </div>
    <div class="tool">
      <template v-if="userInfo.type === 'boss'">
        <div>
          <div class="tool-item" @click="cdnRefreshVisible = true">
            <icon name="asterisk"/>
          </div>
          <div class="tool-item" @click="chatToggle()">
            <template v-if="chat.unread > 0">
              <icon name="commenting"/>
            </template>
            <template v-else>
              <icon name="commenting-o"/>
            </template>
          </div>
        </div>

        <ms-cdn-refresh :visible.sync="cdnRefreshVisible"/>
      </template>
      <!--<template v-else-if="userInfo.type === 'customer'">-->
        <!--<div class="tool-item">-->
          <!--<template v-if="notice.unread > 0">-->
            <!--<icon name="bell"/>-->
          <!--</template>-->
          <!--<template v-else>-->
            <!--<icon name="bell-o"/>-->
          <!--</template>-->
        <!--</div>-->
        <!--<div class="tool-item" @click="chatToggle()">-->
          <!--<template v-if="chat.unread > 0">-->
            <!--<icon name="commenting"/>-->
          <!--</template>-->
          <!--<template v-else>-->
            <!--<icon name="commenting-o"/>-->
          <!--</template>-->
        <!--</div>-->
      <!--</template>-->
    </div>
    <template v-if="userInfo.type === 'boss'">
      <div class="avatar">
        <el-tooltip effect="light" placement="right">
          <div slot="content">
            <ul>
              <li><strong>{{ userInfo.name }}</strong>，您好</li>
              <li>{{ userInfo.roleName }}</li>
              <li><a href="javascript:" @click="logout()">退出登陆</a></li>
            </ul>
          </div>
          <icon name="user" scale="1.5"/>
        </el-tooltip>
      </div>
    </template>
    <template v-if="userInfo.type === 'customer'">
      <div class="avatar avatar-customer">
        <el-tooltip effect="light" placement="right">
          <div slot="content">
            <ul>
              <li><strong>{{ userInfo.name }}</strong>，您好</li>
              <li>{{ userInfo.roleName }}</li>
              <li><a href="javascript:" @click="logout()">退出登陆</a></li>
            </ul>
          </div>

          <img v-if="userInfo.info.thumbnail !== undefined" :src="userInfo.info.thumbnail" alt="头像"/>
          <icon v-else name="user" scale="1.5"/>
        </el-tooltip>
      </div>
    </template>
  </div>
</template>

<script>
  import MsCdnRefresh from './boss/CdnRefresh'
  import UserApi from '@/api/system/user'

  export default {
    name: 'user-info',
    components: {
      MsCdnRefresh
    },
    data () {
      return {
        cdnRefreshVisible: false,
        chat: {
          unread: 0,
          history: [],
          input: ''
        },
        notice: {
          unread: 0
        }
      }
    },
    created () {
      // todo 获取提醒

      // todo 获取消息
    },
    computed: {
      userInfo () {
        return this.$store.state.user.info || {}
      }
    },
    methods: {
      chatToggle () {
        // this.$emit('chat-toggle')
      },
      logout () {
        UserApi.logout((response) => {
          let status = response.status || 0
          let body = response.data || {}

          if (status === 200 || status === 204) {
            this.$store.dispatch('logout')
          } else {
            this.$message.error(body.error || '登出失败')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  // bar 中的图标样式
  %bar-icon-radius {
    width: 45px;
    height: 45px;
    line-height: 42px;

    border: none;
    border-radius: 50%;
    cursor: pointer;
    &:hover {
      background-color: rgba(9, 30, 66, 0.42);
    }
    &:active {
      background-color: $color-primary-active;
    }
  }
  // bar 中的图标样式
  %customer-icon-radius {
    width: 60px;
    height: 60px;
    overflow: hidden;
    line-height: 60px;

    border: none;
    border-radius: 5%;
    cursor: pointer;
    &:hover {
      background-color: rgba(9, 30, 66, 0.42);
    }
    &:active {
      background-color: $color-primary-active;
    }
  }

  ul, li {
    @extend %no-crack;
    list-style: none;
  }

  .user-info {
    .sso-bar {
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, .5);
      padding: 0;
      margin: 0;
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1060;
    }
    .tool {
      width: 100%;
      height: 18px;
      line-height: 18px;
      color: $color-white;
      padding-bottom: 5px;
      &-item {
        display: inline-block;
        margin: 0 5px;
        cursor: pointer;
      }
      &-item:first-child {
        margin-left: 0;
      }
      &-item:last-child {
        margin-right: 0;
      }
    }
    .avatar {
      @extend %bar-icon-radius;
      margin: 0 auto;
      background: $color-primary-tint;
      color: $color-primary;
      &:hover {
        background-color: rgba(255, 255, 255, 0.22);
      }
    }
    .avatar-customer {
      @extend %customer-icon-radius;
      margin: 0 auto;
      background: $color-primary-tint;
      color: $color-primary;
      img {
        width:100%;
      }
      &:hover {
        background-color: rgba(255, 255, 255, 0.22);
      }
    }

    svg {
      vertical-align: middle;
    }
  }

  // 隐藏菜单的状态
  .nav-collapsed {
    .bar-bottom-container {
      .tool {
        color: $color-secondary;
      }
      .avatar {
        background: $color-secondary;
        color: $color-tint;
        &:hover {
          background-color: rgba(0, 0, 0, 0.12);
        }
      }
    }
  }
</style>
