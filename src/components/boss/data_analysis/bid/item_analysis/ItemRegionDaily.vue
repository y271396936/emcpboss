<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>项目分析</el-breadcrumb-item>
        <el-breadcrumb-item>项目地域日报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"

      size="small" stripe border
      :summary-method="getSeconedSummaries"
      show-summary
      :data="recombineList"
      :fit="true">
      <el-table-column prop="itemTitle" label="项目名称" min-width="80" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=1)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="province" label="省份" min-width="80" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.province, index=2)">{{scope.row.province}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="city" label="城市" min-width="130" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.city, index=3)">{{scope.row.city}}</a>
        </template>
      </el-table-column>
      <el-table-column v-for="n in 31" :key="n" :prop="n.toString()" :label='n+"日"' min-width="80" align="right" header-align="center">
      </el-table-column>
      <el-table-column prop="total" label="合计" min-width="80" align="right" header-align="center"></el-table-column>
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
  import Api from '@/api/report/item-region-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
  import moment from 'moment'

  const year = moment().format('YYYY')
  const lastMonth = moment().subtract(1, 'months').format('MM')
  export default {
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    components: {
      MsSearch
    },
    created () {
      this.search.condition.date = year + '-' + lastMonth
      this.search.condition.type = 1
      this.search.condition.showType = 1
      this.search.condition.dataGroup = 1
      this.search.list = [
        {
          name: 'date',
          title: '日期',
          type: CONDITION_TYPE.DATE,
          value: year + '-' + lastMonth,
          visible: true,
          config: {
            type: DATE_PICKER_SHOW_TYPE.MONTH,
            format: 'yyyy-MM',
            valueFormat: 'yyyy-MM'
          }
        },
        {
          name: 'itemTitle',
          title: '项目名称',
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
        },
        {
          name: 'showType',
          title: '数据类型',
          placeholder: '--请选择数据类型--',
          type: CONDITION_TYPE.SELECT,
          value: '消费',
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
        },
        {
          name: 'dataGroup',
          title: '合并方式',
          placeholder: '--请选择合并方式--',
          type: CONDITION_TYPE.SELECT,
          value: '省',
          visible: false,
          config: {
            list: [
              {value: 1, label: '省'},
              {value: 2, label: '省市'}
            ]
          }
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
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
    computed: {
      recombineList () {
        let list = []
        let mapData = this.table.list
        for (let key in mapData) {
          let arrayData = {}
          if (Object.keys(mapData[key]).length === 0) {
            continue
          }
          let total = 0
          for (let n = 1; n <= 31; n++) {
            let a = this.search.condition.date.split('-')[0] * 10000 + this.search.condition.date.split('-')[1] * 100 + n
            let searchValue = this.search.list[4].value
            if (mapData[key][a] !== undefined) {
              arrayData['itemTitle'] = mapData[key][a]['itemTitle']
              if (mapData[key][a]['province'] === '其它') {
                arrayData['province'] = '其它'
              } else if (mapData[key][a]['province'] === '') {
                arrayData['province'] = '-'
              } else {
                arrayData['province'] = mapData[key][a]['province']
              }
              if (mapData[key][a]['city'] === '其它' || mapData[key][a]['city'] === '') {
                arrayData['city'] = '-'
              } else {
                arrayData['city'] = mapData[key][a]['city']
              }
              if (searchValue === '展现') {
                arrayData[n] = mapData[key][a]['impression']
              } else if (searchValue === '消费') {
                arrayData[n] = mapData[key][a]['costCoin']
              } else if (searchValue === '点击') {
                arrayData[n] = mapData[key][a]['click']
              } else if (searchValue === '点击率') {
                arrayData[n] = mapData[key][a]['clickRatio'].toFixed(2) + '%'
              } else if (searchValue === '平均点击价格') {
                arrayData[n] = mapData[key][a]['clickPrice'].toFixed(2)
              } else if (searchValue === '转化') {
                arrayData[n] = mapData[key][a]['translation']
              } else if (searchValue === '转化成本') {
                arrayData[n] = mapData[key][a]['translationCost']
              } else {
                arrayData[n] = mapData[key][a]['costCoin']
              }
              total = +parseFloat(arrayData[n])
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
        this.search.condition.type = 1
        let search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.listDaily({search: search}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.list = body.map.data
            this.table.pagination = ResponseParse.singlepage(body.map.page)
//            if (this.table.pagination.totalRow === 0) {
//              this.tbHeight = ''
//            } else {
//              if (this.table.pagination.totalPage === this.table.pagination.page && Object.keys(this.table.list).length < 20) {
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
      getSeconedSummaries (param) {
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
          if (this.search.list[4].value === '展现' || this.search.list[4].value === '消费' ||
            this.search.list[4].value === '点击' || this.search.list[4].value === '转化') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              if (this.search.list[4].value === '展现' || this.search.list[4].value === '点击') {
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
