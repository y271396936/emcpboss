<template>
  <div>
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>
      <div class="listBox">
        <el-table
          class="element-table"
          size="small" stripe border
          :data="table.list"
          :highlight-current-row="true"
          :summary-method="getSummaries"
          :show-summary="true"
          :fit="true">
          <el-table-column prop="day" label="日期" min-width="100" fixed>
          </el-table-column>
          <el-table-column prop="itemTitle" label="项目名称" min-width="200">
          </el-table-column>
          <el-table-column prop="click" label="点击量" min-width="100" align="right" header-align="center">
          </el-table-column>
          <el-table-column prop="clickPrice" label="平均点击价格" min-width="100" align="right" header-align="center">
            <template slot-scope="scope">
              <span>{{parseFloat(scope.row.costCoin / scope.row.click).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="feedback" label="留言数" min-width="100" align="right" header-align="center">
          </el-table-column>
          <el-table-column prop="talk" label="有效对话量" min-width="100" align="right" header-align="center">
          </el-table-column>
          <el-table-column prop="phone" label="要电话量" min-width="100" align="right" header-align="center">
          </el-table-column>
          <el-table-column label="有效咨询率" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.click > 0">{{(scope.row.talk * 100 / scope.row.click).toFixed(2)}}%</span>
              <span v-else class="ms-info">-</span>
            </template>
          </el-table-column>
          <el-table-column label="沟通有效率" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.talk > 0">{{(scope.row.phone * 100 / scope.row.talk).toFixed(2)}}%</span>
              <span v-else class="ms-info">-</span>
            </template>
          </el-table-column>
          <el-table-column prop="costCoin" label="消费点数" min-width="150" align="right" header-align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.costCoin < 0">{{parseFloat(scope.row.costCoin).toFixed(2)}} 点</span>
              <span v-else>{{parseFloat(scope.row.costCoin).toFixed(2)}} 点</span>
            </template>
          </el-table-column>
          <el-table-column prop="server" label="客服" min-width="100">
          </el-table-column>
          <el-table-column prop="saler" label="销售" min-width="100">
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
  import moment from 'moment'
  import StatisticsApi from '@/api/customer/desktop/statistics'
  import MsSearch from '@/components/common/SearchOne.vue'
  import { SEARCH_CONDITION } from '@/models/customer/promote-data'
  import ResponseParse from '@/utils/response-parse'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = SEARCH_CONDITION
      let date = []
      date[0] = moment().subtract(6, 'days').format('YYYY-MM-DD')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.list[0].value = date
      StatisticsApi.customerItem({search: {}}, response => {
        let status = response.status || 0
        let data = response.data || []
        if (status === 200 || status === 204) {
          let project = []
          data.forEach(item => {
            if (item.status === 1) {
              project.unshift({value: item.id, label: item.title})
            } else {
              project.push({value: item.id, label: item.title, disabled: true})
            }
          })
          this.search.list[1].config.list = project
        }
      })
      this.requestList()
    },
    data () {
      return {
        row: {
          edit: {
            index: 0
          },
          form: {}
        },
        search: {
          list: [],
          pagination: {},
          condition: {}
        },
        table: {
          list: [],
          pagination: {},
          condition: {}
        },
        data: {},
        chartLoading: false
      }
    },
    methods: {
      formatTime (value) {
        return moment(value, 'MM-DD-YYYY hh:mm:ss').format('YYYY-MM-DD')
      },
      requestList () {
        this.chartLoading = true
        const search = Object.assign({}, this.pagination, this.search.condition)
        StatisticsApi.promoteData({search: search}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.pagination = ResponseParse.pagination(response.headers)
            this.table.list = body
          } else {
            this.$message.error(body.error || '数据获取失败')
          }
          this.chartLoading = false
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
          if (column.property === 'click' || column.property === 'feedback' || column.property === 'phone' ||
            column.property === 'costCoin' || column.property === 'talk') {
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
            if (column.property === 'costCoin') {
              sums[index] = sums[index].toFixed(2) + ' 点'
            }
          }
        })
        return sums
      }
    }
  }
</script>

<style type="text/css" scoped>
  .listBox>.element-table>.el-table__footer-wrapper>.el-table__footer>has-gutter>tr>is-leaf>.cell{
    text-align: center;
  }
</style>

