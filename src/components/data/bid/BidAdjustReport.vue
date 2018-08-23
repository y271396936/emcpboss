<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>运营报告</el-breadcrumb-item>
        <el-breadcrumb-item>运营数据报告</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="exportFile">数据导出</el-button>
      </el-button-group>
    </el-row>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <ms-slide class="ms-slide" title="运营历史" :width="500" @close="closeSlide()" ref="slideLogList">
      <el-date-picker
        v-model="log.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd"
        valueFormat="yyyy-MM-dd">
      </el-date-picker>
      <el-button class="search" type="primary" :loading="log.loading" @click.native.prevent="getLog()"
                 icon="el-icon-search" round>搜索
      </el-button>
      <br/>
      <div class="media-list">
        <el-card v-for="(item, index) in log.list" class="box-card" :key="item.id">
          <div class="pull-left">
            <p class="pull-left-day">
              {{item.time}}
            </p>
          </div>
          <div class="media-body">
            <p class="explain">
              <span class="ms-info">@{{item.operator}}</span>
              <span v-if="item.type === 1">
                <span>修改了</span>
                <span class="ms-warning">{{item.title}}:</span>
                <span v-for="item1 in item.value">
                  <br/>
                  <strong>{{item1.name}} </strong>
                  <span v-if="item1.fromValue !== undefined">由
                    <span class="ms-danger" v-html="item1.fromValue"></span>
                    <span> 改</span>
                  </span>为
                  <span class="ms-danger" v-html="item1.toValue"></span>
                </span>
              </span>
              <span v-if="item.type === 2">
                <span>执行了</span>
                <span class="ms-info">{{item.title}}:</span>
                <span v-for="item1 in item.value">
                  <br/>
                  <strong>{{item1.name}}</strong> 为
                  <span class="ms-danger" v-html="item1.toValue"></span>
                </span>
              </span>
              <span v-if="item.type === 3">
                <span>提交了</span>
                <span class="ms-success">{{item.title}}:</span>
                <br/>
                <span v-if="item.datetime !== undefined" class="ms-gray">{{item.datetime}}</span>
                <span v-if="item.changed !== undefined">
                  <span v-if="item.changed === '有更改'" class="ms-success">有更改</span>
                  <span v-if="item.changed === '无更改'" class="ms-danger">无更改</span>
                  <br/>
                </span>
                <span v-for="item1 in item.value">
                  <span v-html="item1.text"></span>
                  <br/>
                  <div v-if="item1.approve !== undefined" class="media-content">
                    <span class="ms-info">@{{item1.approve.operator}}</span>
                    <span> 于 {{item1.approve.time}}:</span>
                    <br/>
                    <span>{{item1.approve.text}}</span>
                  </div>
                </span>
              </span>
            </p>
          </div>
        </el-card>
      </div>

      <el-pagination
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="log.pagination.page"
        :total="log.pagination.totalRow"
        :page-size="log.pagination.pageSize"
        :page-sizes="log.pagination.pageSizes"
        @size-change="handleLogSizeChange"
        @current-change="handleLogCurrentChange">
      </el-pagination>
    </ms-slide>
    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :data="table.list"
      :summary-method="getSummaries"
      :show-summary="true"
      :highlight-current-row="true"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="83" :formatter="dataFormat"></el-table-column>
      <el-table-column label="客服/销售/运营" min-width="58">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.server, index=10)">{{scope.row.server}}</a><br/>
          <a href="javascript:;" @click="searchCriteria(scope.row.saler, index=6)">{{scope.row.saler}}</a><br/>
          <a href="javascript:;" @click="searchCriteria(scope.row.regulator, index=8)">{{scope.row.regulator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="channelTitle" label="渠道" min-width="50"></el-table-column>
      <el-table-column prop="clientId" label="客户端" min-width="45">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"></ms-device>
        </template>
      </el-table-column>
      <el-table-column prop="accountTitle" label="账户" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=5)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=2)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="itemIndustry" label="行业" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemIndustry, index=9)">{{scope.row.itemIndustry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="impression" label="展现量" min-width="65" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="click" label="点击量" min-width="60" align="right" header-align="center"></el-table-column>
      <el-table-column prop="clickPrice" label="平均点击价格" min-width="50" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.clickPrice === undefined" class="ms-info">&infin;</span>
          <span v-else>{{scope.row.clickPrice.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="clickRatio" label="点击率" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.impression === 0" class="ms-info">&infin;</span>
          <span v-else>{{(scope.row.click / scope.row.impression * 100).toFixed(2)}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="advisoryRatio" label="有效咨询率" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.click === 0" class="ms-info">&infin;</span>
          <span v-else>{{(scope.row.talk / scope.row.click * 100).toFixed(2)}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="feedback" label="留言数" min-width="50" align="right" header-align="center"></el-table-column>
      <el-table-column prop="talk" label="有效对话量" min-width="50" align="right" header-align="center"></el-table-column>
      <el-table-column prop="phone" label="要电话量" min-width="50" align="right" header-align="center"></el-table-column>
      <el-table-column prop="talkRatio" label="沟通有效率" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.talk === 0" class="ms-info">&infin;</span>
          <span v-else>{{(scope.row.phone / scope.row.talk * 100).toFixed(2)}}%</span>
        </template>
      </el-table-column>
      <el-table-column prop="costCoin" label="消费" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.costCoin === undefined" class="ms-info">***</span>
          <span v-else>{{scope.row.costCoin.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualTalkPrice" label="有效对话成本" min-width="65" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.actualTalkPrice === undefined" class="ms-info">&infin;</span>
          <span v-else>{{scope.row.actualTalkPrice.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="actualFeedbackPrice" label="留言均价" min-width="65" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.actualFeedbackPrice === undefined" class="ms-info">&infin;</span>
          <span v-else>{{scope.row.actualFeedbackPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="talkPriceStandard" label="有效对话成本标准" min-width="50" align="right" v-if="!isShow"
                       header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.talkPriceStandard === undefined" class="ms-gray">***</span>
          <span v-else>{{scope.row.talkPriceStandard}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="talkDiffPrice" label="偏差" min-width="65" align="right" header-align="center" v-if="!isShow">
        <template slot-scope="scope">
          <span v-if="scope.row.talkDiffPrice === undefined" class="ms-gray">***</span>
          <span v-else-if="scope.row.talkDiffPrice < 0" class="ms-danger">{{scope.row.talkDiffPrice}}</span>
          <span v-else>{{scope.row.talkDiffPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feedbackPriceStandard" label="留言均价标准" min-width="60" align="right" v-if="!isShow"
                       header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.feedbackPriceStandard === undefined" class="ms-gray">***</span>
          <span v-else>{{scope.row.feedbackPriceStandard}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="feedbackDiffPrice" label="偏差" min-width="65" align="right" header-align="center" v-if="!isShow">
        <template slot-scope="scope">
          <span v-if="scope.row.feedbackDiffPrice === undefined" class="ms-gray">***</span>
          <span v-else-if="scope.row.feedbackDiffPrice < 0" class="ms-danger">{{scope.row.feedbackDiffPrice}}</span>
          <span v-else>{{scope.row.feedbackDiffPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="budget" label="预算" min-width="75" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.budget === undefined" class="ms-info">***</span>
          <span v-else>{{scope.row.budget.toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="diffCost" label="差额" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.diffCost > 0" class="ms-danger">{{scope.row.diffCost}}</span>
          <span v-else>{{scope.row.diffCost}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="75">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="showLog(scope.$index)">运营过程</el-button>
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
  import MsDevice from '@/components/common/Device.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/report/bid-adjust-report'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/report/bid-adjust-report'

  export default {
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    components: {
      MsDevice,
      MsSearch,
      MsSlide
    },
    created () {
      let date = []
      date[0] = moment().subtract(1, 'days').format('YYYY-MM-DD')
      date[1] = moment().subtract(1, 'days').format('YYYY-MM-DD')

      this.search.condition.date = date
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.list = SEARCH_CONDITION
      this.isShow = false
      this.table.list = []
      this.requestList()
    },
    data () {
      return {
        isShow: false,
        search: {
          list: [],
          condition: {}
        },
        table: {
          loading: true,
          list: [],
          pagination: {},
          isShow: false
        },
        log: {
          list: [],
          itemSolutionId: '',
          pagination: {},
          loading: true,
          date: []
        }
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
    methods: {
      exportFile () {
//        const search = Object.assign({}, this.search.condition)
        window.location.href = '/rest/boss/report/bid-adjust-reports/export?startTime=' + this.search.condition.startTime + '&endTime=' + this.search.condition.endTime
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
        var isShow = false
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data.list || []
          isShow = response.data.map.isAddDept
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
            if (this.table.pagination.totalRow === 0) {
              this.tbHeight = ''
            } else {
              if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 5) {
                this.tbHeight = ''
              } else {
                this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
              }
            }
            // 运营小组
            let group = []
            response.data.map.bidDepartments.forEach(item => {
              group.push({value: item.id, label: item.title})
            })
            this.search.list[7].config.list = group

            // 渠道
            let channel = []
            response.data.map.channels.forEach(item => {
              channel.push({value: item.id, label: item.title})
            })
            this.search.list[4].config.list = channel
            if (body.length === 0) {
              this.$message.error(body.error || '未找到相关资源列表')
            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.isShow = isShow
          this.table.loading = false
        })
      },
      showLog (index) {
        this.log.itemSolutionId = this.table.list[index].itemSolutionId
        let startTime = moment().subtract(7, 'days').format('YYYY-MM-DD')
        let endTime = moment().format('YYYY-MM-DD')

        this.log.date = [startTime, endTime]

        this.getLog()

        this.showSlide('slideLogList')
      },
      getLog () {
        this.log.loading = true
        Api.listLog({
          search: {
            itemSolutionId: this.log.itemSolutionId,
            startTime: this.log.date[0],
            endTime: this.log.date[1],
            page: this.log.pagination.page,
            pageSize: this.log.pagination.pageSize
          }
        }, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.log.list = body
            this.log.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.log.list = []
//            this.$message.error(body.error || '运营历史获取失败')
          }
          this.log.loading = false
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
      handleLogSizeChange (val) {
        this.log.pagination.pageSize = val
        this.getLog()
      },
      handleLogCurrentChange (val) {
        this.log.pagination.page = val
        this.getLog()
      },
      updateConditions (conditions) {
        this.table.pagination.page = 1
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.log.pagination = {}
        this.log.list = []
        this.log.date = []
      },
      dataFormat (row, column) {
        const data = row[column.property] + ''
        if (data === '' || data === undefined) {
          return ''
        } else if (data.length === 8) {
          let _data = data.substring(0, 4) + '-' + data.substring(4, 6) + '-' + data.substring(6, 8)
          return _data
        }
      },
      getSummaries (param) {
        const {columns, data} = param
        const sums = []

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }
          const values = data.map(item => Number(item[column.property]))
          if (column.property === 'impression' || column.property === 'click' || column.property === 'costCoin' ||
            column.property === 'feedback' || column.property === 'talk' || column.property === 'phone' ||
            column.property === 'budget' || column.property === 'diffCost') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            } else {
              sums[index] = ''
            }
          }
          if (column.property === 'budget' || column.property === 'diffCost' || column.property === 'costCoin') {
            sums[index] = sums[index] === '' ? '' : sums[index].toFixed(2)
          }
        })
        /**
         * 展现量 消费 ----> 消费【7】 展现量【8】
         sums[11] = sums[8] === 0 ? '∞' : (sums[9] / sums[8] * 100).toFixed(2) + '%' // 点击率=点击量/展现量
         sums[12] = sums[9] === 0 ? '∞' : (sums[14] / sums[9] * 100).toFixed(2) + '%'  // 有效咨询率=有效对话量/点击量
         sums[16] = sums[14] === 0 ? '∞' : (parseInt(sums[15]) / parseInt(sums[14]) * 100).toFixed(2) + '%' // 沟通有效率=要电话量/有效对话量
         if (sums[7] !== '') {
          sums[10] = sums[9] === 0 ? '∞' : (sums[7] / sums[9]).toFixed(2) // 平均点击价格=消费/点击量
          sums[17] = sums[14] === 0 ? '∞' : (sums[7] / sums[14]).toFixed(2) // 有效对话成本=消费/有效对话量
          let talkAndFeedback = sums[13] + sums[15] // 留言数 + 有电话量
          sums[18] = talkAndFeedback === 0 ? '∞' : (sums[7] / talkAndFeedback).toFixed(2) // 留言均价=消费/(留言数 + 要电话量)
        }
         */
        /**
         * 消费【7】 展现量 点击量 平均点击价格 点击率 有效咨询率 留言数 有效对话量 要电话量 沟通有效率【16】 有效对话成本【17】---->
         * 展现量【7】 点击量【8】 平均点击价格【9】 点击率【10】 有效咨询率【11】 留言数【12】 有效对话量【13】 要电话量【14】 沟通有效率【15】 消费【16】 有效对话成本【17】
         */
        sums[10] = sums[7] === 0 ? '∞' : (sums[8] / sums[7] * 100).toFixed(2) + '%' // 点击率=点击量/展现量
        sums[11] = sums[8] === 0 ? '∞' : (sums[13] / sums[8] * 100).toFixed(2) + '%'  // 有效咨询率=有效对话量/点击量
        sums[15] = sums[13] === 0 ? '∞' : (parseInt(sums[14]) / parseInt(sums[13]) * 100).toFixed(2) + '%' // 沟通有效率=要电话量/有效对话量
        if (sums[16] !== '') {
          sums[9] = sums[8] === 0 ? '∞' : (sums[16] / sums[8]).toFixed(2) // 平均点击价格=消费/点击量
          sums[17] = sums[13] === 0 ? '∞' : (sums[16] / sums[13]).toFixed(2) // 有效对话成本=消费/有效对话量
          let talkAndFeedback = sums[12] + sums[14] // 留言数 + 要电话量
          sums[18] = talkAndFeedback === 0 ? '∞' : (sums[16] / talkAndFeedback).toFixed(2) // 留言均价=消费/(留言数 + 要电话量)
        }

        return sums
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  .ms-list {
    .media-list {
      padding: 10px 10px 0 5px;
      .box-card {
        margin-bottom: 5px;
        font-size: 12px;
        .pull-left {
          display: inline-block;
          float: left;
          margin: -21px 0 0 -10px;
          .pull-left-day {
            font-weight: bold;
          }
        }
        .media-body {
          margin: -25px -10px -25px 100px;
          padding: 0 0 0px 8px;
          border-left: 2px solid #DDD;
          .explain {
            padding-bottom: 5px;
            border-bottom: 1px dashed #DDD;
          }
          .media-content {
            padding-left: 8px;
            border-left: 2px solid #DDD;
          }
        }
      }
    }
  }

  .ms-slide {
    .el-input__inner {
      height: 40px;
    }
    .el-button {
      height: 40px;
    }
  }

</style>
