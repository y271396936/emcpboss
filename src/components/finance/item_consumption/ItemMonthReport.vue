<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目消费月报</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">导出数据</el-button>
        <router-link
          :to="{path:'/finance/item-consumption/item-month-consumption-line',query:{data:this.table.list, search: this.search}}">
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
      <el-table-column prop="title" label="项目" min-width="80" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.title, index=4)">{{scope.row.title}}</a>
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
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/item-month-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/item-month-consumption'

  export default {
    components: {
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
        // 定义原始变量
        let list = []
        let mapData = this.table.list['data']
        let itemData = this.table.list['item']
        // 获取项目名 和 消费点数 和消费金额
        for (let key in itemData) {
          let arrayData = {}
          if (Object.keys(itemData[key]).length === 0) {
            continue
          }
          arrayData['title'] = itemData[key]['title']
          let total = 0
          for (let n = 0; n < 13; n++) {
            let a = this.search.condition.year * 100 + n
            if (mapData[key][a] !== undefined) {
              let searchValue = this.search.list[1].value
              if (searchValue === '总点数') {
                arrayData[n] = mapData[key][a]['costCoin']
              } else if (searchValue === '总金额') {
                arrayData[n] = mapData[key][a]['costMoney']
              } else if (searchValue === '总服务费') {
                arrayData[n] = mapData[key][a]['serviceCoin']
              } else if (searchValue === '产品消费总点数') {
                arrayData[n] = mapData[key][a]['cpCostCoin']
              } else if (searchValue === '产品消费总金额') {
                arrayData[n] = mapData[key][a]['cpCostMoney']
              } else if (searchValue === '竞品消费总点数') {
                arrayData[n] = mapData[key][a]['jpCostCoin']
              } else if (searchValue === '竞品消费总金额') {
                arrayData[n] = mapData[key][a]['jpCostMoney']
              } else {
                arrayData[n] = mapData[key][a]['costCoin']
              }
              total += (parseInt(arrayData[n]))
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
//            if (this.table.pagination.totalPage === this.table.pagination.page) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.table.list = {}
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
      download () {
        let condition = ''
        if (this.search.condition.year !== undefined) {
          let year = 'year=' + this.search.condition.year
          condition = '?' + year
        }
        if (this.search.condition.customerGenre !== undefined) {
          let customerGenre = 'customerGenre=' + this.search.condition.customerGenre
          if (condition === '') {
            condition = '?' + customerGenre
          } else {
            condition = condition + '&' + customerGenre
          }
        }
        if (this.search.condition.customerTitle !== undefined) {
          let customerTitle = 'customerTitle=' + this.search.condition.customerTitle
          if (condition === '') {
            condition = '?' + customerTitle
          } else {
            condition = condition + '&' + customerTitle
          }
        }
        if (this.search.condition.title !== undefined) {
          let title = 'title=' + this.search.condition.title
          if (condition === '') {
            condition = '?' + title
          } else {
            condition = condition + '&' + title
          }
        }
        if (condition === '') {
          window.location.href = '/rest/boss/report/item-consumptions/month/files'
        } else {
          window.location.href = '/rest/boss/report/item-consumptions/month/files' + condition
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
      }
    }
  }
</script>

<style scoped>

</style>
