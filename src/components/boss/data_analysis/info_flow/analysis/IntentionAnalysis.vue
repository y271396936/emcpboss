<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>信息流</el-breadcrumb-item>
        <el-breadcrumb-item>账户分析</el-breadcrumb-item>
        <el-breadcrumb-item>意图词分析列表</el-breadcrumb-item>
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
      <el-table-column prop="day" label="日期" min-width="80" fixed></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=5)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="渠道" min-width="80"></el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="120">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=4)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="行业" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=3)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="intentionWord" label="意图词" min-width="80"></el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="80" align="right" header-align="center">
      </el-table-column>
      <el-table-column prop="impression" label="展现" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="click" label="点击" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="clickRatio" label="点击率" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.costCoin === undefined ? 0 : scope.row.costCoin}}
        </template>
      </el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="90" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickPrice === undefined ? 0 : scope.row.clickPrice.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="impressionCostCoin" label="展现消费" min-width="80" align="right" header-align="center" v-if='show'>
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
//  import moment from 'moment'
  import MsPlatform from '@/components/common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/report/intention-word'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/intention-word'

  export default {
    components: {
      MsSearch,
      MsPlatform,
      MsSlide
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
        show: false,
        log: {}
      }
    },

    created () {
      this.search.list = SEARCH_CONDITION
      this.table.list = []
      this.requestList()
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.IntentionAnalysisList({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
              this.tbHeight = ''
            } else {
              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
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
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.log = {}
      }
    }
  }
</script>

<style scoped>

</style>
