<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>信息流</el-breadcrumb-item>
        <el-breadcrumb-item>日月报</el-breadcrumb-item>
        <el-breadcrumb-item>头条位置月报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="table.list"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="100" fixed>
        <template slot-scope="scope">
          {{scope.row.day.toString().substring(0, 6)}}
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="渠道" min-width="140" v-if="search.condition.dataGroup === 1">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.channel, index=1)">{{scope.row.channel}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="行业" min-width="150" v-if="search.condition.dataGroup === 2">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=2)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="impression" label="展现" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.impression === undefined ? 0 : scope.row.impression}}
        </template>
      </el-table-column>
      <el-table-column prop="click" label="点击" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.click === undefined ? 0 : scope.row.click}}
        </template>
      </el-table-column>
      <el-table-column prop="clickRatio" label="点击率" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickRatio === undefined ? 0 : scope.row.clickRatio.toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.costCoin === undefined ? 0 : scope.row.costCoin}}
        </template>
      </el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickPrice === undefined ? 0 : scope.row.clickPrice.toFixed(2)}}
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
  import ResponseParse from '@/utils/response-parse'
  import MsSearch from '@/components/common/Search.vue'
  import { MONTH_REPORT_SEARCH_CONDITION } from '@/models/report/location-report'
  import Api from '@/api/report/location-report'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = MONTH_REPORT_SEARCH_CONDITION
      let year = moment().format('YYYY')
      this.search.condition.year = year
      this.search.list[0].value = year
      this.search.condition.dataGroup = 1
      this.requestList()
    },
    data () {
      return {
        table: {
          loading: false,
          list: [],
          pagination: {}
        },
        search: {
          list: [],
          condition: {}
        }
      }
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true
        let search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.listMonthReport({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
          } else {
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
        this.search.condition = conditions
        this.requestList()
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
          if (column.property === 'costCoin' || column.property === 'impression' || column.property === 'click') {
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

          if (column.property === 'costCoin') {
            sums[index] = sums[index].toFixed(2)
          }
          if (column.property === 'clickRatio') {
            sums[index] = sums[index - 2] === 0 ? '∞' : (sums[index - 1] * 100 / sums[index - 2]).toFixed(2) + '%'
          }
          if (column.property === 'clickPrice') {
            sums[index] = sums[index - 3] === 0 ? '∞' : (sums[index - 1] / sums[index - 3]).toFixed(2)
          }
        })

        return sums
      }
    }
  }
</script>

<style scoped>

</style>
