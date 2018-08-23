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
        <el-breadcrumb-item>性别日报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--@clickH="caculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="table.list"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="100" fixed> </el-table-column>
      <el-table-column prop="channel" label="渠道" min-width="140"  v-if="search.condition.orderBy === 0 || search.condition.industry === ''"></el-table-column>
      <el-table-column prop="industry" label="行业" min-width="150"  v-if="search.condition.orderBy === 1 && search.condition.industry !== ''">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=3)">{{scope.row.industry}}</a>
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
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
  import Api from '@/api/report/gender-report'
  export default {
    components: {
      MsSearch
    },
    created () {
      let date = []
      date[0] = moment().format('YYYY-MM-01')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.condition.date = date
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.condition.orderBy = 0
//      this.table.loading = true
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
          name: 'orderBy',
          title: '筛选',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: '0', label: '渠道'},
              {value: '1', label: '行业'}
            ]
          }
        },
        {
          name: 'channelId',
          title: '渠道',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: '8', label: '百度信息流'},
              {value: '9', label: '360信息流'},
              {value: '10', label: '今日头条信息流'},
              {value: '11', label: 'UC信息流'},
              {value: '14', label: '一点资讯信息流'}
            ]
          }
        },
        {
          name: 'industry',
          title: '行业',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        }
      ]
      this.requestList()
    },
    data () {
      return {
        table: {
          loading: false,
          orderBy: '',
          list: [],
          pagination: {}
        },
        search: {
          list: [],
          condition: {}
        },
        impression: 0,
        click: 0,
        costCoin: 0
      }
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true
//        this.search.condition.startTime = this.search.condition.day[0]
//        this.search.condition.endTime = this.search.condition.day[1]
        let params = Object.assign({}, {page: this.table.pagination.page, pageSize: this.table.pagination.pageSize},
          this.search.condition)
        Api.genderInfoFlowDayReport(params, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body.map.list
            this.search.condition.orderBy = body.map.orderBy
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
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
          if (index === 1) {
            sums[index] = '_'
            return
          }
          let values = data.map(item => Number(item[column.property]))
          if (column.property === 'costCoin' || column.property === 'impression' || column.property === 'click' ||
            column.property === 'clickPrice') {
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
            sums[index] = sums[index - 1] === 0 ? '∞' : (sums[index - 1] / sums[index - 3]).toFixed(2)
          }
        })

        return sums
      },
      updateConditions (conditions) {
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      }

    }
  }
</script>

<style scoped>

</style>
