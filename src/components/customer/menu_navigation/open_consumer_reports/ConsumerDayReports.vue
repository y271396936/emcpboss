<template>
  <div class="ms-list">
    <ms-search :data="search.list" @click="updateConditions"></ms-search>
    <el-table
      class="element-table"
      size="small" stripe border
      :data="recombineList"
      :show-summary="true"
      :highlight-current-row="true"
      :fit="true">
      <el-table-column prop="itemTitle" label="项目" min-width="100" fixed="left"></el-table-column>
      <!--<el-table-column prop="name" :label='search.list[0].value +"年 项目消费月报"' class-name="el-table-column-left">-->
      <el-table-column
        v-for="n in 31"
        :key="n"
        :prop="n.toString()"
        :label='n+"日"'
        min-width="80" align="right" header-align="center">
      </el-table-column>
      <!--</el-table-column>-->
      <el-table-column prop="total" label="合计" min-width="80" fixed="right" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.total !== '' && scope.row.total !== undefined">{{ Number(scope.row.total).toFixed(2)}}</span>
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
  import MsSearch from '@/components/common/Search.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import Api from '@/api/customer/consumer-day-reports'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION1 } from '@/models/customer/consumer-day-reports'
  import StatisticsApi from '@/api/customer/desktop/statistics'
  import moment from 'moment'

  const year = new Date().getFullYear()
  const lastMonth = moment().subtract(1, 'months').format('MM')

  export default {
    components: {
      MsSearch,
      MsConfirmButton
    },
    data () {
      return {
        search: {
          list: [],
          condition: {
            year: '',
            month: ''
          }
        },
        table: {
          loading: true,
          list: [],
          pagination: {}
        },
        titleName: {},
        collections: []
      }
    },
    created () {
      this.search.list = SEARCH_CONDITION1
      this.search.condition.year = year
      this.search.condition.month = lastMonth
      this.search.condition.dataType = 1
      this.table.list = []
      this.requestList()
      this.customerItems()
    },
    computed: {
      recombineList () {
        let list = []
        let items = this.table.list.list
        if (items !== undefined) {
          for (let i = 0; i < items.length; i++) {
            let arrayData = {}
            arrayData['itemTitle'] = items[i].title
            let dataType = this.search.condition.dataType
            arrayData.total = 0
            for (let j = 1; j < 32; j++) {
              let key = this.search.condition.year * 10000 + this.search.condition.month * 100 + j
              if (this.table.list.map.dailyDataMap[key] !== undefined) {
                if (this.table.list.map.dailyDataMap[key][items[i].title + '_' + items[i].id] !== undefined) {
                  if (dataType === 1) {
                    arrayData[j.toString()] = this.table.list.map.dailyDataMap[key][items[i].title + '_' + items[i].id]['costCoin']
                    arrayData.total += arrayData[j.toString()]
                  } else if (dataType === 2) {
                    arrayData[j.toString()] = this.table.list.map.dailyDataMap[key][items[i].title + '_' + items[i].id]['costMoney']
                    arrayData.total += arrayData[j.toString()]
                  } else if (dataType === 3) {
                    arrayData[j.toString()] = this.table.list.map.dailyDataMap[key][items[i].title + '_' + items[i].id]['serviceCoin']
                    arrayData.total += arrayData[j.toString()]
                  } else if (dataType === 4) {
                    arrayData[j.toString()] = this.table.list.map.dailyDataMap[key][items[i].title + '_' + items[i].id]['cpCostCoin']
                    arrayData.total += arrayData[j.toString()]
                  } else if (dataType === 5) {
                    arrayData[j.toString()] = this.table.list.map.dailyDataMap[key][items[i].title + '_' + items[i].id]['cpCostMoney']
                    arrayData.total += arrayData[j.toString()]
                  } else if (dataType === 6) {
                    arrayData[j.toString()] = this.table.list.map.dailyDataMap[key][items[i].title + '_' + items[i].id]['jpCostCoin']
                    arrayData.total += arrayData[j.toString()]
                  } else if (dataType === 7) {
                    arrayData[j.toString()] = this.table.list.map.dailyDataMap[key][items[i].title + '_' + items[i].id]['jpCostMoney']
                    arrayData.total += arrayData[j.toString()]
                  }
                } else {
                  arrayData[j.toString()] = 0
                }
              } else {
                arrayData[j.toString()] = 0
              }
            }
            arrayData.total = arrayData.total.toFixed(2)
            list.push(arrayData)
          }
        }
        return list
      }
    },
    methods: {
      customerItems () {
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        StatisticsApi.customerItem({search: search}, response => {
          let status = response.status || 0
          let data = response.data || []
          if (status === 200 || status === 204) {
            this.titleName = data
            this.search.list[0].config.list = []
            let project = []
            this.titleName.forEach(item => {
              if (item.status === 1) {
                project.unshift({value: item.id, label: item.title})
              } else {
                project.push({value: item.id, label: item.title, disabled: true})
              }
            })
            this.search.list[2].config.list = project
          } else {
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      requestList () {
        this.table.loading = true
        if (this.search.condition.date) {
          this.search.condition.year = this.search.condition.date.split('-')[0]
          this.search.condition.month = this.search.condition.date.split('-')[1]
        }
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data[0] || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.table.list = []
            this.$message.error(body.error)
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .element-table td {
    height: 37px;
  }
</style>
