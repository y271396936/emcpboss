<template>
  <div class="ms-list">
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"></ms-search>
    </div>
    <el-table
      class="element-table"
      size="small" stripe border
      :data="recombineList"
      :show-summary="true"
      :highlight-current-row="true"
      :fit="true">
      <el-table-column prop="itemTitle" label="项目" min-width="100" fixed></el-table-column>
      <!--<el-table-column prop="name" :label='search.list[0].value +"年 项目消费月报"' class-name="el-table-column-left">-->
      <el-table-column
        v-for="(col, index) in collections"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        min-width="80" align="right" header-align="center">
      </el-table-column>
      <!--</el-table-column>-->
      <el-table-column prop="total" label="合计" min-width="80" align="right" header-align="center">
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
  import ResponseParse from '@/utils/response-parse'
  import Api from '@/api/customer/consumer-month-reports'
  import { SEARCH_CONDITION1 } from '@/models/customer/consumer-month-reports'
  import moment from 'moment'
  import StatisticsApi from '@/api/customer/desktop/statistics'

  const date = new Date()
  const year = '' + date.getFullYear()
  export default {
    components: {
      MsSearch,
      MsConfirmButton
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
        },
        titleName: {},
        collections: []
      }
    },
    created () {
      this.search.list = SEARCH_CONDITION1
      this.search.condition.year = new Date().getFullYear()
      this.search.condition.dataType = 1
      this.table.list = []
      this.requestList()
      this.customerItems()
    },
    computed: {
      recombineList () {
        // 动态列头数据
        this.collections = []
        for (let i = 1; i <= 12; i++) {
          let keyYear = undefined === this.search.list[0].value ? year : this.search.list[0].value
          let _month = keyYear * 100 + i + ''
          let person = {}
          person.prop = _month
          person.label = i + '月'
          this.collections.push(person)
        }

        let list = []
        let $data = this.table.list['month']
        for (let key in $data) {
          if (Object.keys($data[key]).length === 0) {
            continue
          }
          let arrayData = {}
          // 获取项目名称
          let $items = this.table.list['items']
          for (let item in $items) {
            if (key === item) {
              arrayData.itemTitle = $items[item]['title']
            }
          }
          // 获取数据类型
          let dataType = this.search.condition.dataType
          arrayData.total = 0
          for (let i = 0; i < 12; i++) {
            let p = this.collections[i].prop
            if (dataType === 1) {
              arrayData[p] = ($data[key][p] === undefined ? undefined : $data[key][p]['costCoin']) === undefined ? 0 : $data[key][p]['costCoin']
              arrayData.total += arrayData[p]
            } else if (dataType === 2) {
              arrayData[p] = ($data[key][p] === undefined ? undefined : $data[key][p]['costMoney']) === undefined ? 0 : $data[key][p]['costMoney']
              arrayData.total += arrayData[p]
            } else if (dataType === 3) {
              arrayData[p] = ($data[key][p] === undefined ? undefined : $data[key][p]['serviceCoin']) === undefined ? 0 : $data[key][p]['serviceCoin']
              arrayData.total += arrayData[p]
            } else if (dataType === 4) {
              arrayData[p] = ($data[key][p] === undefined ? undefined : $data[key][p]['cpCostCoin']) === undefined ? 0 : $data[key][p]['cpCostCoin']
              arrayData.total += arrayData[p]
            } else if (dataType === 5) {
              arrayData[p] = ($data[key][p] === undefined ? undefined : $data[key][p]['cpCostMoney']) === undefined ? 0 : $data[key][p]['cpCostMoney']
              arrayData.total += arrayData[p]
            } else if (dataType === 6) {
              arrayData[p] = ($data[key][p] === undefined ? undefined : $data[key][p]['jpCostCoin']) === undefined ? 0 : $data[key][p]['jpCostCoin']
              arrayData.total += arrayData[p]
            } else if (dataType === 7) {
              arrayData[p] = ($data[key][p] === undefined ? undefined : $data[key][p]['jpCostMoney']) === undefined ? 0 : $data[key][p]['jpCostMoney']
              arrayData.total += arrayData[p]
            } else {
              arrayData[p] = ($data[key][p] === undefined ? undefined : $data[key][p]['costCoin']) === undefined ? 0 : $data[key][p]['costCoin']
              arrayData.total += arrayData[p]
            }
          }
          list.push(arrayData)
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

        let search = Object.assign({}, this.table.pagination, this.search.condition)
        if (search.year === undefined) {
          search.year = moment().format('YYYY')
        }
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data[0].map || {}
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.table.list = []
            this.$message.error(body.error || '获取数据失败')
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

  /*覆盖样式*/
  .el-table-column-left {
    text-align: left !important;
  }
</style>
