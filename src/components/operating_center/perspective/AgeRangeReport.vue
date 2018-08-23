<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>透视表导入</el-breadcrumb-item>
        <el-breadcrumb-item>年龄范围数据列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-slide
      title="导入日志"
      :width="500"
      @close="closeSlide()"
      ref="slideLog">
      <el-form class="form" label-width="120px" size="small" :model="log" style="margin-top: 35px">
        <el-form-item label="ID" prop="id">
          <el-input v-model="log.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数据类型" prop="dataTypeId">
          <span v-if="log.dataTypeId === 1">百度PC</span>
          <span v-else-if="log.dataTypeId === 2">百度网盟</span>
          <span v-else-if="log.dataTypeId === 3">360</span>
          <span v-else-if="log.dataTypeId === 4">搜狗</span>
          <span v-else-if="log.dataTypeId === 5">神马</span>
          <span v-else-if="log.dataTypeId === 6">陌陌</span>
          <span v-else-if="log.dataTypeId === 7">百度信息流</span>
          <span v-else-if="log.dataTypeId === 8">360信息流</span>
          <span v-else-if="log.dataTypeId === 9">今日头条信息流</span>
          <span v-else-if="log.dataTypeId === 10">UC信息流</span>
          <span v-else-if="log.dataTypeId === 11">搜狗银河</span>
          <span v-else>未知</span>
        </el-form-item>
        <el-form-item label="报告类型" prop="reportGenre">
          <span v-if="log.reportGenre === 1">关键词汇总报告</span>
          <span v-else-if="log.reportGenre === 2">地域报告</span>
          <span v-else-if="log.reportGenre === 3">分时报告</span>
          <span v-else-if="log.reportGenre === 4">搜索词报告</span>
          <span v-else-if="log.reportGenre === 5">操作系统报告</span>
          <span v-else-if="log.reportGenre === 6">年龄报告</span>
          <span v-else-if="log.reportGenre === 7">兴趣报告</span>
          <span v-else-if="log.reportGenre === 8">性别报告</span>
        </el-form-item>
        <el-form-item label="数据日期" prop="dataDay">
          <el-input v-model="log.dataDay" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="导入文件" prop="fileName">
          <el-input v-model="log.fileName" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="导入文件大小" prop="fileSize">
          <span v-if="log.fileSize > 1024*1024">{{(log.fileSize / 1024 / 1024).toFixed(2)}}M</span>
          <span v-else>{{(log.fileSize / 1024).toFixed(2)}}K</span>
        </el-form-item>
        <el-form-item label="含有账户" prop="accountTitles">
          <el-input v-model="log.accountTitles" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="操作者" prop="operator">
          <el-input v-model="log.operator" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="log.createTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="状态信息" prop="status">
          <span class="ms-success">导入成功</span>
          <span v-if="log.rollbacked === 1">
            ，<span class="ms-danger">已回退</span><br>
            {{log.rollbackTime}}<br>
            {{log.rollbackOperator}}
          </span>
          <span v-else-if="log.rollbacked !== 0">，回退未知</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="rollback()">回退</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <div ref="msSearch">
      <!--@clickH="calculatedHeight"-->
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" fixed></el-table-column>
      <el-table-column prop="day" label="日期" min-width="80" fixed></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=5)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="平台" min-width="80">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="channel" label="渠道" min-width="80"></el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="120">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=4)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="planTitle" label="推广计划" min-width="250"></el-table-column>
      <el-table-column prop="ageRange" label="年龄范围" min-width="80"></el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.costCoin.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="impression" label="展现" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="click" label="点击" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="clickRatio" label="点击率" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row.clickRatio.toFixed(2)}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.clickPrice.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="importLog(scope.$index)">导入日志</el-button>
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
  import MsPlatform from '@/components/common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/report/age-range-report'
  import LogApi from '@/api/report/perspective-report-import-log'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/age-range-report'

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
        log: {}
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () {
//        this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//      })
//    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.search.list.forEach(item => {
        item.value = ''
      })

      if (this.$route.query.id === undefined) {
        this.search.condition.date = moment().subtract(1, 'days').format('YYYY-MM-DD')
        this.search.list[0].value = moment().subtract(1, 'days').format('YYYY-MM-DD')
      } else {
        this.search.condition.importLogId = this.$route.query.id
        this.search.list[1].value = this.$route.query.id
      }

      this.table.list = []
      this.requestList()
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
      importLog (index) {
        this.log = {}

        const search = Object.assign({}, {id: this.table.list[index].importLogId})
        LogApi.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.log = body[0]
          } else {
            this.$message.error(body.error || '导入日志获取失败')
          }
        })
        this.showSlide('slideLog')
      },
      rollback () {
        LogApi.rollback({id: this.log.id}, response => {
          let status = response.status || 0
          if (status === 200 || status === 204) {
            this.log = {}
            this.table.pagination.page = 1
            this.requestList()
          } else {
            this.$message.error('回退失败')
          }
        })

        this.$refs['slideLog'].close()
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

          let values = data.map(item => Number(item[column.property]))
          if (column.property === 'costCoin' || column.property === 'impression' || column.property === 'click') {
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
