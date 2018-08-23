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
        <el-breadcrumb-item>项目关键词分析</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
          <el-button type="primary" size="small" @click="download()">下载</el-button>
          <el-tooltip class="item" effect="dark" placement="right-start">
            <div slot="content">
            历史数据为：不包括当前月，从上月开始，三个月之前的所有有记录的数据<br/>
            数据量很大，查询速度不快
            </div>
          </el-tooltip>
        <el-button type="primary" size="small" @click="skip('/data/bid/backup-item-keywords')">查看历史数据</el-button>
      </el-button-group>

    </el-row>
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
      <el-table-column prop="platformTitle" label="平台" min-width="80"></el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="125">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=2)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="planTitle" label="推广计划" min-width="270"></el-table-column>
      <el-table-column prop="unitTitle" label="推广单元" min-width="150"></el-table-column>
      <el-table-column prop="keyword" label="关键词" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.keyword, index=4)">{{scope.row.keyword}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="keywordTag" label="关键词代码" min-width="125"></el-table-column>
      <el-table-column prop="keywordCategoryTitle" label="品类" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="searchCriteria(scope.row.keywordCategoryTitle, index=5)">{{scope.row.keywordCategoryTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="keywordNatureTitle" label="词性" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="searchCriteria(scope.row.keywordNatureTitle, index=6)">{{scope.row.keywordNatureTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="keywordMode" label="匹配模式" min-width="100"></el-table-column>
      <el-table-column prop="keywordPrice" label="出价" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="keywordPcScore" label="计算机质量度" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="keywordMobileScore" label="移动质量度" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="impression" label="展现" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="click" label="点击" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="clickRatio" label="点击率" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="translation" label="转化" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="translationCost" label="转化成本" min-width="80" align="right"
                       header-align="center"></el-table-column>
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
  import Api from '@/api/report/item-keyword'
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
          name: 'platformId',
          title: '所属平台',
          placeholder: '--请选择所属平台--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: false,
          config: {
            list: platforms
          }
        },
        {
          name: 'account',
          title: '帐户名',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
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
          name: 'keyword',
          title: '关键词',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        },
        {
          name: 'category',
          title: '品类',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
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
          name: 'industry',
          title: '行业',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
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
              {value: 5, label: '按消费倒序'}
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
      }
    },
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
    },
    computed: {
      recombineList () {
        // 获得 platform mapping
        let platforms = {}
        PLATFORM_LIST.forEach(item => {
          platforms[item.id] = item.title
        })

        let list = []
        this.table.list.forEach(item => {
          let keyword = item
          if (this.search.condition.dataGroup === 2) {
            keyword.day = '_'
            keyword.planTitle = '_'
            keyword.unitTitle = '_'
            keyword.keywordPrice = '_'
            keyword.keywordPcScore = '_'
            keyword.keywordMobileScore = '_'
          }
          if (keyword.keywordCategoryTitle === undefined) {
            keyword.keywordCategoryTitle = '_'
          }
          if (keyword.keywordNatureTitle === undefined) {
            keyword.keywordNatureTitle = '_'
          }
          if (item.hasOwnProperty('platformId')) {
            keyword.platformTitle = platforms[item.platformId] || '未知'
          }
          if (item.hasOwnProperty('clickRatio')) {
            keyword.clickRatio = item.clickRatio + '%'
          }
          if (this.search.condition.dataGroup === 2) {
            keyword.clickRatio = keyword.impression === 0 ? '∞' : (keyword.click / keyword.impression * 100).toFixed(2) + '%'
            keyword.clickPrice = keyword.click === 0 ? '∞' : (keyword.costCoin / keyword.click).toFixed(2)
            keyword.translationCost = keyword.translation === 0 ? '∞' : (keyword.costCoin / keyword.translation).toFixed(2)
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
      download () {
        let condition = ''
        if (this.search.condition.date[0] !== undefined && this.search.condition.date[1] !== undefined) {
          let startTime = 'startTime=' + this.search.condition.date[0]
          let endTime = 'endTime=' + this.search.condition.date[1]
          if (condition === '') {
            condition = '?' + startTime + '&' + endTime
          } else {
            condition = condition + '&' + startTime + '&' + endTime
          }
        }
        if (this.search.condition.platformId !== undefined) {
          let platformId = 'platformId=' + this.search.condition.platformId
          if (condition === '') {
            condition = '?' + platformId
          } else {
            condition = condition + '&' + platformId
          }
        }
        if (this.search.condition.account !== undefined) {
          let account = 'account=' + this.search.condition.account
          if (condition === '') {
            condition = '?' + account
          } else {
            condition = condition + '&' + account
          }
        }
        if (this.search.condition.itemTitle !== undefined) {
          let itemTitle = 'itemTitle=' + this.search.condition.itemTitle
          if (condition === '') {
            condition = '?' + itemTitle
          } else {
            condition = condition + '&' + itemTitle
          }
        }
        if (this.search.condition.keyword !== undefined) {
          let keyword = 'keyword=' + this.search.condition.keyword
          if (condition === '') {
            condition = '?' + keyword
          } else {
            condition = condition + '&' + keyword
          }
        }
        if (this.search.condition.category !== undefined) {
          let category = 'category=' + this.search.condition.category
          if (condition === '') {
            condition = '?' + category
          } else {
            condition = condition + '&' + category
          }
        }
        if (this.search.condition.nature !== undefined) {
          let nature = 'nature=' + this.search.condition.nature
          if (condition === '') {
            condition = '?' + nature
          } else {
            condition = condition + '&' + nature
          }
        }
        if (this.search.condition.industry !== undefined) {
          let industry = 'industry=' + this.search.condition.industry
          if (condition === '') {
            condition = '?' + industry
          } else {
            condition = condition + '&' + industry
          }
        }
        if (condition === '') {
          window.open('/rest/boss/report/keyword-reports/downLoads')
        } else {
          window.open('/rest/boss/report/keyword-reports/downLoads' + condition)
        }
      },
      getSummaries (param) {
        const {columns, data} = param
        const sums = []

        if (data.length === 0) {
          return sums
        }

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          if (index === 1 || index === 2 || index === 3 || index === 4 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9 || index === 10 || index === 11) {
            sums[index] = '_'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (column.property === 'costCoin' || column.property === 'impression' || column.property === 'click' ||
            column.property === 'translation' || column.property === 'keywordPrice' || column.property === 'keywordPcScore' ||
            column.property === 'keywordMobileScore') {
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
          if (column.property === 'costCoin' || column.property === 'keywordPrice') {
            if (sums[index] !== undefined) {
              sums[index] = sums[index].toFixed(2)
            } else {
              sums[index] = '_'
            }
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
  .item {
    padding: 7px 10px;
    margin: 4px;
  }

</style>
