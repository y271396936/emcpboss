<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>行业分析</el-breadcrumb-item>
        <el-breadcrumb-item>行业词性月报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"

      size="small" stripe border show-summary
      :summary-method="getSummaries"
      :data="recombineList"
      :fit="true">
      <el-table-column prop="industry" label="行业" min-width="100" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=2)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="nature" label="词性" min-width="80" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.nature, index=3)">{{scope.row.nature}}</a>
        </template>
      </el-table-column>
      <el-table-column v-for="n in 12" :key="n" :prop="n.toString()" :label='n+"月"' min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="total" label="合计" min-width="140" align="right" header-align="center"></el-table-column>
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
  import Api from '@/api/report/industry-nature-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
    components: {
      MsSearch
    },
    created () {
      let year = new Date().getFullYear()

      this.search.condition.year = year
      this.search.condition.dataType = 1

      this.search.list = [
        {
          name: 'year',
          title: '年份',
          type: CONDITION_TYPE.DATE,
          value: year.toString(),
          visible: true,
          config: {
            type: DATE_PICKER_SHOW_TYPE.YEAR,
            format: 'yyyy',
            valueFormat: 'yyyy'
          }
        },
        {
          name: 'dataType',
          title: '数据类型',
          placeholder: '--请选择数据类型--',
          type: CONDITION_TYPE.SELECT,
          value: '消费',
          visible: true,
          config: {
            list: [
              {value: 1, label: '消费'},
              {value: 2, label: '转化'}
            ]
          }
        },
        {
          name: 'industry',
          title: '行业',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'keywordNatureTitle',
          title: '词性',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        }
      ]

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
      }
    },
    computed: {
      recombineList () {
        let field = ''
        if (this.search.list[1].value === '消费') {
          field = 'costCoin'
        } else {
          field = 'translation'
        }

        let list = []
        let data = this.table.list
        for (let key in data) {
          let rowData = {}
          rowData.industry = key.split('_')[0]
          rowData.nature = key.split('_')[1]
          rowData.total = 0
          for (let month = 1; month < 13; month++) {
            if (data[key][month] === undefined) {
              rowData[month] = 0
            } else {
              if (data[key][month][field] === undefined) {
                rowData[month] = 0
              } else {
                rowData[month] = data[key][month][field]
              }
            }
            rowData.total += rowData[month]
          }
          rowData.total = rowData.total.toFixed(2)
          list.push(rowData)
        }

        return list
      }
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true

        let search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.list = body.map.data
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
          } else {
            this.table.list = {}
            this.$message.error(response.data.error || '数据获取失败')
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
      getSummaries (param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (index === 1) {
            sums[index] = '-'
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
            sums[index] = sums[index].toFixed(2)
          } else {
            sums[index] = '-'
          }
        })
        return sums
      }
    }
  }
</script>

<style scoped>

</style>
