<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>账户分析</el-breadcrumb-item>
        <el-breadcrumb-item>项目时段分析</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="table.list"
      :fit="true">
      <el-table-column prop="itemTitle" label="项目名称" min-width="100" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=1)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="所属行业" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=3)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="channelAccountName" label="账户" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.channelAccountName, index=2)">{{scope.row.channelAccountName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="hour" label="时段" min-width="60"></el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.costCoin === undefined ? 0 : scope.row.costCoin.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="impression" label="展现" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.impression === undefined ? 0 : scope.row.impression}}
        </template>
      </el-table-column>
      <el-table-column prop="click" label="点击" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.click === undefined ? 0 : scope.row.click}}
        </template>
      </el-table-column>
      <el-table-column prop="clickRatio" label="点击率" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickRatio === undefined ? 0 : scope.row.clickRatio.toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickPrice === undefined ? 0 : scope.row.clickPrice.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="translation" label="转化" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.translation === undefined ? 0 : scope.row.translation}}
        </template>
      </el-table-column>
      <el-table-column prop="translationCost" label="转化成本" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.translationCost === undefined ? 0 : scope.row.translationCost.toFixed(2)}}
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
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/item-time-share'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/item-time-share'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = SEARCH_CONDITION
      let date = []
      date[0] = moment().subtract(2, 'days').format('YYYY-MM-DD')
      date[1] = date[0]
      this.search.list[0].value = date
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.condition.type = 1

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
      }
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true

        let search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
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
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.search.condition.type = 1
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
          if (index === 1 || index === 2 || index === 3) {
            sums[index] = '_'
            return
          }
          let values = data.map(item => Number(item[column.property]))
          if (column.property === 'costCoin' || column.property === 'impression' ||
            column.property === 'click' || column.property === 'translation') {
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
            sums[index] = sums[index - 2] === 0 ? '∞' : (sums[index - 1] / sums[index - 2] * 100).toFixed(2) + '%'
          }
          if (column.property === 'clickPrice') {
            sums[index] = sums[index - 2] === 0 ? '∞' : (sums[index - 4] / sums[index - 2]).toFixed(2)
          }
          if (column.property === 'translationCost') {
            sums[index] = sums[index - 1] === 0 ? '∞' : (sums[index - 6] / sums[index - 1]).toFixed(2)
          }
        })

        return sums
      }
    }
  }
</script>

<style scoped>

</style>
