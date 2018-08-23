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
        <el-breadcrumb-item>项目搜索词分析</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
          <el-button type="primary" size="small" @click="download()">下载</el-button>
        <el-tooltip class="item" effect="dark" placement="right-start">
          <div slot="content">
            历史数据为：不包括当前月，从上月开始，三个月之前的所有有记录的数据<br/>
            数据量很大，查询速度不快
          </div>
        </el-tooltip>
        <el-button type="primary" size="small"  @click="skip('/data/bid/backup-item-search-keywords')">查看历史数据</el-button>
      </el-button-group>
    </el-row>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="table.list"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="90">
        <template slot-scope="scope">
          <span v-if="search.condition.dataGroup === undefined">{{scope.row.day}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <span v-if="search.condition.dataGroup !== 3"><a href="javascript:;"
                                                                @click="searchCriteria(scope.row.title, index=1)">{{scope.row.title}}</a></span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="所属行业" min-width="125">
        <template slot-scope="scope">
          <span v-if="search.condition.dataGroup === undefined"><a href="javascript:;"
                                                                        @click="searchCriteria(scope.row.industry, index=3)">{{scope.row.industry}}</a></span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="125">
        <template slot-scope="scope">
          <span v-if="search.condition.dataGroup === undefined || search.condition.dataGroup === 2"><a
            href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=2)">{{scope.row.accountTitle}}</a></span>
          <span v-else>-</span>
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
      <el-table-column prop="clickRatio" label="点击率" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickRatio.toFixed(2)}}%
        </template>
      </el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickPrice.toFixed(2)}}
        </template>
      </el-table-column>
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
  import Api from '@/api/report/item-search-keyword'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
    components: {
      MsSearch
    },
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
          name: 'title',
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
      },
      download () {
        let search = ''
        let flag = true
        this.search.list.forEach(item => {
          let text = item.name
          let value = item.value
          if (text === 'title' && value !== '') {
            flag = true
          }
          if (item.type === 'select') {
            if (item.hasOwnProperty('config') && item.config.hasOwnProperty('list')) {
              item.config.list.forEach(function (option) {
                if (option.label === item.value) {
                  value = option.value
                }
              })
            }
          }
          if (search === '') {
            if (value !== '') {
              if (text === 'date') {
                let v = value
                search = '?startTime=' + v[0] + '&endTime=' + v[1]
              } else {
                search = '?' + text + '=' + value
              }
            }
          } else {
            if (value !== '') {
              if (text === 'date') {
                let v = value
                search += '&startTime=' + v[0] + '&endTime=' + v[1]
              } else {
                search += '&' + text + '=' + value
              }
            }
          }
        })
        if (!flag) {
          this.$message.error('项目名称不能为空')
          return
        }
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        window.open('/rest/boss/report/search-keyword-consumptions/export' + search)
        loading.close()
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
