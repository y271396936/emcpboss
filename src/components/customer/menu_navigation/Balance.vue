<template>
  <div>
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>
    <div>
      <el-table
        class="element-table"
        v-loading="table.loading"
        size="small"
        :summary-method="getSummaries"
        :highlight-current-row="true"
        :show-summary="true"
        :fit="true"
        :data="theBalanceTo"
        border stripe
        style="width: 100%">
        <el-table-column prop="title" label="项目名称" min-width="260" fixed></el-table-column>
        <el-table-column prop="industry" label="所属行业" min-width="260"></el-table-column>
        <el-table-column prop="saler" label="销售经理" min-width="180"></el-table-column>
        <el-table-column prop="server" label="客服专员" min-width="180"></el-table-column>
        <el-table-column prop="money" label="现金余额" min-width="200" align="right" header-align="center">
          <template slot-scope="scope">
            <span>{{scope.row.money}} 元</span>
          </template>
        </el-table-column>
        <el-table-column prop="beforeYesterdayCostCoin" label="前日消费" align="right" header-align="center"
                         min-width="180">
          <template slot-scope="scope">
            <div class="count">{{scope.row.beforeYesterdayCostCoin}} 点</div>
            <div>{{scope.row.beforeYesterdayCostMoney}} 元</div>
          </template>
        </el-table-column>
        <el-table-column prop="yesterdayCostCoin" label="昨日消费" align="right" header-align="center"
                         min-width="180">
          <template slot-scope="scope">
              <div class="count">{{scope.row.yesterdayCostCoin}} 点</div>
              <div>{{scope.row.yesterdayCostMoney}} 元</div>
          </template>
        </el-table-column>
        <el-table-column prop="consumeDay" label="可消费天数" min-width="200" align="right" header-align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.money < 0" style="color: red">已欠费</span>
            <span v-else>
              <span v-if="scope.row.yesterdayCostMoney > 0 && scope.row.money > 0" style="color: orange">可消费 {{(scope.row.money / scope.row.yesterdayCostMoney).toFixed(2)}} 天</span>
              <span v-else-if="scope.row.beforeYesterdayCostMoney > 0 && scope.row.money > 0" style="color: orange">可消费 {{(scope.row.money / scope.row.beforeYesterdayCostMoney).toFixed(2)}} 天</span>
              <span v-else-if="scope.row.budget > 0 && scope.row.money > 0" style="color: orange">可消费 {{(scope.row.money / scope.row.budget).toFixed(2)}} 天</span>
              <span v-else></span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  import CountTo from 'vue-count-to'
  import MsSearch from '@/components/common/Search.vue'
  import { SEARCH_CONDITION } from '@/models/platform/balance'
  import StatisticsApi from '@/api/customer/desktop/statistics'
  import ResponseParse from '@/utils/response-parse'

  export default {
    name: 'home',
    components: {
      CountTo,
      MsSearch
    },
    data () {
      return {
        isShow: false,
        pagination: {},
        loading: false,
        table: {
          loading: true,
          list: [],
          pagination: {}
        },
        search: {
          list: [],
          condition: {}
        },
        theBalanceTo: [],
        titleName: {}
      }
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.loading = true
      this.requestList()
      this.customerItems()
    },
    methods: {
      customerItems () {
        const search = Object.assign({}, this.search.condition)
        StatisticsApi.customerItem({search: search}, response => {
          let status = response.status || 0
          let data = response.data || []
          if (status === 200 || status === 204) {
            this.titleName = data
            this.search.list[0].config.list = []
            let project = []
            this.titleName.forEach(item => {
              if (item.status === 1) {
                project.unshift({value: item.id, label: item.title})
              } else {
                project.push({value: item.id, label: item.title, disabled: true})
              }
            })
            this.search.list[0].config.list = project
          } else {
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      requestList () {
        this.loading = true
        const search = Object.assign({}, this.pagination, this.search.condition)
        // 余额
        StatisticsApi.theBalanceTo({search}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.theBalanceTo = body
            this.table.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.theBalanceTo = []
            this.$message.error(response.data.error || '数据获取失败')
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
        this.search.condition = conditions
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
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
          if (column.property === 'money') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value) && value !== Infinity) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            }
            if (column.property === 'money') {
              sums[index] = sums[index].toFixed(2) + ' 元'
            }
          }
        })
        return sums
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-table__footer .has-gutter td .cell {
    text-align: center;
  }
  .count{
    font-weight: bold;
  }
</style>
