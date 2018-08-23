<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>透视表导入</el-breadcrumb-item>
        <el-breadcrumb-item>导入日志</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" fixed></el-table-column>
      <el-table-column prop="dataTypeId" label="数据类型" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.dataTypeId === 1">百度PC</span>
          <span v-else-if="scope.row.dataTypeId === 2">百度网盟</span>
          <span v-else-if="scope.row.dataTypeId === 3">360</span>
          <span v-else-if="scope.row.dataTypeId === 4">搜狗</span>
          <span v-else-if="scope.row.dataTypeId === 5">神马</span>
          <span v-else-if="scope.row.dataTypeId === 6">陌陌</span>
          <span v-else-if="scope.row.dataTypeId === 7">百度信息流</span>
          <span v-else-if="scope.row.dataTypeId === 8">360信息流</span>
          <span v-else-if="scope.row.dataTypeId === 9">今日头条信息流</span>
          <span v-else-if="scope.row.dataTypeId === 10">UC信息流</span>
          <span v-else-if="scope.row.dataTypeId === 11">搜狗银河</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="reportGenre" label="报告类型" min-width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.reportGenre === 1">关键词汇总报告</span>
          <span v-else-if="scope.row.reportGenre === 2">地域报告</span>
          <span v-else-if="scope.row.reportGenre === 3">分时报告</span>
          <span v-else-if="scope.row.reportGenre === 4">搜索词报告</span>
          <span v-else-if="scope.row.reportGenre === 5">操作系统报告</span>
          <span v-else-if="scope.row.reportGenre === 6">年龄报告</span>
          <span v-else-if="scope.row.reportGenre === 7">兴趣报告</span>
          <span v-else-if="scope.row.reportGenre === 8">性别报告</span>
          <span v-else-if="scope.row.reportGenre === 9">平台报告</span>
          <span v-else-if="scope.row.reportGenre === 10">网络报告</span>
          <span v-else-if="scope.row.reportGenre === 11">学历报告</span>
          <span v-else-if="scope.row.reportGenre === 12">头条位置报告</span>
          <span v-else-if="scope.row.reportGenre === 14">意图词报告</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="dataDay" label="数据日期" min-width="75"></el-table-column>
      <el-table-column prop="fileName" label="导入文件" min-width="300"></el-table-column>
      <el-table-column prop="fileSize" label="导入文件大小" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.fileSize > 1024*1024">{{(scope.row.fileSize / 1024 / 1024).toFixed(2)}}M</span>
          <span v-else>{{(scope.row.fileSize / 1024).toFixed(2)}}K</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountTitles" label="含有账户" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitles, index=7)">{{scope.row.accountTitles}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作者" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.operator, index=6)">{{scope.row.operator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="操作时间" min-width="140"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === -1">导入失败</span>
          <span v-else-if="scope.row.status === 0">等待导入</span>
          <span v-else-if="scope.row.status === 1">正在导入</span>
          <span v-else-if="scope.row.status === 2" class="ms-success">导入成功</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="rollbacked" label="是否回退" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.rollbacked === 1" class="ms-danger">已回退</span>
          <span v-else-if="scope.row.rollbacked !== 0">回退未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="rollbackTime" label="回退时间" min-width="140"></el-table-column>
      <el-table-column prop="rollbackOperator" label="回退者" min-width="80"></el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 2 && scope.row.rollbacked !== 1">
            <router-link v-if="scope.row.reportGenre === 1"
                         :to="{path:'/import-data/keyword-reports/',query:{id:scope.row.id}}" target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 2"
                         :to="{path:'/import-data/region-reports/',query:{id:scope.row.id}}" target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 3"
                         :to="{path:'/import-data/time-share-reports/',query:{id:scope.row.id}}" target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 4"
                         :to="{path:'/import-data/search-keyword-reports/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 5"
                         :to="{path:'/import-data/operating-system-report/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 6"
                         :to="{path:'/import-data/age-rang-report/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 7"
                         :to="{path:'/import-data/interest-type-report/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 8"
                         :to="{path:'/import-data/gender-report/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 9"
                         :to="{path:'/import-data/platform-reports/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 10"
                         :to="{path:'/import-data/network-reports/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 11"
                         :to="{path:'/import-data/education-reports/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 12"
                         :to="{path:'/import-data/location-reports/',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <router-link v-if="scope.row.reportGenre === 14"
                         :to="{path:'/import-data/intention-word-report',query:{id:scope.row.id}}"
                         target="_blank">数据
            </router-link>
            <ms-confirm-button title="回退" @confirm="rollback(scope.$index)">
              <p>您确定要回退<code>{{scope.row.fileName}}</code>的数据吗？</p>
            </ms-confirm-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="table.pagination.page"
      :total="table.pagination.totalRow"
      :page-size="table.pagination.pageSize"
      :page-sizes="table.pagination.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/perspective-report-import-log'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/perspective-report-import-log'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'

  export default {
    components: {
      MsSearch,
      MsConfirmButton
    },
    data () {
      return {
        search: {
          list: [],
          condition: {}
        },
        table: {
          loading: true,
          list: [],
          pagination: {}
        }
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () {
//        this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//      })
//    },
    created () {
      this.search.list = SEARCH_CONDITION

      this.table.list = []
      this.requestList()
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
//      calculatedHeight () {
//        this.$nextTick(function () {
//          this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//        })
//      },
      requestList () {
        this.table.loading = true

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
            this.$message.error(body.error || '导入日志获取失败')
          }
          this.table.loading = false
        })
      },
      rollback (index) {
        Api.rollback({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)
            this.$message.success(body.success || '回退成功')
          } else {
            this.$message.error(body.error || '回退失败')
          }
        })
      },
      handleSizeChange (val) {
        this.table.pagination.pageSize = val
        this.requestList()
      },
      handleCurrentChange (val) {
        this.table.pagination.page = val
        this.requestList()
      },
      updateConditions (conditions) {
        this.table.pagination.page = 1
        const date = conditions.date || []
        const rollbackTime = conditions.rollbackTime || []
        this.search.condition = Object.assign({}, conditions, {
          startTime: date[0],
          endTime: date[1],
          startRollbackTime: rollbackTime[0],
          endRollbackTime: rollbackTime[1]
        })
        this.requestList()
      }
    }
  }
</script>

<style scoped>

</style>
