<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>运营报告</el-breadcrumb-item>
        <el-breadcrumb-item>项目预算报告</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="recombineList"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="90" :formatter="dataFormat"></el-table-column>
      <el-table-column prop="server" label="客服" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.server, index=5)">{{scope.row.server}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="saler" label="销售" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.saler, index=4)">{{scope.row.saler}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=2)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="itemIndustry" label="行业" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemIndustry, index=3)">{{scope.row.itemIndustry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="impression" label="展现量" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="click" label="点击量" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column label="平均点击价格" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-info':(scope.row.click == 0)}">{{scope.row.clickPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="点击率" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-info':(scope.row.impression == 0)}">{{scope.row.clickRatio}}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效咨询率" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-info':(scope.row.click == 0)}">{{scope.row.advisoryRatio}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feedback" label="留言数" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="talk" label="有效对话量" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column prop="phone" label="要电话量" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column label="沟通有效率" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-info':(scope.row.talk == 0)}">{{scope.row.talkRatio}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="80" align="right" header-align="center"
                       :render-header="renderHeader"></el-table-column>

      <el-table-column label="有效对话成本" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-info':(scope.row.talk == 0)}">{{scope.row.actualTalkPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="留言均价" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-info':(scope.row.talkAndFeedback == 0)}">{{scope.row.actualFeedbackPrice}}</span>
        </template>
      </el-table-column>
      <!--
      <el-table-column prop="talkPrice" label="有效对话成本标准" min-width="80" align="right" header-align="center"
                       :render-header="renderHeader"></el-table-column>
      <el-table-column label="偏差" min-width="75" align="right" header-align="center" :render-header="renderHeader">
        <template slot-scope="scope">
          <span :class="{'ms-danger':(scope.row.talkDiffPrice < 0)}">{{scope.row.talkDiffPrice}}</span>
        </template>
      </el-table-column>

      <el-table-column prop="feedbackPrice" label="留言均价标准" min-width="80" align="right" header-align="center"
                       :render-header="renderHeader"></el-table-column>
      <el-table-column label="偏差" min-width="75" :render-header="renderHeader">
        <template slot-scope="scope">
          <span :class="{'ms-danger':(scope.row.feedbackDiffPrice < 0)}">{{scope.row.feedbackDiffPrice}}</span>
        </template>
      </el-table-column>
      -->
      <el-table-column prop="budget" label="预算" min-width="80" align="right" header-align="center"></el-table-column>
      <el-table-column label="差额" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-danger':(scope.row.diffCost > 0)}">{{scope.row.diffCost}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="itemBudget" label="销售预算" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column label="差额" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span :class="{'ms-danger':(scope.row.itemBudgetDiffCost > 0)}">{{scope.row.itemBudgetDiffCost}}</span>
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
  import Api from '@/api/report/item-budget'
  import UserApi from '@/api/system/system-user'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

  export default {
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
    },
    components: {
      MsSearch
    },
    created () {
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
          name: 'industry',
          title: '行业',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: false
        },
        {
          name: 'saler',
          title: '销售经理',
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
                const myself = this.search.list[4]
                myself.config.remote.loading = true

                if (query === '' || query === undefined) {
                  myself.config.list = []
                  myself.config.remote.loading = false
                }
                UserApi.salesLikeness({name: query}, response => {
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
          title: '客服',
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
                const myself = this.search.list[5]
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
          name: 'orderBy',
          title: '排序规则',
          placeholder: '--请选择排序规则--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: 1, label: '按时间倒序'}
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
        this.search.list[6].config.list = regulatorDepartment

        let list = []
        this.table.list.forEach(item => {
          let budget = item
          budget.costCoin = item.costCoin === undefined ? 0 : item.costCoin
          budget.click = item.click === undefined ? 0 : item.click
          budget.impression = item.impression === undefined ? 0 : item.impression
          budget.clickPrice = budget.click === 0 ? '∞' : (budget.costCoin / budget.click).toFixed(2)
          budget.clickRatio = budget.impression === 0 ? '∞' : (budget.click / budget.impression * 100).toFixed(2) + '%'
          budget.feedback = item.feedback === undefined ? 0 : item.feedback
          budget.talk = item.talk === undefined ? 0 : item.talk
          budget.phone = item.phone === undefined ? 0 : item.phone
          budget.advisoryRatio = item.click === 0 ? '∞' : (budget.talk / budget.click * 100).toFixed(2) + '%'
          budget.talkRatio = budget.talk === 0 ? '∞' : (budget.phone / budget.talk * 100).toFixed(2) + '%'
          budget.actualTalkPrice = budget.talk === 0 ? '∞' : (budget.costCoin / budget.talk).toFixed(2)
          budget.talkAndFeedback = budget.feedback + budget.phone
          budget.actualFeedbackPrice = budget.talkAndFeedback === 0 ? '∞' : (budget.costCoin / budget.talkAndFeedback).toFixed(2)
          if (item.talkPrice === undefined) {
            budget.talkPrice = '***'
            budget.talkDiffPrice = '***'
          } else {
            budget.talkDiffPrice = (budget.talk === 0 ? 0 - budget.talkPrice : budget.talkPrice - budget.actualTalkPrice).toFixed(2)
          }
          if (item.feedbackPrice === undefined) {
            budget.feedbackPrice = '***'
            budget.feedbackDiffPrice = '***'
          } else {
            budget.feedbackDiffPrice = (budget.talkAndFeedback === 0 ? 0 - budget.feedbackPrice : budget.feedbackPrice - budget.actualFeedbackPrice).toFixed(2)
          }
          budget.budget = item.budget === undefined ? 0 : item.budget
          budget.diffCost = (budget.budget - budget.costCoin).toFixed(2)
          budget.itemBudget = item.itemBudget === undefined ? 0 : item.itemBudget
          budget.itemBudgetDiffCost = (item.itemBudget - budget.budget).toFixed(2)
          list.push(budget)
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
          let body = response.data.list || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.regulatorDepartments = response.data.map['bidDepartments'] || []
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
//            if (this.table.pagination.totalRow === 0) {
//              this.tbHeight = ''
//            }
            if (this.table.list.length === 0) {
              this.$message.error(body.error || '未找到相关资源列表')
            }
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
        this.search.condition = conditions
        this.requestList()
      },
      renderHeader (h, {column}) {
        return h(
          'el-tooltip',
          {
            attrs: {'effect': 'dark', 'content': '该项仅有权限用户可见', 'placement': 'top'}
          },
          [
            h('span', [column.label, h('icon', {
              attrs: {
                'name': 'exclamation',
                'style': 'color: #FFA500; vertical-align: middle;'
              }
            })])
          ]
        )
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
          if (column.property === 'impression' || column.property === 'click' || column.property === 'feedback' ||
            column.property === 'talk' || column.property === 'phone' || column.property === 'costCoin' ||
            column.property === 'budget' || column.property === 'itemBudget') {
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
          if (column.property === 'costCoin' || column.property === 'budget') {
            sums[index] = sums[index].toFixed(2)
          }
        })
        /**
         * 沟通有效率【13】 有效对话成本【14】 留言均价【15】 消费【16】 有效对话成本标准【17】
        let costCoin = sums[16]

        sums[7] = sums[6] === 0 ? '∞' : (costCoin / sums[6]).toFixed(2) // 平均点击价格=消费/点击量
        sums[8] = sums[5] === 0 ? '∞' : (sums[6] / sums[5] * 100).toFixed(2) + '%' // 点击率=点击量/展现量
        sums[9] = sums[6] === 0 ? '∞' : (sums[11] / sums[6] * 100).toFixed(2) + '%' // 有效咨询率=有效对话量/点击量
        sums[13] = sums[11] === 0 ? '∞' : (sums[12] / sums[11] * 100).toFixed(2) + '%' // 沟通有效率=要电话量/有效对话量
        sums[14] = sums[12] === 0 ? '∞' : (costCoin / sums[12]).toFixed(2) // 有效对话成本=消费/要电话量
        sums[15] = (sums[10] + sums[12]) === 0 ? '∞' : (costCoin / (sums[10] + sums[12])).toFixed(2) // 留言均价=消费/(留言数 + 要电话量)
        */
        /*
        沟通有效率【13】 有效对话成本【14】 留言均价【15】 消费【16】 有效对话成本标准【17】 偏差[18]
        沟通有效率【13】 消费【14】 有效对话成本【15】 留言均价【16】 有效对话成本标准【17】 偏差[18]  留言均价标准[19] 偏差[20] 预算[21]
        沟通有效率【13】 消费【14】 有效对话成本【15】 留言均价【16】  预算[17]
        */
        let costCoin = sums[14]

        sums[7] = sums[6] === 0 ? '∞' : (costCoin / sums[6]).toFixed(2) // 平均点击价格=消费/点击量
        sums[8] = sums[5] === 0 ? '∞' : (sums[6] / sums[5] * 100).toFixed(2) + '%' // 点击率=点击量/展现量
        sums[9] = sums[6] === 0 ? '∞' : (sums[11] / sums[6] * 100).toFixed(2) + '%' // 有效咨询率=有效对话量/点击量
        sums[13] = sums[11] === 0 ? '∞' : (sums[12] / sums[11] * 100).toFixed(2) + '%' // 沟通有效率=要电话量/有效对话量
        sums[15] = sums[12] === 0 ? '∞' : (costCoin / sums[12]).toFixed(2) // 有效对话成本=消费/要电话量
        sums[16] = (sums[10] + sums[12]) === 0 ? '∞' : (costCoin / (sums[10] + sums[12])).toFixed(2) // 留言均价=消费/(留言数 + 要电话量)

        return sums
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
