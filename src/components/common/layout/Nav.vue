<template>
  <div class="nav">
    <ul v-if="!collapsed" class="nav-list">
      <li v-for="(nav, index) in navs" :key="index"
          :class="{active: currentNav === nav.menu}"
          @click="clickNav(nav)">
        <el-tooltip :content="nav.title" placement="right">
          <icon :name="nav.icon" scale="1.5"/>
        </el-tooltip>
      </li>
    </ul>
    <div v-else class="nav-collapse-menu">
      <ul v-if="currentNav === 'main'">
        <li @click="navBack()">
          <el-tooltip content="返回主导航" placement="right">
            <icon name="arrow-circle-left" scale="1.5"/>
          </el-tooltip>
        </li>
      </ul>
      <el-menu v-else :collapse="true" :router="true">
        <el-menu-item index="#" @click="navBack()">
          <icon name="arrow-circle-left" scale="1.5"/>
          <span slot="title">返回主导航</span>
        </el-menu-item>
        <template v-for="menu in menus">
          <template v-if="menu.sons && menu.sons.length > 0">
            <el-menu-item v-for="(subMenu, subIndex) in menu.sons" :key="subIndex" :index="subMenu.path">
              <icon :name="subMenu.icon"/>
              <span slot="title">{{ subMenu.title }}</span>
            </el-menu-item>
          </template>
          <el-menu-item v-else :index="menu.path">
            <icon :name="menu.icon"/>
            <span slot="title">{{ menu.title }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nav',
    props: {
      navs: {
        required: true,
        type: Array
      },
      menus: {
        required: true,
        type: Array
      },
      collapsed: {
        type: Boolean,
        default: false
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
    methods: {
      clickNav (nav) {
        this.$emit('click-nav', nav)
      },
      navBack () {
        this.$emit('nav-back')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  $width-bar: 58px;

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

  .nav {
    @extend %no-crack;

    min-height: 48px;

    ul.nav-list {
      li {
        margin: 5px 0;
        outline: none;
        text-align: center;
        vertical-align: middle;
        &.active {
          background-color: rgba(9, 30, 66, 0.42);
        }
        @extend %bar-icon-radius;
      }
    }

    div.nav-collapse-menu {
      @extend %no-crack;
      flex-basis: 350px;
      flex-wrap: wrap;
      .el-menu.el-menu--collapse, ul {
        background-color: $color-tint;
        width: $width-bar;
        /*width: 100%;*/
        border: 0;
        .el-menu-item, li {
          text-align: center;
          height: 38px;
          line-height: 38px;
        }
      }
    }

    svg {
      vertical-align: middle;
    }
  }

  // 隐藏菜单的状态
  .nav-collapsed {
    .nav {
      ul.nav-list {
        li {
          &:hover, &.active {
            color: $color-primary-active;
            background-color: rgba(9, 30, 66, 0.12);
          }
        }
      }
    }
  }
</style>
