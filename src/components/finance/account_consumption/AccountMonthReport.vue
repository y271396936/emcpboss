<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>账户消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>账户消费月报表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">导出数据</el-button>
        <router-link
          :to="{path:'/finance/account-consumption/account-month-consumption-line',query:{data:this.table.list, search: this.search}}">
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
      <el-table-column prop="name" label="账户名" min-width="200" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.name, index=4)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="推广平台" min-width="100">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column v-for="n in 12" :key="n" :prop="n.toString()" :formatter="formatMoney" align="right"
                       header-align="center" :label="n+'月'" min-width="80"/>
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
  import MsPlatform from '@/components/common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/channel-account-daily-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/channel-account-month-consumption'

  export default {
    components: {
      MsPlatform,
      MsSearch
    },
    created () {
      if (this.$route.query.search !== undefined) {
        this.search.list = this.$route.query.search.list
        this.search.condition = this.$route.query.search.condition
      } else {
        this.search.list = SEARCH_CONDITION
        this.search.list.forEach(item => {
          item.value = ''
        })

        this.search.condition.year = new Date().getFullYear().toString()
        this.search.list[0].value = new Date().getFullYear().toString()
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
        let list = []
        let data = this.table.list['accounts']
        let monthData = this.table.list['resultMap']
        for (let key in data) {
          let arrayData = {}
          if (Object.keys(data[key]).length === 0) {
            continue
          }
          arrayData['platformId'] = data[key]['platformId']
          arrayData['name'] = data[key]['name']

          let total = 0
          for (let i = 0; i < 13; i++) {
            let a = this.search.condition.year * 100 + i
            if (monthData[key][a] !== undefined) {
              if (this.search.list[1].value === '总点数') {
                arrayData[i] = monthData[key][a]['costCoin'].toFixed(2)
              } else {
                arrayData[i] = monthData[key][a]['costMoney'].toFixed(2)
              }
              total += parseInt(arrayData[i])
            } else {
              arrayData[i] = 0
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
        Api.listMonthConsumption({search: search}, response => {
          let status = response.status || 0
          let body = response.data.map || {}
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
            if (this.table.pagination.totalPage === this.table.pagination.page) {
              this.tbHeight = ''
            } else {
              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
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
        this.search.condition = conditions
        this.requestList()
      },
      download () {
        let condition = ''
        if (this.search.condition.year !== undefined) {
          let year = 'year=' + this.search.condition.year
          condition = '?' + year
        }
        if (this.search.condition.platformId !== undefined) {
          let platformId = 'platformId=' + this.search.condition.platformId
          if (condition === '') {
            condition = '?' + platformId
          } else {
            condition = condition + '&' + platformId
          }
        }
        if (this.search.condition.accountGenre !== undefined) {
          let accountGenre = 'accountGenre=' + this.search.condition.accountGenre
          if (condition === '') {
            condition = '?' + accountGenre
          } else {
            condition = condition + '&' + accountGenre
          }
        }
        if (this.search.condition.accountTitle !== undefined) {
          let accountTitle = 'accountTitle=' + this.search.condition.accountTitle
          if (condition === '') {
            condition = '?' + accountTitle
          } else {
            condition = condition + '&' + accountTitle
          }
        }
        if (condition === '') {
          window.location.href = '/rest/boss/report/channel-account-consumptions/month/files'
        } else {
          window.location.href = '/rest/boss/report/channel-account-consumptions/month/files' + condition
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
          } else if (index === 1) {
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

<style scoped>

</style>
