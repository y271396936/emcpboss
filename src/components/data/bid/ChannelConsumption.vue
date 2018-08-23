<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>运营报告</el-breadcrumb-item>
        <el-breadcrumb-item>渠道消费汇总报告</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"

      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="recombineList"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="85" :formatter="dataFormat" fixed></el-table-column>
      <el-table-column prop="channelTitle" label="渠道名称" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.channelTitle, index=1)">{{scope.row.channelTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="clientId" label="客户端" min-width="60">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"></ms-device>
        </template>
      </el-table-column>
      <el-table-column prop="budget" label="总预算" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row.budget.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="costCoin" label="总消费" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row.costCoin.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="差额" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-danger': (scope.row.diff < 0) }">{{scope.row.diff}}</span>
        </template>
      </el-table-column>
      <el-table-column label="达成率" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-info':(scope.row.budget == 0) }">{{scope.row.rate}}</span>
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
  import MsDevice from '@/components/common/Device.vue'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/channel-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    components: {
      MsDevice,
      MsSearch
    },
    created () {
      let date = []
      // date[0] = moment().format('YYYY-MM-01')
      date[0] = moment().subtract(1, 'days').format('YYYY-MM-DD')
      date[1] = moment().subtract(1, 'days').format('YYYY-MM-DD')

      this.search.condition.date = date

      this.search.list = [
        {
          name: 'date',
          title: '日期',
          type: CONDITION_TYPE.DATE,
          value: date,
          visible: true,
          config: {
            type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          name: 'channel',
          title: '渠道名称',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'clientId',
          title: '客户端',
          placeholder: '--请选择客户端--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: 1, label: 'PC端'},
              {value: 2, label: '手机端'},
              {value: 3, label: 'APP'}
            ]
          }
        }
      ]

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
    computed: {
      recombineList () {
        let list = []
        this.table.list.forEach(item => {
          let consumption = item
          consumption.diff = (item.budget - item.costCoin).toFixed(2)
          consumption.rate = item.budget === 0 ? '∞' : (item.costCoin / item.budget * 100).toFixed(2) + '%'
          list.push(consumption)
        })

        return list
      }
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

        let params = Object.assign({}, {page: this.table.pagination.page, pageSize: this.table.pagination.pageSize},
          this.search.condition)
        Api.list(params, response => {
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
          if (column.property === 'budget' || column.property === 'costCoin') {
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
          if (column.property === 'costCoin' || column.property === 'budget') {
            sums[index] = sums[index].toFixed(2)
          }
        })

        sums[5] = (sums[3] - sums[4]).toFixed(2)
        sums[6] = sums[3] === 0 ? '∞' : (sums[4] / sums[3] * 100).toFixed(2) + '%'

        return sums
      },
      dataFormat (row, column) {
        const data = row[column.property] + ''
        if (data === '' || data === undefined) {
          return ''
        } else if (data.length === 8) {
          let _data = data.substring(0, 4) + '-' + data.substring(4, 6) + '-' + data.substring(6, 8)
          return _data
        }
      }
    }
  }
</script>

<style scoped>

</style>
