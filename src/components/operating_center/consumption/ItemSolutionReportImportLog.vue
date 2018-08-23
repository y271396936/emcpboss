<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>消费数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>导入日志</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"></ms-search>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>


    <el-table v-loading="table.loading" size="small" stripe border :data="table.list" :fit="true">
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
          <span v-else-if="scope.row.dataTypeId === 12">一点资讯信息流</span>
          <span v-else-if="scope.row.dataTypeId === 13">广点通</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="fileName" label="导入文件" min-width="250"></el-table-column>
      <el-table-column prop="accountTitles" label="含有账户" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitles, index=6)">{{scope.row.accountTitles}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作者" min-width="70">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.operator, index=5)">{{scope.row.operator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">导入成功</span>
          <span v-else class="ms-danger">导入失败</span>
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
      <el-table-column label="操作" min-width="120" fixed="right">
        <template slot-scope="scope">
          <router-link v-if="scope.row.status === 1 && scope.row.rollbacked !== 1"
                       :to="{path:'/import-data/item-solution-reports/',query:{id:scope.row.id}}" target="_blank">
            数据
          </router-link>
          <el-button type="text" size="small" @click.native.prevent="download(scope.$index)">下载</el-button>
          <ms-confirm-button v-if="scope.row.status === 1 && scope.row.rollbacked !== 1" title="回退"
                             @confirm="rollback(scope.$index)">
            <p>您确定要对此次导入的消费数据进行回退，还原项目余额、账户余额等操作吗？</p>
          </ms-confirm-button>
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
  import moment from 'moment'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/item-solution-report-import-log'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/item-solution-report-import-log'

  export default {
    components: {
      MsConfirmButton,
      MsSearch
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
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    created () {
      this.search.condition.startTime = moment().format('YYYY-MM-01')
      this.search.condition.endTime = moment().format('YYYY-MM-DD')

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
            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
              this.tbHeight = ''
            } else {
              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
            this.$message.error(body.error || '导入日志获取失败')
          }
          this.table.loading = false
        })
      },
      download (index) {
        window.location.href = '/rest/boss/report/item-solution-report-import-logs/' + this.table.list[index].id + '/file'
      },
      rollback (index) {
        Api.rollback({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)
          } else {
            this.$message.error('回退失败')
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
