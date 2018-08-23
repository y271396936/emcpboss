<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>运营报告</el-breadcrumb-item>
        <el-breadcrumb-item>留言数据报告</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"

      size="small" stripe border
      :data="recombineList"
      :fit="true">
      <el-table-column prop="publishDay" label="日期" min-width="85" :formatter="dataFormat" fixed></el-table-column>
      <el-table-column prop="regulator" label="运营" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.regulator, index=2)">{{scope.row.regulator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="channelTitle" label="推广渠道" min-width="80"></el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=4)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="clientId" label="留言客户端" min-width="70">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"/>
        </template>
      </el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=1)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="行业" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=5)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="genreTitle" label="留言类型" min-width="75"></el-table-column>
      <el-table-column prop="feedbackTotal" min-width="60" align="right" header-align="center"
                       :render-header="renderFeedbackTotalHeader"></el-table-column>
      <el-table-column prop="feedbackAmount" min-width="60" align="right" header-align="center"
                       :render-header="renderFeedbackAmountHeader"></el-table-column>
      <el-table-column prop="deleteFeedbackAmount" label="已删数" min-width="60" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="unreadFeedbackAmount" label="未读数" min-width="60" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="readFeedbackAmount" label="已读数" min-width="60" align="right"
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
  import MsDevice from '@/components/common/Device.vue'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/feedback/feedback-report'
  import UserApi from '@/api/system/system-user'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
    components: {
      MsDevice,
      MsSearch
    },
    created () {
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
          name: 'itemTitle',
          title: '项目名称',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'regulator',
          title: '运营专员',
          placeholder: '请输入关键字',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [],
            remote: {
              enabled: true,
              loading: false,
              method: (query) => {
                const myself = this.search.list[2]
                myself.config.remote.loading = true

                if (query === '' || query === undefined) {
                  myself.config.list = []
                  myself.config.remote.loading = false
                }
                UserApi.operatorLikeness({name: query}, response => {
                  let status = response.status || 0
                  let body = response.data.list || []
                  if (status >= 200 && status <= 204) {
                    let list = []
                    body.forEach(item => {
                      list.push({value: item, label: item})
                    })
                    myself.config.list = list
                  }
                  myself.config.remote.loading = false
                })
              }
            }
          }
        },
        {
          name: 'channelTitle',
          title: '推广渠道',
          placeholder: '--请选择--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: '百度竞价', label: '百度竞价'},
              {value: '百度网盟', label: '百度网盟'},
              {value: '360竞价', label: '360竞价'},
              {value: '搜狗竞价', label: '搜狗竞价'},
              {value: '神马竞价', label: '神马竞价'},
              {value: '百度信息流', label: '百度信息流'},
              {value: '360信息流', label: '360信息流'},
              {value: '今日头条信息流', label: '今日头条信息流'},
              {value: 'UC信息流', label: 'UC信息流'},
              {value: '搜狗银河', label: '搜狗银河'},
              {value: '广点通', label: '广点通'},
              {value: '一点资讯信息流', label: '一点资讯信息流'}
            ]
          }
        },
        {
          name: 'accountTitle',
          title: '账户',
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
        },
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
    computed: {
      recombineList () {
        let list = []
        this.table.list.forEach(item => {
          let channel = item
          list.push(channel)
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
      renderFeedbackTotalHeader (h, {column}) {
        return h(
          'el-tooltip',
          {
            attrs: {'effect': 'dark', 'content': '所有状态的留言数；包括测试留言，客户已删除及未删除留言', 'placement': 'top'}
          },
          [
            h('span', ['总数', h('icon', {attrs: {'name': 'question-circle', 'style': 'vertical-align: middle;'}})])
          ]
        )
      },
      renderFeedbackAmountHeader (h, {column}) {
        return h(
          'el-tooltip',
          {
            attrs: {'effect': 'dark', 'content': '不包含测试留言。有效数 = 未读 + 已读', 'placement': 'top'}
          },
          [
            h('span', ['有效数', h('icon', {attrs: {'name': 'question-circle', 'style': 'vertical-align: middle;'}})])
          ]
        )
      },
      dataFormat (row, column) {
        const data = row[column.property] + ''
        if (data === '' || data === undefined) {
          return ''
        } else if (data.length === 8) {
          let _data = data.substring(0, 4) + '-' + data.substring(4, 6) + '-' + data.substring(6, 8)
          return _data
        }
      }
    }
  }
</script>

<style scoped>

</style>
