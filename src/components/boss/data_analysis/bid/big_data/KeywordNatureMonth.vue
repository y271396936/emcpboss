<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>大数据汇总</el-breadcrumb-item>
        <el-breadcrumb-item>词性月报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--@clickH="caculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border

      :data="recombineList"
      show-summary
      :summary-method="getSummaries"
      :fit="true">
      <el-table-column prop="keywordNatureTitle" label="词性" min-width="60" fixed/>
      <el-table-column v-for="n in 12" :key="n" :prop="n.toString()" :label="n+'月'" min-width="80" align="right" header-align="center"/>
      <el-table-column prop="total" label="合计" min-width="60" align="right" header-align="center"/>
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
  import Api from '@/api/report/keyword-nature-consumption'
  import ResponseParse from '@/utils/response-parse'
  import {
    CONDITION_TYPE, DATE_PICKER_SHOW_TYPE,
    PLATFORM_LIST
  } from '@/utils/constants'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = [
        {
          name: 'year',
          title: '年份',
          type: CONDITION_TYPE.DATE,
          value: new Date().getFullYear().toString(),
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
          value: '展现',
          visible: true,
          config: {
            list: [
              {value: 1, label: '展现'},
              {value: 2, label: '消费'},
              {value: 3, label: '点击'},
              {value: 4, label: '点击率'},
              {value: 5, label: '平均点击价格'},
              {value: 6, label: '转化'},
              {value: 7, label: '转化成本'}
            ]
          }
        }
      ]

      this.search.condition.year = new Date().getFullYear()
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
        },
        row: {
          edit: {
            enabled: false,
            index: 0
          }
        },
        lastDay: 0,
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    computed: {
      recombineList () {
        // 定义原始变量
        let platforms = {}
        PLATFORM_LIST.forEach(item => {
          platforms[item.id] = item.title
        })
        let list = []
        let mapData = this.table.list['dataMap']
        // 获取项目名 和 消费点数 和消费金额
        for (let key in mapData) {
          let arrayData = {}
          if (Object.keys(mapData[key]).length === 0) {
            continue
          }
          let total = 0
          for (let n = 1; n < 13; n++) {
            let a = n
            let searchValue = this.search.list[1].value
            if (mapData[key][a] !== undefined) {
              arrayData['keywordNatureTitle'] = mapData[key][a]['keywordNatureTitle']
              if (searchValue === '展现') {
                arrayData[n] = mapData[key][a]['impression']
              } else if (searchValue === '消费') {
                arrayData[n] = mapData[key][a]['costCoin']
              } else if (searchValue === '点击') {
                arrayData[n] = mapData[key][a]['click']
              } else if (searchValue === '点击率') {
                arrayData[n] = mapData[key][a]['clickRatio'].toFixed(2) + '%'
              } else if (searchValue === '点击价格') {
                arrayData[n] = mapData[key][a]['clickPrice']
              } else if (searchValue === '转化') {
                arrayData[n] = mapData[key][a]['translation']
              } else {
                arrayData[n] = mapData[key][a]['translationCost']
              }
              total += parseFloat(arrayData[n])
            } else {
              if (searchValue === '点击率') {
                arrayData[n] = 0.00.toFixed(2) + '%'
              } else {
                arrayData[n] = 0
              }
            }
            if (searchValue === '点击率') {
              arrayData['total'] = total.toFixed(2) + '%'
            } else if (searchValue === '展现' || searchValue === '点击') {
              arrayData['total'] = total
            } else {
              arrayData['total'] = total.toFixed(2)
            }
          }
          list.push(arrayData)
        }
        return list
      }
    },
    methods: {
      caculatedHeight () {
        this.$nextTick(function () {
          this.$set(this, 'tbHeight', this.PHeight - this.$refs.msSearch.clientHeight)
        })
      },
      requestList () {
        this.table.loading = true
        let search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.listMonth({search: search}, response => {
          let status = response.status || 0
          let body = response.data.map || {}
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.singlepage(body.page)
//            if (this.table.pagination.totalRow === 0) {
//              this.tbHeight = ''
//            } else {
//              if (this.table.pagination.totalPage === this.table.pagination.page && Object.keys(this.table.list.dataMap).length < 15) {
//                this.tbHeight = ''
//              } else {
//                this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//              }
//            }
          } else {
//            this.tbHeight = ''
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
        let {columns, data} = param
        let sums = []

        if (data.length === 0) {
          return sums
        }

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (index === 1) {
            sums[index] = '-'
          }
          if (index === 2) {
            sums[index] = '-'
          }
          let values = data.map(item => Number(item[column.property]))
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
              if (this.search.list[1].value === '展现' || this.search.list[1].value === '点击') {
                sums[index] = sums[index].toFixed(0)
              } else {
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
