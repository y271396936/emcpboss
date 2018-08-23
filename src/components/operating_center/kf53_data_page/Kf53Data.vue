<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>53数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>53KF数据列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table v-loading="table.loading" size="small" stripe border :data="this.table.list" :summary-method="getSummary"
              show-summary :fit="true">
      <el-table-column prop="id" label="ID" min-width="120" >
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.id, index=1)">{{scope.row.id}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="day" label="日期" min-width="100"></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100" >
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=4)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="平台" min-width="80">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="100" >
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=5)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="pageUrl" label="咨询页面URL" min-width="500" ></el-table-column>
      <el-table-column prop="ipProvince" label="省会" min-width="80" ></el-table-column>
      <el-table-column prop="ipCity" label="城市" min-width="150" ></el-table-column>
      <el-table-column prop="ipIsp" label="IP种类" min-width="80" ></el-table-column>
      <el-table-column prop="ipIspRemark" label="IP种类用途" min-width="200" ></el-table-column>
      <el-table-column prop="referrer" label="来源" min-width="150" ></el-table-column>
      <el-table-column prop="referrerKeyword" label="来源关键词" min-width="150" ></el-table-column>
      <el-table-column prop="chatCount" label="聊天条数" min-width="80" ></el-table-column>
      <el-table-column prop="visitTime" label="访问时间" min-width="180" ></el-table-column>
      <el-table-column prop="hasPhone" label="是否留有电话" min-width="180" >
        <template slot-scope="scope">
          <span v-if="scope.row.hasPhone === 1" class="ms-success">是</span>
          <span v-else-if="scope.row.hasPhone === 0" class="ms-danger">否</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>

      <el-table-column label="操作"  min-width="100">
        <template slot-scope="scope">
          <router-link :to="{path:'/import-data/kf53-data-importLog',query:{id:scope.row.importLogId}}" target="_blank">导入日志
          </router-link>
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
      @current-change="handleCurrentChange"/>

  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/kf53-chat-record'
  import { SEARCH_CONDITION } from '@/models/platform/kf53-chat-record'
  import { PLATFORM_LIST } from '@/utils/constants'
  import ResponseParse from '@/utils/response-parse'
  import moment from 'moment'
  import ChannelApi from '@/api/platform/channel'
  import MsPlatform from '@/components/common/Platform.vue'

  export default {
    components: {
      MsSearch,
      MsSlide,
      MsPlatform
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
        row: {
          edit: {
            index: 0
          }
        }
      }
    },
    created () {
      let date = []
      date[0] = moment().format('YYYY-MM-01')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.list = SEARCH_CONDITION
      if (this.$route.query.importLogId !== undefined) {
        this.search.condition.importLogId = this.$route.query.importLogId
        this.search.list[1].value = this.$route.query.importLogId
      }
      this.table.loading = true
      this.table.list = []

      this.requestList()
    },
    computed: {
      platforms () {
        return PLATFORM_LIST
      }
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true

        const platforms = {}
        PLATFORM_LIST.forEach(item => {
          platforms[item.id] = item.title
        })
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            body.forEach(item => {
              // 获取区域
              if (item.ipProvince === '') {
                item['ipProvince'] = '_'
              }
              if (item.ipCity === '') {
                item['ipCity'] = '_'
              }
              if (item.ipIsp === '') {
                item['ipIsp'] = '_'
              }
              if (item.ipIspRemark === '') {
                item['ipIspRemark'] = '_'
              }
            })
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.table.list = []
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
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
      },
      getSummary (param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }
          if (index === 1 || index === 3 || index === 13) {
            sums[index] = '-'
            return
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
            sums[index] += ' '
          } else {
            sums[index] = '-'
          }
        })
        return sums
      },
      platformChange (id) {
        if (id > 0) {
          // 获得渠道列表
          this.remote.channel.loading = true
          this.row.form.channelId = ''
          ChannelApi.list({platformId: id, pageSize: 100}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.remote.channel.list = body
            }
            this.remote.channel.loading = false
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
