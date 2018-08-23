<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>53数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>导入日志</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border

      :data="recombineList"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" ></el-table-column>
      <el-table-column prop="fileName" label="导入文件" min-width="150"></el-table-column>
      <el-table-column prop="createTime" label="导入时间" min-width="150"></el-table-column>
      <el-table-column prop="operator" label="操作者" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.operator, index=4)">{{scope.row.operator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态信息" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 2" class="ms-info">导入成功</span>
          <span v-else-if="scope.row.genre === 1" class="ms-success">正在导入</span>
          <span v-else-if="scope.row.genre === 0" class="ms-success">等待导入</span>
          <span v-else="scope.row.genre === -1" class="ms-success">导入失败</span>
        </template>
      </el-table-column>

      <el-table-column prop="rollbacked" label="是否回退" min-width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 2">
           <span v-if="scope.row.rollbacked ===1">
             <span class="ms-danger">已回退</span>
           </span>
            <span v-else-if="scope.row.rollbacked !== 0">，回退未知</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="rollbackTime" label="回退时间" min-width="100"></el-table-column>
      <el-table-column prop="rollbackOperator" label="回退者" min-width="80"></el-table-column>
      <el-table-column label="操作" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status ===2 && scope.row.rollbacked !==1">
            <ms-confirm-button title="回退" @confirm="rollbackRow(scope.$index)">
              <p>您确定要回退文件为<code>{{scope.row.fileName}}</code>吗？</p>
            </ms-confirm-button>
          </span>
          <router-link :to="{path:'/import-data/kf53-data',query:{importLogId:scope.row.id}}" target="_blank">数据
          </router-link>
          <el-button type="text" size="small" @click.native.prevent="download(scope.$index)">下载</el-button>
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
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/kf53-chat-record-import-log'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import ResponseParse from '@/utils/response-parse'
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input'
  import { SEARCH_CONDITION } from '@/models/platform/kf53-chat-record-import-log'

  export default {
    components: {
      ElInput,
      MsConfirmButton,
      MsSlide,
      MsSearch
    },
    created () {
      let date = []
      date[0] = moment().format('YYYY-MM-01')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.list = SEARCH_CONDITION
      if (this.$route.query.id !== undefined) {
        this.search.condition.id = this.$route.query.id
        this.search.list[0].value = this.$route.query.id
      }
      this.table.loading = true
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
        row: {
          edit: {
            enabled: false,
            index: 0
          }
        }
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
          } else {
            this.table.list = []
          }
          this.table.loading = false
        })
      },
      download (index) {
        window.location.href = '/rest/boss/report/53kf-chat-records/' + this.table.list[index].id + '/file'
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
        let date = conditions.date || []
        let time = conditions.time || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]
        }, {startRollbackTime: time[0], endRollbackTime: time[1]})
        this.requestList()
      },
      rollbackRow (index) {
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          if (status >= 200 && status <= 204) {
            this.table.list = {}
            this.table.pagination.page = 1
            this.requestList()
          } else {
            this.$message.error('回退失败')
          }
        })
      }
    }
  }
</script>

<style scoped>
</style>
