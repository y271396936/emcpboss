<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>运营报告</el-breadcrumb-item>
        <el-breadcrumb-item>节点数据报告</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :span-method="objectSpanMethod"
      :data="recombineList"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="90" :formatter="dataFormat" fixed></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=4)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="industry" label="行业" min-width="150"></el-table-column>
      <el-table-column prop="platformId" label="平台" min-width="75"></el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=2)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="saler" label="销售" min-width="60"></el-table-column>
      <el-table-column prop="server" label="客服" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.server, index=7)">{{scope.row.server}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="regulator" label="运营人员" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.regulator, index=6)">{{scope.row.regulator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="dataType" label="数据类型" min-width="85"></el-table-column>
      <el-table-column prop="timeNode" label="时间节点">
        <el-table-column v-for='n in ["11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"]'
                         :key="n" :prop="n" :label="n" min-width="80" align="right" header-align="center"></el-table-column>
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
  import Api from '@/api/report/time-node-report'
  import UserApi from '@/api/system/system-user'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '@/utils/constants'

  export default {
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
    },
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
      // date[0] = moment().format('YYYY-MM-01')
      date[0] = moment().subtract(1, 'days').format('YYYY-MM-DD')
      date[1] = moment().subtract(1, 'days').format('YYYY-MM-DD')

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
          title: '账户名',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        },
        {
          name: 'customer',
          title: '客户名称',
          placeholder: '支持模糊查询',
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
          name: 'regulatorDepartmentId',
          title: '运营小组',
          placeholder: '--请选择运营小组--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: []
          }
        },
        {
          name: 'regulator',
          title: '运营人员',
          placeholder: '请输入关键词',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: false,
          config: {
            list: [],
            remote: {
              enabled: true,
              loading: false,
              method: (query) => {
                const myself = this.search.list[6]
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
          name: 'server',
          title: '客服专员',
          placeholder: '请输入关键词',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: false,
          config: {
            list: [],
            remote: {
              enabled: true,
              loading: false,
              method: (query) => {
                const myself = this.search.list[7]
                myself.config.remote.loading = true

                if (query === '' || query === undefined) {
                  myself.config.list = []
                  myself.config.remote.loading = false
                }
                UserApi.serviceLikeness({name: query}, response => {
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
        }
      ]

      this.table.list = {}
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
          list: {},
          pagination: {}
        },
        regulatorDepartments: []
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
    computed: {
      recombineList () {
        // 获得运营小组
        let regulatorDepartment = []
        this.regulatorDepartments.forEach(item => {
          regulatorDepartment.push({
            value: item.id, label: item.title
          })
        })
        this.search.list[5].config.list = regulatorDepartment

        // 获得 platform mapping
        let platforms = {}
        PLATFORM_LIST.forEach(item => {
          platforms[item.id] = item.title
        })

        let list = []
        let dataList = this.table.list.list || []

        let dataTypes = {'消费点数': 'costCoin', '有效对话数': 'talk', '对话成本': '', '要电话数': 'phone', '要电话成本': ''}

        dataList.forEach(item => {
          for (let key1 in dataTypes) {
            let report = {}
            report.day = item.day
            report.itemTitle = item.itemTitle
            report.industry = item.industry
            report.platformId = platforms[item.platformId]
            report.accountTitle = item.accountTitle
            report.saler = item.saler
            report.server = item.server
            report.regulator = item.regulator
            report.dataType = key1

            let nodeData = this.table.list.map['reportMaps'] || {}

            for (let key in nodeData[item['itemSolutionId']]) {
              let data = nodeData[item['itemSolutionId']][key]
              let date = key.split('_')[0]
              if (date === item.day.toString()) {
                if (dataTypes[key1] !== '') {
                  report[data['timeNode']] = data[dataTypes[key1]]
                } else if (dataTypes[key1] === '对话成本') {
                  report[data['timeNode']] = data['talk'] === 0 ? '∞' : (data['costCoin'] / data['talk']).toFixed(2)
                } else {
                  report[data['timeNode']] = data['phone'] === 0 ? '∞' : (data['costCoin'] / data['phone']).toFixed(2)
                }
              }
            }
            list.push(report)
          }
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

        let params = Object.assign({}, {page: this.table.pagination.page, pageSize: this.table.pagination.pageSize},
          this.search.condition)
        Api.list(params, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.list = body

            this.regulatorDepartments = response.data.map['bidDepartments'] || []
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
//            if (this.table.pagination.totalRow === 0) {
//              this.tbHeight = ''
//            } else {
//              if (this.table.pagination.totalPage === this.table.pagination.page && body.list.length < 15) {
//                this.tbHeight = ''
//              } else {
//                this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//              }
//            }
            if (this.table.list.list.length === 0) {
              this.$message.error(body.error || '未找到相关资源列表')
            }
          } else {
//            this.tbHeight = ''
            this.table.list = {}
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
      objectSpanMethod ({rowIndex, columnIndex}) {
        if (columnIndex >= 0 && columnIndex < 8) {
          if (rowIndex % 5 === 0) {
            return {rowspan: 5, colspan: 1}
          } else {
            return {rowspan: 0, colspan: 0}
          }
        }
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
