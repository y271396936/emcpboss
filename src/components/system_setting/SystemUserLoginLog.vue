<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>登录历史</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-table v-loading="table.loading" size="small" stripe border :data="table.list" :fit="true">
      <el-table-column prop="loginTime" label="登录时间" min-width="140" fixed></el-table-column>
      <el-table-column prop="loginIp" label="登录IP" min-width="150"></el-table-column>
      <el-table-column prop="address" label="地址详情" min-width="200"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import Api from '@/api/system/system-user'

  export default {
    data () {
      return {
        table: {
          loading: true,
          list: []
        }
      }
    },
    created () {
      this.table.list = []
      this.requestList()
    },
    methods: {
      requestList () {
        this.table.loading = true
        Api.listLog(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list = body
          } else {
            this.table.list = []
            this.$message.error(body.error || '数据获取失败')
          }
          this.table.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
