<template>
  <div class="menu">
    <div v-if="currentNav === 'main'" class="menu-main">
      <ms-boss-control-panel-menu v-if="userType === 'boss'"/>
      <ms-customer-control-panel-menu v-else-if="userType === 'customer'"/>
    </div>
    <el-menu v-else :collapse="false" :unique-opened="true" :router="true">
      <template v-for="(menu, menuIndex) in menus">
        <el-submenu v-if="menu.sons && menu.sons.length > 0" :index="'m' + menuIndex" v-show="menu.flag">
          <template slot="title">
            <!--<icon :name="menu.icon"/>-->
            <span slot="title">{{ menu.title }}</span>
          </template>
            <template v-for="(subMenu, subIndex) in menu.sons" v-if="menu.isShow === true">
              <el-submenu  :index="'s' + subIndex" v-show="subMenu.flag">
                <template slot="title">
                  <!--<icon :name="subMenu.icon"/>-->
                  <span slot="title">{{ subMenu.title }}</span>
                </template>
                <el-menu-item v-for="(sub, index) in subMenu.sons" :key="index" :index="sub.path" v-show="sub.flag">
                  <template slot="title">
                    <!--<icon :name="sub.icon"/>-->
                    <span slot="title">{{ sub.title }}</span>
                  </template>
                </el-menu-item>
              </el-submenu>
            </template>
            <el-menu-item v-if="menu.isShow === undefined" v-for="(subMenu, subIndex) in menu.sons" :key="subIndex" :index="subMenu.path" v-show="subMenu.flag">
              <template slot="title">
                <!--<icon :name="subMenu.icon"/>-->
                <span slot="title">{{ subMenu.title }}</span>
              </template>
            </el-menu-item>
        </el-submenu>
        <el-menu-item v-else  :index="menu.path" v-show="menu.flag">
          <!--<icon :name="menu.icon"/>-->
          <span slot="title">{{ menu.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import MsBossControlPanelMenu from './boss/ControlPanelMenu'
  import MsCustomerControlPanelMenu from './customer/ControlPanelMenu'

  export default {
    name: 'menu',
    components: {
      MsBossControlPanelMenu,
      MsCustomerControlPanelMenu
    },
    props: {
      menus: {
        required: true,
        type: Array
      },
      currentNav: {
        type: String,
        default: ''
      },
      currentMenu: {
        type: String,
        default: ''
      }
    },
    computed: {
      userType () {
        const userInfo = this.$store.state.user.info || {}
        return userInfo['type'] || ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .menu {
    &, &-main, .el-menu {
      float: left;
      width: 100%;
      height: 100%;
      border-right: 0;
    }
  }
</style>
<style lang="scss">
  @import "../../../assets/styles/env";

  .menu {
    .el-menu {
      background-color: $color-tint;
    }
    .el-submenu .el-menu {
      background: $color-light;
    }
  }
</style>
