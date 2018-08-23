<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>账户分析</el-breadcrumb-item>
        <el-breadcrumb-item>项目搜索词分析(历史数据)</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"

      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="recombineList"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="90"></el-table-column>
      <el-table-column prop="title" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.title, index=1)">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="所属行业" min-width="125">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=3)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="125">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=2)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="searchKeyword" label="搜索词" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.searchKeyword, index=4)">{{scope.row.searchKeyword}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="impression" label="展现" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="click" label="点击" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="clickRatio" label="点击率" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="translation" label="转化" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="translationCost" label="转化成本" min-width="80" align="right" header-align="center"></el-table-column>
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
  import moment from 'moment'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/backup/backup-item-search-keyword-report'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
    components: {
      MsSearch
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    created () {
      let date = []
      date[0] = moment().subtract(2, 'days').format('YYYY-MM-DD')
      date[1] = date[0]

      this.search.condition.date = date

      this.search.list = [
        {
          name: 'date',
          title: '日期',
          type: CONDITION_TYPE.DATE,
          value: date,
          visible: true,
          config: {
            type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
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
          name: 'account',
          title: '帐户名',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
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
          name: 'keyword',
          title: '搜索词',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        },
        {
          name: 'dataGroup',
          title: '数据合并',
          placeholder: '--请选择数据合并方式--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: 1, label: '按 项目-搜索词 合并'},
              {value: 2, label: '按 项目-账户-搜索词 合并'},
              {value: 3, label: '按 搜索词 合并'}
            ]
          }
        },
        {
          name: 'orderBy',
          title: '排序',
          placeholder: '--请选择排序方式--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: 1, label: '按转化倒序'},
              {value: 2, label: '按转化成本倒序'},
              {value: 3, label: '按展现倒序'},
              {value: 4, label: '按点击倒序'},
              {value: 5, label: '按消费倒序'},
              {value: 6, label: '按搜索词顺序'}
            ]
          }
        }
      ]

      this.table.list = []
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
          list: [],
          pagination: {}
        }
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
    computed: {
      recombineList () {
        let list = []
        this.table.list.forEach(item => {
          let keyword = item
          if (this.search.condition.dataGroup === 1) {
            keyword.day = '_'
            keyword.industry = '_'
            keyword.accountTitle = '_'
          }
          if (this.search.condition.dataGroup === 2) {
            keyword.day = '_'
            keyword.industry = '_'
          }
          if (this.search.condition.dataGroup === 3) {
            keyword.day = '_'
            keyword.industry = '_'
            keyword.accountTitle = '_'
            keyword.title = '_'
          }
          if (keyword.title === undefined || keyword.title === '') {
            keyword.title = '_'
          }
          if (keyword.industry === undefined || keyword.industry === '') {
            keyword.industry = '_'
          }
          if (keyword.accountTitle === undefined) {
            keyword.accountTitle = '_'
          }
          if (keyword.click === undefined) {
            keyword.click = '_'
          }
          if (keyword.costCoin === undefined) {
            keyword.costCoin = '_'
          }
          if (keyword.impression === undefined) {
            keyword.impression = '_'
          }
          if (keyword.clickPrice === undefined) {
            keyword.clickPrice = '_'
          }
          if (keyword.translation === undefined) {
            keyword.translation = '_'
          }
          if (keyword.translationCost === undefined) {
            keyword.translationCost = '_'
          }
          if (keyword.clickRatio === undefined) {
            keyword.clickRatio = '_'
          } else {
            keyword.clickRatio = item.clickRatio.toFixed(2) + '%'
          }
          list.push(keyword)
        })

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

        let params = Object.assign({}, {page: this.table.pagination.page, pageSize: this.table.pagination.pageSize},
          this.search.condition)
        Api.list(params, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
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
          if (index === 1 || index === 2 || index === 3 || index === 4) {
            sums[index] = '_'
            return
          }
          let values = data.map(item => Number(item[column.property]))
          if (column.property === 'costCoin' || column.property === 'impression' || column.property === 'click' ||
            column.property === 'translation') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            }
          }
          if (column.property === 'costCoin') {
            sums[index] = sums[index].toFixed(2)
          }
          if (column.property === 'clickRatio') {
            sums[index] = sums[index - 2] === 0 ? '∞' : (sums[index - 1] / sums[index - 2] * 100).toFixed(2) + '%'
          }
          if (column.property === 'clickPrice') {
            sums[index] = sums[index - 2] === 0 ? '∞' : (sums[index - 4] / sums[index - 2]).toFixed(2)
          }
          if (column.property === 'translationCost') {
            sums[index] = sums[index - 1] === 0 ? '∞' : (sums[index - 6] / sums[index - 1]).toFixed(2)
          }
        })

        return sums
      },
      skip (a) {
        this.$router.push(a)
      }

    }
  }
</script>

<style scoped>

</style>
