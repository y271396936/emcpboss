<template>
  <transition name="fade">
    <div :class="['container', menuVisible ? '' : 'nav-collapsed', rightAsideVisible ? '' : 'right-hide']">
      <ms-modify-password v-if="updatePassword"></ms-modify-password>
      <div class="aside" :class="{customerAside:isCustomer}">
        <!--如果是客户端，则不显示bar -->
        <div class="bar" v-if="userType != 'customer'">
          <router-link to="/home">
            <img class="logo" src="../../../assets/logo-small.png" alt="">
          </router-link>
          <div class="nav-container">
            <transition name="fade-in">
              <ms-nav
                :navs="navs"
                :menus="activeMenus"
                :collapsed="!barNavVisible"
                :current-nav="currentNav"
                :current-menu="currentMenu"
                @click-nav="clickNav"
                @nav-back="navBack"/>
            </transition>
          </div>
          <div class="bar-bottom-container">
            <ms-user-info @chat-toggle="rightAsideToggle"/>
          </div>
        </div>
        <div v-show="menuVisible" class="menu-container">
          <ms-menu
            :menus="activeMenus"
            :current-nav="currentNav"
            :current-menu="currentMenu"/>
        </div>
        <div class="fence">
          <div class="fence-pilot" @click="clickFence()"></div>
        </div>
      </div>
      <el-scrollbar class="main">
        <keep-alive>
          <transition name="fade-in">
            <router-view class="main-section"/>
          </transition>
        </keep-alive>
      </el-scrollbar>
    </div>
  </transition>
</template>

