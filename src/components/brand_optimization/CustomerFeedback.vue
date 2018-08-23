<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>品牌优化</el-breadcrumb-item>
        <el-breadcrumb-item>客户后台留言</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>
    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :data="recombineList"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed="left"></el-table-column>
      <el-table-column prop="customerTitle" label="客户名" min-width="200"></el-table-column>
      <el-table-column prop="customerLoginAccount" label="登录账号" min-width="100"></el-table-column>
      <el-table-column prop="contacts" label="联系人" min-width="100"></el-table-column>
      <el-table-column prop="mobile" label="联系电话" min-width="100"></el-table-column>
      <el-table-column prop="publishTime" label="创建时间" min-width="100"></el-table-column>
      <el-table-column prop="type" label="服务项" min-width="180"></el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <ms-confirm-button title="查看留言" @confirm="seeDetail(scope.$index)">
            <h4>留言内容：</h4>
            <p class="feedContent">{{scope.row.content}}</p>
          </ms-confirm-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>你确定要删除页面名<code>{{scope.row.customerTitle}}</code>吗？</p>
          </ms-confirm-button>
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
  import MsDetailShow from '@/components/common/FeedbackList'
  import MsSearch from '@/components/common/Search.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import Api from '@/api/feedback/brand-optimization-page-click'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/feedback/brand-optimization-page-click'
  import moment from 'moment'

  export default {
    components: {
      MsDetailShow,
      MsSearch,
      MsConfirmButton
    },
    created () {
      let time = []
      time[0] = moment().format('YYYY-MM-01')
      time[1] = moment().format('YYYY-MM-DD')
      this.search.condition.startDay = time[0]
      this.search.condition.endDay = time[1]
      this.search.list = SEARCH_CONDITION
      this.table.loading = true
      this.table.list = []
      this.requestList()
    },
    data () {
      return {
        showList: true,
        search: {
          list: [],
          condition: {}
        },
        detail: {
          content: '',
          publishTime: '',
          customerTitle: ''
        },
        table: {
          loading: true,
          list: [],
          pagination: {}
        },
        row: {
          edit: {
            enabled: false,
            index: 0
          }
        },
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
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
      closeDetail () {
        this.showList = true
      },
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
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeight - this.$refs.msSearch.clientHeight)
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
      updateConditions (conditions) {
        this.table.pagination.page = 1
        let time = conditions.time || []
        this.search.condition = Object.assign({}, conditions, {startDay: time[0], endDay: time[1]})
        this.requestList()
      },
      seeDetail (index) {
        this.detail.content = this.table.list[index].content
        this.detail.publishTime = this.table.list[index].publishTime
        this.detail.contacts = this.table.list[index].contacts
        this.showList = false
      },
      deleteRow (index) {
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
          } else {
            this.$message.error(body.error || '删除失败')
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .feedContent{
    white-space:normal;
    word-break:break-all;
  }
</style>
