<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>竞价+信息流</el-breadcrumb-item>
        <el-breadcrumb-item>行业分析</el-breadcrumb-item>
        <el-breadcrumb-item>行业地域月报</el-breadcrumb-item>
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
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=3)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="省份" min-width="80" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.province, index=4)">{{scope.row.province}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" min-width="100" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.city, index=5)">{{scope.row.city}}</a>
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
  import Api from '@/api/report/industry-region-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
    components: {
      MsSearch
    },
    created () {
      let year = new Date().getFullYear()

      this.search.condition.year = year
      this.search.condition.dataType = 2
      this.search.condition.dataGroup = 1

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
              {value: 1, label: '展现'},
              {value: 2, label: '消费'},
              {value: 3, label: '转化'},
              {value: 4, label: '点击'},
              {value: 5, label: '点击率'},
              {value: 6, label: '平均点击价格'},
              {value: 7, label: '转化'},
              {value: 8, label: '转化成本'}
            ]
          }
        },
        {
          name: 'dataGroup',
          title: '分类方式',
          placeholder: '--请选择分类方式--',
          type: CONDITION_TYPE.SELECT,
          value: '根据省',
          visible: true,
          config: {
            list: [
              {value: 1, label: '根据省'},
              {value: 2, label: '根据市'}
            ]
          }
        },
        {
          name: 'industry',
          title: '行业',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        },
        {
          name: 'province',
          title: '省份',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        },
        {
          name: 'city',
          title: '城市',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
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
        let dataType = this.search.list[1].value
        let list = []
        if (Object.keys(this.table.list).length > 0) {
          let field = ''
          if (dataType === '展现') {
            field = 'impression'
          }
          if (dataType === '消费') {
            field = 'costCoin'
          }
          if (dataType === '转化') {
            field = 'translation'
          }
          if (dataType === '点击') {
            field = 'click'
          }
          if (dataType === '点击率') {
            field = 'clickRatio'
          }
          if (dataType === '平均点击价格') {
            field = 'clickPrice'
          }
          if (dataType === '转化') {
            field = 'translation'
          }
          if (dataType === '转化成本') {
            field = 'translationCost'
          }

          let data = this.table.list
          for (let key in data) {
            if (Object.keys(data[key]).length === 0) {
              continue
            }
            let rowData = {}
            rowData.industry = key.split('_')[0]
            rowData.province = key.split('_')[1]
            if (this.search.condition.dataGroup === 2) {
              rowData.city = key.split('_')[2]
            } else {
              rowData.city = '-'
            }
            let total = 0
            let total1 = 0
            let total2 = 0
            for (let month = 1; month < 13; month++) {
              if (data[key][month] === undefined) {
                rowData[month] = 0
              } else {
                if (field === 'clickRatio') {
                  total1 += parseFloat(data[key][month]['click'])
                  total2 += parseFloat(data[key][month]['impression'])
                  rowData[month] = data[key][month][field].toFixed(2) + '%'
                } else if (field === 'clickPrice') {
                  total1 += parseFloat(data[key][month]['costCoin'])
                  total2 += parseFloat(data[key][month]['click'])
                  rowData[month] = data[key][month][field].toFixed(2)
                } else if (field === 'translationCost') {
                  total1 += parseFloat(data[key][month]['costCoin'])
                  total2 += parseFloat(data[key][month]['translation'])
                  rowData[month] = data[key][month][field].toFixed(2)
                } else {
                  rowData[month] = data[key][month][field]
                }
              }
              total += rowData[month]
            }
            if (field === 'clickRatio') {
              rowData['total'] = total2 === 0 ? 0 : (total1 * 100 / total2).toFixed(2) + '%'
            } else if (field === 'clickPrice' || field === 'translationCost') {
              rowData['total'] = total2 === 0 ? 0 : (total1 / total2).toFixed(2)
            } else if (field === 'costCoin') {
              rowData['total'] = total.toFixed(2)
            } else {
              rowData['total'] = total
            }
            list.push(rowData)
          }
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
        let params = Object.assign({}, {page: this.table.pagination.page, pageSize: this.table.pagination.pageSize},
          this.search.condition)
        Api.list({search: params}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.list = body.map.data
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
          } else {
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
      getSummaries (param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (index === 1 || index === 2) {
            sums[index] = '-'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (this.search.list[1].value === '展现' || this.search.list[1].value === '消费' ||
            this.search.list[1].value === '点击' || this.search.list[1].value === '转化') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              if (this.search.list[1].value === '消费') {
                sums[index] = sums[index].toFixed(2)
              }
            } else {
              sums[index] = '-'
            }
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
