<template>
  <div>
    <el-form
      v-if="undefined == userInfo.name || userInfo.name.length < 1"
      :inline="true"
      :model="formInline"
      class="demo-form-inline">
      <el-form-item label="用户名">
        <el-input v-model="formInline.user" placeholder="用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formInline.password" type="password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login()">登陆</el-button>
      </el-form-item>
    </el-form>
    <el-card v-else :model="userInfo" class="box-card">
      <div slot="header" class="clearfix">
        <span style="line-height: 36px;">{{ userInfo.name }}</span>
        <el-button style="float: right;" type="primary" @click="logout()">登出</el-button>
      </div>
    </el-card>
    <div>
      <el-button type="primary" @click="listLabels()">获得用户标签</el-button>
      <div>
        <el-tag
          v-for="tag in tags" :key="tag.id"
          :type="tag.type">
          {{ tag.title }}
        </el-tag>
      </div>
    </div>
  </div>
</template>
<script>
  import axios from 'axios'
  import Qs from 'qs'
  import ResponseParse from '@/utils/response-parse'

  // 启用全局 cookie
  axios.defaults.withCredentials = true

  let authorizationUrl = '/rest/boss/system/authorization'

  export default {
    data () {
      return {
        formInline: {
          user: '',
          password: ''
        },
        userInfo: {},
        tags: []
      }
    },
    created () {
      let $this = this

      axios.get(authorizationUrl)
        .then(response => {
          $this.userInfo = response.data
        })
        .catch(error => {
          if (error.response.status === 401) {
            return
          }

          $this.$message('获取登陆信息失败：' + (error.response.data['error'] || 'None'))
        })
    },
    methods: {
      login () {
        let $this = this
        if ($this.formInline.user.length < 5 || $this.formInline.password < 6) {
          $this.$message('用户名或者密码输入错误')
          return
        }

        let postData = Qs.stringify({
          loginAccount: $this.formInline.user,
          password: $this.formInline.password
        })
        axios.post(authorizationUrl, postData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(response => {
          $this.userInfo = response.data

          $this.$message('登陆成功')
        })
        .catch(error => {
          if (error.response.status === 401) {
            $this.$message('登陆失败：' + error.response.data['error'] || 'None')
          }
        })
      },
      logout () {
        let $this = this
        axios.delete(authorizationUrl)
          .then(response => {
            this.userInfo = {}

            $this.$message('登出成功')
          })
          .catch(error => {
            $this.$message('登出失败：' + error.response.data['error'] || 'None')
          })
      },
      listLabels () {
        let $this = this

        axios.get('/customer/system/rest-example/persons/1/labels')
          .then(response => {
            $this.tags = response.data
            ResponseParse.pagination(response.headers)
          })
          .catch(error => {
            $this.$message('获取失败：' + error.response.data['error'])
          })
      }
    }
  }
</script>
<style>
  span.el-tag {
    margin-left: 5px;
  }
</style>
