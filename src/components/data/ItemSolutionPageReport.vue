<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>渠道设备页面效果报告</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"

      size="small" stripe border
      :data="table.list"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="80" :formatter="dataFormat" fixed></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=1)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="平台" min-width="60">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="clientId" label="客户端" min-width="60">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"/>
        </template>
      </el-table-column>
      <el-table-column prop="pv" label="页面PV数" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="uv" label="页面UV数" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="ip" label="页面IP数" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="feedback" label="留言数" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="visitor" label="访客数" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="talk" label="有效对话量" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="phone" label="要电话量" min-width="80" align="right" header-align="center"></el-table-column>
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
  import MsPlatform from '@/components/common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/platform/item-solution-page-report'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/platform/item-solution-page-report'

  export default {
    components: {
      MsDevice,
      MsPlatform,
      MsSearch
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.search.list.forEach(item => {
        item.value = ''
      })

      let date = []
      date[0] = moment().format('YYYY-MM-01')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.list[0].value = date
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]

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
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
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

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.listDevice({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 20) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
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
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
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
