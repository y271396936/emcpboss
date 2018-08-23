<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目平台消费月报</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--<el-button-group v-if="Object.keys(table.list.data).length > 0">-->
        <!--<router-link-->
          <!--:to="{path:'/finance/item-consumption/item-platform-month-consumption-line',query:{data:this.table.list, search: this.search}}">-->
          <!--显示图表-->
        <!--</router-link>-->
      <!--</el-button-group>-->
    </el-row>

    <div ref="msSearch">
      <!--@clickH="calculatedHeight"-->
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :data="recombineList"
      :show-summary="true"

      :highlight-current-row="true"
      :summary-method="getSummaries"
      :fit="true">
      <el-table-column prop="itemTitle" label="项目" min-width="120" align="right" fixed/>
      <el-table-column prop="platformId" label="推广平台" min-width="80" align="right" fixed>
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column v-for="n in 12" :key="n" :prop="n.toString()" :label="n+'月'" :formatter="formatMoney"
                       align="right" header-align="center" min-width="80"/>
      <el-table-column prop="total" :formatter="formatMoney" label="合计" align="right" header-align="center"
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
  import Api from '@/api/report/item-platform-month-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/item-platform-month-consumption'

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
    mounted () {
      this.$nextTick(() => {
        this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
      })
    },
    computed: {
      recombineList () {
        let list = []
        let firstData = this.table.list['data']
        let itemData = this.table.list['items']
        for (let key in firstData) {
          let itemArrayData = {}
//          if (Object.keys(firstData[key]).length === 0) {
//            continue
//          }
          let key1 = key.split('_')[0]
          itemArrayData['itemTitle'] = itemData[key1]['title']
          let total = 0
          for (let i = 1; i < 13; i++) {
            let a = this.search.condition.year * 100 + i
            if (firstData[key][a] !== undefined) {
              itemArrayData['platformId'] = firstData[key][a]['platformId']
              if (this.search.list[1].value === '总点数') {
                itemArrayData[i] = firstData[key][a]['costCoin'].toFixed(2)
              } else {
                itemArrayData[i] = firstData[key][a]['costMoney'].toFixed(2)
              }
              total += parseInt(itemArrayData[i])
            } else {
              itemArrayData[i] = 0
            }
            itemArrayData['total'] = total.toFixed(2)
          }
          list.push(itemArrayData)
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
