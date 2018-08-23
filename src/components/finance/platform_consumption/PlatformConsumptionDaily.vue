<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>平台消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>平台消费日报</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">导出数据</el-button>
        <router-link
          :to="{path:'/finance/platform-daily-consumption-line',query:{data:this.table.list, search: this.search}}">
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
      <el-table-column prop="platformTitle" label="平台" min-width="120" fixed/>
      <el-table-column v-for="n in mGetDate(search.condition)" :key="n" :prop="n.toString()" :formatter="formatMoney"
                       align="right" header-align="center" :label="n+'日'" min-width="80"/>
      <el-table-column prop="total" :formatter="formatMoney" align="right" header-align="center" label="合计"
                       min-width="80"/>
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
  import Api from '@/api/report/item-device-daily-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import { PLATFORM_SEARCH_CONDITION } from '@/models/report/item-device-daily-consumption'

  export default {
    components: {
      MsSearch
    },
    created () {
      if (this.$route.query.search !== undefined) {
        this.search.list = this.$route.query.search.list
        this.search.condition = this.$route.query.search.condition
      } else {
        this.search.list = PLATFORM_SEARCH_CONDITION
        this.search.list.forEach(item => {
          item.value = ''
        })

        this.search.condition.year = new Date().getFullYear().toString()
        this.search.condition.month = (new Date().getMonth() + 1).toString()
        this.search.list[0].value = this.search.condition.year + '-' + this.search.condition.month
        this.search.condition.dataType = 1
        this.search.list[1].value = '总点数'
      }

      this.table.list = {}
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
        let platforms = {}
        PLATFORM_LIST.forEach(item => {
          platforms[item.id] = item.title
        })
        let list = []
        let firstData = this.table.list['data']
        // 获取项目名 和 消费点数 和消费金额
        for (let key in firstData) {
          let arrayData = {}
          if (Object.keys(firstData[key]).length === 0) {
            continue
          }
          // 获取项目平台名
          arrayData['platformTitle'] = platforms[key]
          let total = 0
          for (let n = 1; n <= 31 + 1; n++) {
            let a = this.search.condition.year * 10000 + this.search.condition.month * 100 + n
            if (firstData[key][a] !== undefined) {
              let searchValue = this.search.list[1].value
              if (searchValue === '总点数') {
                arrayData[n] = firstData[key][a]['costCoin']
              } else if (searchValue === '总金额') {
                arrayData[n] = firstData[key][a]['costMoney']
              } else {
                arrayData[n] = firstData[key][a]['serviceCoin']
              }
              total += parseInt(arrayData[n])
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
      requestList () {
        this.table.loading = true

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data.map || {}
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
//            if (Object.keys(this.table.list['data']).length <= 15) {
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
        if (condition === '') {
          window.location.href = '/rest/boss/report/item-platform-consumptions/daily/files'
        } else {
          window.location.href = '/rest/boss/report/item-platform-consumptions/daily/files' + condition
        }
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