<script>
  import MsNav from './Nav'
  import MsMenu from './Menu'
  import MsUserInfo from './UserInfo'
  import MsModifyPassword from './ModifyPassword'
  // import MsChat from './Chat'
  import { permAction } from '@/store/action-names'
  import NavMenus from '@/utils/nav-menus'
  import moment from 'moment'

  export default {
    name: 'MsContainer',
    components: {
      MsNav,
      MsMenu,
      MsUserInfo,
      MsModifyPassword
      // MsChat
    },
    data () {
      return {
        isCustomer: false,
        currentNav: 'main',
        currentMenu: null,
        barNavVisible: true,
        menuVisible: true,
        rightAsideVisible: false,
        chat: {
          unread: 0,
          history: [],
          input: ''
        },
        notice: {
          unread: 0
        },
        updatePassword: false
      }
    },
    created () {
      if (this.userType === 'customer') {
        this.isCustomer = true
      }
      let formatTime = this.$store.state.user.info.lastPasswordTime
      let currentTime = moment().format('YYYY-MM-DD')
      let lastTime = moment(formatTime).format('YYYY-MM-DD')
      let days = this.DateDiff(lastTime, currentTime)
      if (days >= 10 && this.userType === 'customer') {
        this.updatePassword = true
      }
      // todo 获取菜单、权限
      this.$store.dispatch(permAction.save, {list: []})
    },
    computed: {
      userType () {
        const userInfo = this.$store.state.user.info || {}
        return userInfo['type'] || ''
      },
      navs () {
        let array = []
        let navigation = NavMenus.listNav() || []
        let listMenu = NavMenus.listMenu() || {}
        for (let key in listMenu) {
          listMenu[key].forEach(item => {
            if (item.flag) {
              for (let i in navigation) {
                if (navigation[i].menu === key) {
                  navigation[i].flag = true
                }
              }
            }
          })
        }
        for (let i in navigation) {
          if (navigation[i].flag === false) {
            navigation[i] = {}
          }
          if (JSON.stringify(navigation[i]) !== '{}') {
            array.push(navigation[i])
          }
        }
        return array
      },
      activeMenus () {
        const menus = NavMenus.listMenu()
        return menus[this.currentNav] || []
      }
    },
    methods: {
      DateDiff (sDate1, sDate2) {
        var aDate, oDate1, oDate2, iDays
        aDate = sDate1.split('-')
        oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        aDate = sDate2.split('-')
        oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0])
        iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
        return iDays
      },
      clickNav (nav) {
        this.currentNav = nav.menu

        if (!this.menuVisible && this.barNavVisible) {
          this.barNavVisible = false
        }
      },
      navBack () {
        this.barNavVisible = !this.barNavVisible
      },
      clickFence () {
        this.menuVisible = !this.menuVisible
        this.barNavVisible = this.menuVisible
      },
      rightAsideToggle () {
        // 原聊天框不可见，且菜单可见，则触发 fence 点击事件，收缩菜单
        if (!this.rightAsideVisible && this.menuVisible) {
          this.clickFence()
        }
        this.rightAsideVisible = !this.rightAsideVisible
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";
  // 宽度
  $width-aside: 250px;
  $width-fence: 12px;
  $width-bar: 58px;
  //$width-menu: $width-aside - $width-bar - $width-fence; // 200px
  //$width-right-aside: 320px;

  // 左侧动画效果
  $transition-aside: .25s ease-out;

  // bar 中的图标样式
  %bar-icon-radius {
    width: 40px;
    height: 40px;
    line-height: 40px;

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

  ul, li {
    @extend %no-crack;
    list-style: none;
  }

  .container {
    @extend %no-crack;
    height: 100%;
  }

  .aside {
    position: relative;
    float: left;
    height: 100%;
    width: $width-aside;
    transition: width $transition-aside;
    //position: absolute;
    box-sizing: border-box;
    .bar {
      @extend %no-crack;
      height: 100%;
      width: $width-bar;
      color: $color-white;
      background: $color-primary;
      float: left;
      display: flex;
      flex-flow: column nowrap;
      justify-content: flex-start;
      align-items: center;
      .logo {
        @extend %bar-icon-radius;
        margin: 12px 0 8px;
        background-color: $color-light;
        &:hover, &:active {
          background-color: $color-light;
        }
      }
      .nav-container {
        @extend %no-crack;

        min-height: 48px;
        flex: 1 1 auto;

        // 设置可溢出滚动，并隐藏滚动条
        overflow-y: auto;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .bar-bottom-container {
        flex: 0 0 auto;
        padding: 8px 0;
        text-align: center;
      }
    }
    .menu-container {
      // 设置可溢出滚动，并隐藏滚动条
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }

      //float: left;
      //width: $width-menu;
      height: 100%;
      background-color: $color-tint;
      border-right: 0;
    }
    svg {
      vertical-align: middle;
    }

    .fence {
      cursor: ew-resize;
      height: 100%;

      // position: absolute so that it will not effect the width of the navigation
      position: absolute;

      right: 6px;
      width: $width-fence;

      &:hover::before {
        background: $color-primary-active;
      }
      &:before {
        content: '';
        width: 2px;
        height: 100%;
        position: absolute;
        left: 5px;
      }
      &-pilot {
        position: relative;
        top: calc(50% - 18px);
        height: 36px;
        background: none;
        border: none;
        color: transparent;
        width: 24px;
        left: 0;
        cursor: pointer;

        &:focus {
          outline: none;
          box-shadow: 0 0 0 2px $color-primary-active;
        }
        &:before, &:after {
          content: '';
          background-color: $color-primary-active;
          width: 2px;
          border-radius: 16px;
          height: 8px;
          position: absolute;
          left: 13px;
          opacity: 0;
          transition: transform 200ms ease-in-out, opacity 300ms ease-in-out;
          transform: rotate(0deg);
        }
        &:before {
          top: 10px;
          transform-origin: 1px 7px;
        }
        &:after {
          top: 16px;
          transform-origin: 1px 1px;
        }

        &:hover, &:focus {
          &:before, &:after {
            opacity: 1;
          }
          &:before {
            transform: rotate(40deg);
          }
          &:after {
            transform: rotate(-40deg);
          }
        }
      }
      // 鼠标移动到栅栏上，显示指示标
      &:hover {
        .fence-pilot:before, .fence-pilot:after {
          opacity: 1;
        }
      }
    }

  }
  .customerAside {
    width:193px;
  }

  .main {
    height: 100%;
    box-sizing: border-box;
    //margin-left: $width-aside + 5px;
    //margin-left: 10px;
    //margin-right: $width-right-aside;
    padding-left: 10px;
    transition: margin $transition-aside;
    background: $color-white;
    @extend %font-size-normal;
    .main-section {
      padding: 10px 8px 10px 0;
    }
  }
  .customer {
    background: #f1f1f1;
  }

  .right-aside {
    height: 100%;
    //width: $width-right-aside;
    position: fixed;
    top: 0;
    right: 0;
    transition: right $transition-aside;
    background-color: $color-tint;
  }

  // 隐藏菜单的状态
  .nav-collapsed {
    .aside {
      width: $width-bar + $width-fence;
    }
    .bar {
      color: $color-secondary;
      background: $color-tint;
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
    .fence-pilot {
      &:hover, &:focus {
        &:before {
          transform: rotate(-40deg);
        }
        &:after {
          transform: rotate(40deg);
        }
      }
    }
    .main {
      margin-left: $width-bar + $width-fence + 5px;
    }
  }

  // 隐藏聊天
  .right-hide {
    .main {
      margin-right: 0;
    }
    .right-aside {
      //right: 0 - $width-right-aside;
    }
  }
</style>
<style lang="scss">
  @import "../../../assets/styles/env";

  .main {
    .el-scrollbar__wrap {
      // 不显示横向滚动条
      overflow-x: auto;
    }
    .el-scrollbar__bar {
      z-index: $z-index-container;
    }
  }
</style>
