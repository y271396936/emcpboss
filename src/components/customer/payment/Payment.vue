<template>
  <div class="ms-list">
    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <el-table
      v-loading="table.loading"
      class="element-table"
      size="small" stripe border
      :data="table.list"
      :highlight-current-row="true"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" fixed></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100"></el-table-column>
      <el-table-column prop="money" label="充值金额" :formatter="dataFormat" min-width="100" align="right" header-align="center"></el-table-column>
      <el-table-column prop="payTime" label="到账日期" min-width="140"></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="100"></el-table-column>
      <el-table-column prop="publishTime" label="录入日期" min-width="140"></el-table-column>
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
  import StatisticsApi from '@/api/customer/desktop/statistics'
  import Api from '@/api/customer/payment'
  import { SEARCH_CONDITION } from '@/models/customer/payment'
  import ResponseParse from '@/utils/response-parse'

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
        titleName: {},
        table: {
          list: [],
          pagination: {},
          loading: true
        }
      }
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.list = []
      this.requestList()
      this.customerItems()
    },
    methods: {
      customerItems () {
        const search = Object.assign({}, this.pagination, this.search.condition)
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
            this.search.list[0].config.list = project
          } else {
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      requestList () {
        this.table.loading = true
        const search = Object.assign({}, this.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
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
      updateConditions (conditions) {
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      dataFormat (row, column) {
        const data = row[column.property] + ''
        if (data === '' || data === undefined) {
          return ''
        } else {
          const pattern = /(?=((?!\b)\d{3})+$)/g
          return (data.replace(pattern, ',')) + ' 元'
        }
      }
    }
  }
</script>

<style lang="scss">
  .ms-list{
    margin-top: 10px;
  }
  .element-table th {
    height: 48px;
  }

  .element-table td {
    height: 37px;
  }
</style>
