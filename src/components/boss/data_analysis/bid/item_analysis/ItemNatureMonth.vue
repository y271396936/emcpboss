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
        <el-breadcrumb-item>项目词性月报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="recombineList"
      :fit="true">
      <el-table-column prop="itemTitle" label="项目名称" min-width="80" fixed>
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="searchCriteria(scope.row.itemTitle, index=1)">
            {{scope.row.itemTitle}}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="keywordNatureTitle" label="词性" min-width="80" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.keywordNatureTitle, index=2)" v-if="scope.row.keywordNatureTitle === '其它'">行业词(品牌竞品)</a>
          <a href="javascript:;" @click="searchCriteria(scope.row.keywordNatureTitle, index=2)" v-else="scope.row.keywordNatureTitle">{{scope.row.keywordNatureTitle  }}</a>
        </template>
      </el-table-column>
      <template v-for="n in 12">
        <el-table-column :key="n" :prop="n.toString()"
                         :label='n+"月"' min-width="80"
                         align="right" header-align="center">
        </el-table-column>
        <el-table-column v-if="searchValue[0] && searchTitle"
                         :label="searchValue[1]+'占比'" :prop="n+'月'" width="70">

        </el-table-column>
      </template>
      <el-table-column prop="total"
                       label="合计" min-width="80"
                       align="right" header-align="center">
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
  import Api from '@/api/report/item-nature-consumption'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
    components: {
      MsSearch
    },
    created () {
      let year = new Date().getFullYear()

      this.search.condition.year = year
      this.search.condition.type = 1

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
          name: 'itemTitle',
          title: '项目名称',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'nature',
          title: '词性',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        },
        {
          name: 'type',
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
      searchValue () {
        let type = this.search.list[3].value
        if (type === '消费' || type === '点击' ||
          type === '展现' || type === '转化') {
          return [true, type]
        } else {
          return [false, type]
        }
      },
      searchTitle () {
        let type = this.search.list[1].value
        if (type === '' || type === null) {
          return false
        } else {
          return true
        }
      },
      recombineList () {
        let sum = this.getMonthList()
        let list = this.getTableList(sum)
        return list
      }
    },
    methods: {
      getMonthList () {
        /* 封装表格每列数据总和 */
        let mapData = this.table.list
        /* 获取下拉框的值 */
        let searchValue = this.search.list[3].value
        let sum = {}
        for (let key in mapData) {
          for (let n in mapData[key]) {
            if (sum[n] === undefined) {
              sum[n] = 0
            }
            let value = 0
            if (searchValue === '展现') {
              value = mapData[key][n]['impression']
            } else if (searchValue === '消费') {
              value = mapData[key][n]['costCoin']
            } else if (searchValue === '点击') {
              value = mapData[key][n]['click']
            } else if (searchValue === '转化') {
              value = mapData[key][n]['translation']
            } else {
              value = 0
            }
            sum[n] += value
          }
        }
        /* 功能和上面的一样，封装的思路不一样。
           使用这一种，对应的 getTableList() 方法要做对应修改
        let arrayMonth = []
        for (let n = 1; n < 13; n++) {
          let totle = 0
          for (let key in mapData) {
            if (mapData[key][n] !== undefined) {
              if (searchValue === '展现') {
                totle += mapData[key][n]['impression']
              } else if (searchValue === '消费') {
                totle += mapData[key][n]['costCoin']
              } else if (searchValue === '点击') {
                totle += mapData[key][n]['click']
              } else if (searchValue === '转化') {
                totle += mapData[key][n]['translation']
              } else {
                totle = 0
              }
            } else {
              totle = 0
            }
          }
          arrayMonth.push(totle)
        }
        */
        return sum
      },
      getTableList (sum) {
        /* 封装表格每列数据段：  itemTitle   keywordNatureTitle   1~12月份   total */
        let list = []
        let mapData = this.table.list
        /* 获取下拉框的值 */
        let searchValue = this.search.list[3].value
        for (let key in mapData) {
          /* 定义表格每行[每个词性]数据的容器 */
          let arrayData = {}
          /* 提高外层循环效率 */
          if (Object.keys(mapData[key]).length === 0) {
            continue
          }
          let total = 0
          for (let n = 1; n < 13; n++) {  // 循环每次词性下所有月份的数据
            let a = n
            /* mapData 是一个数据集合。通过key获取对应词的: 多个月份的数据，所以对应一个月就是: mapData[key][a] */
            if (mapData[key][a] !== undefined) {  // 处理不为空的月份数据
              arrayData['itemTitle'] = mapData[key][a]['itemTitle']
              arrayData['keywordNatureTitle'] = mapData[key][a]['keywordNatureTitle']
              if (searchValue === '展现') {
                /* 某个词某个月下的展现数据 */
                arrayData[n] = mapData[key][a]['impression']
                /* 某个词某个月下的展现占比 */
                arrayData[n + '月'] = ((arrayData[n] / sum[a]) * 100).toFixed(2) + '%'
              } else if (searchValue === '消费') {
                arrayData[n] = mapData[key][a]['costCoin']
                arrayData[n + '月'] = ((arrayData[n] / sum[a]) * 100).toFixed(2) + '%'
              } else if (searchValue === '点击') {
                arrayData[n] = mapData[key][a]['click']
                arrayData[n + '月'] = ((arrayData[n] / sum[a]) * 100).toFixed(2) + '%'
              } else if (searchValue === '点击率') {
                arrayData[n] = mapData[key][a]['clickRatio'] + '%'
              } else if (searchValue === '点击价格') {
                arrayData[n] = mapData[key][a]['clickPrice']
              } else if (searchValue === '转化') {
                arrayData[n] = mapData[key][a]['translation']
                arrayData[n + '月'] = ((arrayData[n] / sum[a]) * 100).toFixed(2) + '%'
              } else if (searchValue === '转化成本') {
                arrayData[n] = mapData[key][a]['translationCost']
              } else {
                arrayData[n] = mapData[key][a]['costCoin']
              }
              /* 计算一个词性所有月份[一行]总数据 */
              total += parseFloat(arrayData[n])
            } else {  // 处理不存在的月份数据
              if (searchValue === '点击率') {
                arrayData[n] = 0.00.toFixed(2) + '%'
              } else {
                arrayData[n] = 0
                arrayData[n + '月'] = 0.00.toFixed(2) + '%'
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
          /* 封装好每行的数据 arrayData： { 1~12月份,  itemTitle,   keywordNatureTitle,   total }  */
          list.push(arrayData)
        }
        return list
      },
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true

        let search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.listMonth({search: search}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.list = body.map.data
            this.table.pagination = ResponseParse.singlepage(body.map.page)
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
            if (this.search.list[3].value === '展现' || this.search.list[3].value === '点击') {
              sums[index] = sums[index].toFixed(0)
            } else {
              sums[index] = sums[index].toFixed(2)
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
