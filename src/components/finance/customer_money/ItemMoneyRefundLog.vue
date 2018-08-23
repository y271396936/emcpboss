<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>客户款项</el-breadcrumb-item>
        <el-breadcrumb-item>退款记录</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="customerTitle" label="所属客户" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.customerTitle, index=2)">{{scope.row.customerTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="customerGenre" label="客户类型" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.customerGenre === 1">销售客户</span>
          <span v-else-if="scope.row.customerGenre === 2">渠道客户</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=3)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="退款金额(元)" :formatter="formatMoney" min-width="90" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="reason" label="退款原因" min-width="200"></el-table-column>
      <el-table-column prop="refundTime" label="退款时间" min-width="140"></el-table-column>
      <el-table-column prop="publishTime" label="操作时间" min-width="140"></el-table-column>
      <el-table-column prop="publisher" label="操作人" min-width="70"></el-table-column>
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
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/platform/item-money'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/platform/item-money-refund'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = SEARCH_CONDITION

      let date = []
      date[0] = moment().format('YYYY-MM-01')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.list[0].value = date

      this.table.list = []
      this.requestList()
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
        Api.listRefundLog({search: search}, response => {
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
            this.$message.error(body.error || '数据获取失败')
          }
          this.table.loading = false
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
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
      },
      formatMoney (row, column) {
        return parseFloat(row[column.property]).toFixed(2)
      },
      getSummaries (param) {
        let {columns, data} = param
        let sums = []

        if (data.length === 0) {
          return sums
        }

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }

          let values = data.map(item => Number(item[column.property]))
          if (column.property === 'money') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            }
          }
          if (column.property === 'money') {
            sums[index] = sums[index].toFixed(2)
          }
        })

        return sums
      }
    }
  }
</script>

<style scoped>

</style>
