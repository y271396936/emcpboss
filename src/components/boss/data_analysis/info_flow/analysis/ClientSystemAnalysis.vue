<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>信息流</el-breadcrumb-item>
        <el-breadcrumb-item>账户分析</el-breadcrumb-item>
        <el-breadcrumb-item>设备/操作系统分析</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="table.list"
      :fit="true">
      <el-table-column prop="system" label="操作系统" min-width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.system ==='0'" class="ms-success">未识别</span>
          <span  v-else-if="scope.row.system ==='1'" class="ms-success">Android</span>
          <span  v-else-if="scope.row.system ==='2'" class="ms-success">iOS</span>
          <span  v-else-if="scope.row.system ==='5'" class="ms-success">WEB</span>
          <span v-else class="ms-gray">{{scope.row.system}}</span>
        </template>

      </el-table-column>
      <el-table-column prop="day" label="日期" min-width="90"></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=3)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="所属行业" min-width="125">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=7)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformTitle" label="渠道" min-width="80"></el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="125">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=2)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="impression" label="展现" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="click" label="点击" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="clickRatio" label="点击率" min-width="80" align="right"
                       header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickRatio === undefined ? 0 : scope.row.clickRatio.toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="80" align="right"
                       header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickPrice === undefined ? 0 : scope.row.clickPrice.toFixed(2)}}
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
  import moment from 'moment'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/info-flow'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '@/utils/constants'

  export default {
    components: {
      MsSearch
    },
    created () {
      let platforms = []
      PLATFORM_LIST.forEach(item => {
        platforms.push({
          value: item.id, label: item.title
        })
      })
      let date = []
      date[0] = moment().format('YYYY-MM-01')
      date[1] = moment().format('YYYY-MM-DD')
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
          name: 'platformId',
          title: '所属平台',
          placeholder: '--请选择所属平台--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: platforms
          }
        },
        {
          name: 'account',
          title: '帐户名',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
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
          name: 'industry',
          title: '行业',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
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
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
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
          if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5) {
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
      updateConditions (conditions) {
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      }
    }
  }
</script>

<style scoped>

  .right {
    margin-right: 35px;
    float: right;
    width: 60px;
  }

  .item {
    padding: 7px 10px;
    margin: 4px;
  }

</style>
