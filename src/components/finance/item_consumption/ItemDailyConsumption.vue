<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目日总报表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      class="element-table"
      size="small" stripe border
      :data="table.list"
      :show-summary="true"

      :highlight-current-row="true"
      :summary-method="getSummaries"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="100" fixed></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="120" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=3)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="customerTitle" label="所属客户" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.customerTitle, index=2)">{{scope.row.customerTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="money" :formatter="formatMoney" align="right" header-align="center" width="90"
                       :render-header="renderHeader"></el-table-column>
      <el-table-column prop="cpCostCoin" :formatter="formatMoney" align="right" header-align="center"
                       label="产品总消费点数 (点)"></el-table-column>
      <el-table-column prop="cpCostMoney" align="right" header-align="center" label="产品总消费现金 (元)"></el-table-column>
      <!--<el-table-column prop="cpProfit" align="right" header-align="center" label="产品总利润 (元)"></el-table-column>-->
      <el-table-column prop="jpCostCoin" :formatter="formatMoney" align="right" header-align="center"
                       label="竞品总消费点数 (点)"></el-table-column>
      <el-table-column prop="jpCostMoney" align="right" header-align="center" label="竞品总消费现金 (元)"></el-table-column>
      <!--<el-table-column prop="jpProfit" align="right" header-align="center" label="竞品总利润 (元)"></el-table-column>-->
      <el-table-column prop="costCoin" :formatter="formatMoney" align="right" header-align="center"
                       label="总消费点数 (点)"></el-table-column>
      <el-table-column prop="costMoney" align="right" header-align="center" label="总消费现金 (元)"></el-table-column>
      <!--<el-table-column prop="profit" align="right" header-align="center" label="总利润 (元)"></el-table-column>-->
      <el-table-column prop="serviceCoin" :formatter="formatMoney" align="right" header-align="center"
                       label="服务户总消费 (元)"></el-table-column>
      <el-table-column prop="payment" :formatter="formatMoney" align="right" header-align="center"
                       label="总充值现金 (元)"></el-table-column>
      <el-table-column prop="refundMoney" :formatter="formatMoney" align="right" header-align="center"
                       label="总退款现金 (元)"></el-table-column>
      <el-table-column prop="transferOut" :formatter="formatMoney" align="right" header-align="center"
                       label="总转出现金 (元)"></el-table-column>
      <el-table-column prop="transferIn" :formatter="formatMoney" align="right" header-align="center"
                       label="总转入现金 (元)"></el-table-column>
      <el-table-column prop="yesterdayMoney" :formatter="formatMoney" align="right" header-align="center"
                       label="前一天每日余额 (元)"></el-table-column>
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
  import Api from '@/api/report/daily-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/item-daily-consumption'
  import moment from 'moment'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = SEARCH_CONDITION

      if (this.$route.query.itemTitle !== undefined) {
        this.search.condition.itemTitle = this.$route.query.itemTitle
        this.search.list[3].value = this.$route.query.itemTitle
      } else {
        let date = []
        date[0] = moment().format('YYYY-MM-01')
        date[1] = moment().format('YYYY-MM-DD')
        this.search.condition.startTime = date[0]
        this.search.condition.endTime = date[1]
        this.search.list[0].value = date
      }

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
        Api.listItemConsumption({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            body.forEach((value) => {
              const str = value.day + ''
              if (undefined !== str && str !== '' && str.length === 8) {
                const dayStr = str.substring(0, 4) + '-' + str.substring(4, 6) + '-' + str.substring(6, 8)
                value.day = dayStr
              } else {
                value.day = str
              }
              if (value.profit === undefined) {
                value.cpProfit = '***'
                value.jpProfit = '***'
                value.profit = '***'
              } else {
                value.cpProfit = value.cpProfit.toFixed(2)
                value.jpProfit = value.jpProfit.toFixed(2)
                value.profit = value.profit.toFixed(2)
              }
              if (value.costMoney === undefined) {
                value.cpCostMoney = '***'
                value.jpCostMoney = '***'
                value.costMoney = '***'
              } else {
                value.cpCostMoney = value.cpCostMoney.toFixed(2)
                value.jpCostMoney = value.jpCostMoney.toFixed(2)
                value.costMoney = value.costMoney.toFixed(2)
              }
            })
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
      renderHeader (createElement) {
        return [createElement('s', ['每日余额']),
          createElement('br'),
          createElement('i', ['(日末余额)']),
          createElement('span', {attrs: {'class': 'el-icon-question'}, on: {click: this.question}}),
          createElement('i', ['(元)'])
        ]
      },
      question () {
        this.$notify({
          title: '注释',
          dangerouslyUseHTMLString: true,
          duration: 0,
          message: '<div>\n' +
          '<p>&nbsp;&nbsp;&nbsp;&nbsp;' +
          '        每日23时59分59秒系统自动将某项目的现金在当天产生变动后的数值记录为每日余额，也称“日末余额”。\n' +
          '        该余额并非项目的实际余额。主要因为消费数据只能第二天生成并导入，则该数据并不含当天消费；\n' +
          '        而系统中的转入、转出、充值、退款等操作为即时生效，所以该数据包含了这些变动。\n' +
          '</p><br>' +
          '        <br>\n' +
          '        <strong>参考对账公式：</strong>\n' +
          '        <code>当天每日余额 = ( 前一天日末余额 - 前一天消费 ) + ( 当天充值 - 当天退款 + 当天转入 - 当天转出 )</code>\n' +
          '        同时因为系统中导入的消费可能发生回退等情况，这将导致回退期间内的日末余额均存在差值；但是该差值在一段时期内会自动修正。\n' +
          '        <br>\n' +
          '        <strong>实际对账公式：</strong>\n' +
          '        <code>项目余额 = ( 总充值 - 总消费 ) + ( 总退款 - 总转出 + 总转入 )</code>\n' +
          '        <br>\n' +
          '        注意，服务户消费为计算服务费的基数，不参与余额对账。\n' +
          '      </div>'
        })
      },
      formatMoney (row, column) {
        return parseFloat(row[column.property]).toFixed(2)
      },
      getSummaries (param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return (parseFloat(prev) + parseFloat(curr)).toFixed(2)
              } else {
                return parseFloat(prev).toFixed(2)
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        })
        return sums
      }
    }
  }
</script>

<style lang="scss" scoped>
  .element-table th {
    height: 48px;
  }

  .element-table td {
    height: 37px;
  }
</style>
