<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目设备日报表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

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
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=4)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="customerTitle" label="所属客户" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.customerTitle, index=3)">{{scope.row.customerTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="所属平台">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="clientId" label="所属设备">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"/>
        </template>
      </el-table-column>
      <el-table-column prop="costCoin" :formatter="formatMoney" align="right" header-align="center" label="总消费点数 (点)"></el-table-column>
      <el-table-column prop="costMoney" align="right" header-align="center" label="总消费现金 (元)"></el-table-column>
      <!--<el-table-column prop="profit" align="right" header-align="center" label="总利润 (元)"></el-table-column>-->
      <el-table-column prop="serviceCoin" :formatter="formatMoney" align="right" header-align="center" label="服务户总消费 (元)"></el-table-column>
      <el-table-column prop="saler" label="销售经理">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.saler, index=5)">{{scope.row.saler}}</a>
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
  import MsDevice from '@/components/common/Device.vue'
  import MsPlatform from '@/components/common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/daily-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import { SEARCH_CONDITION } from '@/models/report/item-device-daily-consumption'
  import moment from 'moment'

  export default {
    components: {
      MsDevice,
      MsPlatform,
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
    computed: {
      platforms () {
        return PLATFORM_LIST
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

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.listDeviceConsumption({search: search}, response => {
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
//              if (value.profit === undefined) {
//                value.profit = '***'
//              } else {
//                value.profit = value.profit.toFixed(2)
//              }
              if (value.costMoney === undefined) {
                value.costMoney = '***'
              } else {
                value.costMoney = value.costMoney.toFixed(2)
              }
            })
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
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
      },
      formatMoney (row, column) {
        return parseFloat(row[column.property]).toFixed(2)
      },
      getSummaries (param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          } else if (index === 3 || index === 4) {
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
