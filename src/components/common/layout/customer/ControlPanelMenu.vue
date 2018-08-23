<template>
  <div class="main">
    <div class="bar-bottom-container">
      <div style="width:100%;height:100px;background:#003585;"></div>
      <div style="margin-top: -50px">
        <ms-user-info @chat-toggle="rightAsideToggle"/>
      </div>
      <div style="margin:5px 0 ">{{this.$store.state.user.info.name}}</div>
      <!--<div>优币：2000</div>-->
    </div>
    <el-menu
      background-color="#2c60b7"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="true">
      <template v-for="(item,Findex) in menus">
        <!--只有一级菜单-->
        <el-menu-item :index="item.path" v-if="!item.sons" :key="Findex">
          <icon :name="item.icon"></icon>
          <span slot="title" style="margin-left: 10px">{{item.title}}</span>
        </el-menu-item>
        <!--如果有二级菜单-->
        <el-submenu :index="item.path" v-else-if="item.sons">
          <template slot="title">
            <icon :name="item.icon"></icon>
            <span slot="title" style="margin-left: 10px">{{item.title}}</span>
          </template>
          <template v-for="(son,Sindex) in item.sons">
            <!--如果只有二级菜单-->
            <el-menu-item :index="son.path" :key="Sindex" v-if="!son.sons">
              <icon :name="son.icon"></icon>
              <span slot="title">{{son.title}}</span>
            </el-menu-item>
            <!--如果有三级菜单-->
            <el-submenu :index="son.path" v-else-if="son.sons">
              <template slot="title">
                <icon :name="son.icon"></icon>
                <span slot="title">{{son.title}}</span>
              </template>
              <el-menu-item :index="grandson.path" v-for="(grandson,Gindex) in son.sons" :key="Gindex">
                <icon :name="grandson.icon"></icon>
                <span slot="title">{{grandson.title}}</span>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
  import MsUserInfo from '../UserInfo'
  import Api from '@/api/customer/feedback'
  import MENUS from '@/utils/menus/customer'
  export default {
    name: 'control-panel-menu',
    components: {
      MsUserInfo
    },
    data () {
      return {
        menus: MENUS.menus
      }
    },
    methods: {
      requestList () {
        Api.start(response => {
          let status = response.status || 0
          let body = response.data.map.list || []
          if (status === 200 || status === 204) {
            body.forEach(item => {
              if (item.readStatus === 0) {
                this.$store.commit('increment')
              }
            })
          }
        })
      },
      rightAsideToggle () {
        // 原聊天框不可见，且菜单可见，则触发 fence 点击事件，收缩菜单
        if (!this.rightAsideVisible && this.menuVisible) {
          this.clickFence()
        }
        this.rightAsideVisible = !this.rightAsideVisible
      },
      mouseEnter (index) {
        this.hover = index
      },
      mouseLeave () {
        this.hover = -1
      },
      cardStyle (index) {
        if (this.hover === index) {
          return {
            backgroundColor: this.cards[index].color,
            color: '#FFFFFF',
            cursor: 'pointer'
          }
        } else {
          return {
            color: this.cards[index].color
          }
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .el-menu {
    border-right:none;
    li {
      border-bottom:1px solid #003583;
      span {
        padding-left: 10px;
      }
    }
  }
</style>
<style lang="scss" scoped>
  .bar-bottom-container{
    width: 100%;
    height:200px;
    text-align: center;
    color:#fff;
    font-size: 14px;
    border-bottom:1px solid #003583;
  }
  .main {
    min-width: 100px;
    height: 100%;
    /*background: #0748a6;*/
    background: #2c60b7;
    .card {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding: 0 20px;
      box-sizing: border-box;
      border-bottom:1px solid #003583;
      width: 100%;
      height: 50px;
      line-height: 50px;
      color: #FFFFFF;
      font-size: 14px;
      position: relative;
      &:hover {
        background-color: #003585;
      }
      #my-circle {
        color: white;
        position: absolute;
        top: -8px;
        right: -8px;
        span {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
        }
      }
    }
  }
</style>
