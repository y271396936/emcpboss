<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
    <h2>Element UI</h2>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          icon component <br/>
          <icon name="language" scale="3"></icon>
        </div>
      </el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="4"><div class="grid-content bg-purple-light">This SASS Style.</div></el-col>
    </el-row>
    <h2>Example</h2>
    <ul>
      <li><router-link to="/example/jsx">JSX</router-link></li>
      <li><router-link to="/example/chart">Chart</router-link></li>
      <li><router-link to="/example/http">Http</router-link></li>
    </ul>
    <h2>Components</h2>
    <div>
      <p><code>&ltms-device :client-id="1"/&gt</code> <ms-device :client-id="1"/></p>
      <p><code>&ltms-device :client-id="2"/&gt</code> <ms-device :client-id="2"/></p>
      <p><code>&ltms-device :client-id="3"/&gt</code> <ms-device :client-id="3"/></p>
      <p><code>&ltms-device :client-id="4"/&gt</code> <ms-device :client-id="4"/></p>
    </div>
    <div>
      <p><code>&ltms-platform :platform-id="1"/&gt</code> <ms-platform :platform-id="1"/></p>
      <p><code>&ltms-platform :platform-id="2"/&gt</code> <ms-platform :platform-id="2"/></p>
      <p><code>&ltms-platform :platform-id="3"/&gt</code> <ms-platform :platform-id="3"/></p>
      <p><code>&ltms-platform :platform-id="4"/&gt</code> <ms-platform :platform-id="4"/></p>
      <p><code>&ltms-platform :platform-id="5"/&gt</code> <ms-platform :platform-id="5"/></p>
    </div>
    <!--<router-view></router-view>-->
  </div>
</template>

<script>
  import MsDevice from '@/components/common/Device.vue'
  import MsPlatform from '@/components/common/Platform.vue'

  export default {
    name: 'hello',
    components: {
      MsDevice,
      MsPlatform
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  text-align: center;
  border-radius: 4px;
  &:last-child {
    line-height: 36px;
    .bg-purple-light {
      background: #000;
      color: #fff;
    }
  }
}
.bg-purple {
  background: #d3dce6;
  &-dark {
    background: #99a9bf;
  }
  &-light {
    background: #e5e9f2;
  }
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
