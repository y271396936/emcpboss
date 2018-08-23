<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>销售业绩日报</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">导出数据</el-button>
        <router-link
          :to="{path:'/finance/sale-performance-line',query:{data:this.table.list, search: this.search}}">
          显示图表
        </router-link>
      </el-button-group>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :data="recombineList"
      :show-summary="true"

      :highlight-current-row="true"
      :summary-method="getSummaries"
      :fit="true">
      <el-table-column prop="saler" label="销售" fixed></el-table-column>
      <el-table-column v-for="n in mGetDate(search.condition)" :key="n" :prop="n.toString()" :formatter="formatMoney"
                       align="right" header-align="center" :label='n+"日"' min-width="80"></el-table-column>
      <el-table-column prop="total" :formatter="formatMoney" align="right" header-align="center" label="合计"
                       min-width="80"></el-table-column>
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
  import Api from '@/api/report/item-daily-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { SALER_SEARCH_CONDITION } from '@/models/report/item-daily-consumption'

  export default {
    components: {
      MsSearch
    },
    created () {
      if (this.$route.query.search !== undefined) {
        this.search.list = this.$route.query.search.list
        this.search.condition = this.$route.query.search.condition
      } else {
        this.search.list = SALER_SEARCH_CONDITION
        this.search.list.forEach(item => {
          item.value = ''
        })

        this.search.condition.year = new Date().getFullYear().toString()
        this.search.condition.month = (new Date().getMonth() + 1).toString()
        this.search.list[0].value = this.search.condition.year + '-' + this.search.condition.month
        this.search.condition.dataType = 1
        this.search.list[1].value = '总消费点数'
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
          list: {},
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
      recombineList () {
        // 定义原始变量
        let list = []
        let firstData = this.table.list['data']
        let userData = this.table.list['users']
        this.lastDay = this.table.list.lastDay
        let lastDay = this.table.list.lastDay
        // 获取项目名 和 消费点数 和消费金额
        for (let key in userData) {
          let arrayData = {}
          if (Object.keys(userData[key]).length === 0) {
            continue
          }
          // 获取销售名
          arrayData['saler'] = userData[key]['name']
          let total = 0
          for (let n = 1; n < lastDay + 1; n++) {
            let a = this.search.condition.year * 10000 + this.search.condition.month * 100 + n
            if (firstData[key][a] !== undefined) {
              let searchValue = this.search.condition.dataType
              if (searchValue === 1) {
                arrayData[n] = firstData[key][a]['costCoin']
              } else if (searchValue === 2) {
                arrayData[n] = firstData[key][a]['costMoney']
              } else if (searchValue === 3) {
                arrayData[n] = firstData[key][a]['serviceCoin']
              } else if (searchValue === 4) {
                arrayData[n] = firstData[key][a]['cpCostCoin']
              } else if (searchValue === 5) {
                arrayData[n] = firstData[key][a]['cpCostMoney']
              } else if (searchValue === 6) {
                arrayData[n] = firstData[key][a]['jpCostCoin']
              } else if (searchValue === 7) {
                arrayData[n] = firstData[key][a]['jpCostMoney']
              } else {
                arrayData[n] = firstData[key][a]['costCoin']
              }
              total += parseFloat(arrayData[n])
            } else {
              arrayData[n] = 0
            }
            arrayData['total'] = total
          }
          list.push(arrayData)
        }
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
                return prev + curr
              } else {
                return prev
              }
            }, 0)
            sums[index] = sums[index].toFixed(2) + ' '
          } else {
            sums[index] = 'N/A'
          }
        })

        return sums
      },
      requestList () {
        this.table.loading = true

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data.map || {}
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
//            if (this.table.pagination.totalPage === this.table.pagination.page) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.table.list = {}
            this.$message.error(response.data.error || '消费获取失败')
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
        const date = conditions.date.split('-') || []
        this.search.condition = Object.assign({}, conditions, {year: date[0], month: date[1]})
        this.requestList()
      },
      download () {
        let condition = ''
        if (this.search.condition.year !== undefined) {
          let year = 'year=' + this.search.condition.year
          condition = '?' + year
        }
        if (this.search.condition.month !== undefined) {
          let month = 'month=' + this.search.condition.month
          if (condition === '') {
            condition = '?' + month
          } else {
            condition = condition + '&' + month
          }
        }
        if (this.search.condition.other !== undefined) {
          let other = 'other=' + this.search.condition.other
          if (condition === '') {
            condition = '?' + other
          } else {
            condition = condition + '&' + other
          }
        }
        if (condition === '') {
          window.location.href = '/rest/boss/report/sales-consumptions/daily/files'
        } else {
          window.location.href = '/rest/boss/report/sales-consumptions/daily/files' + condition
        }
      },
      formatMoney (row, column) {
        return parseFloat(row[column.property]).toFixed(2)
      },
      mGetDate ({year, month}) {
        let d = new Date(parseInt(year), parseInt(month), 0)
        return d.getDate()
      }
    }
  }
</script>

<style scoped>

</style>
