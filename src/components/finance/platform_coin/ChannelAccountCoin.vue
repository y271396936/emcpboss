<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>平台款项</el-breadcrumb-item>
        <el-breadcrumb-item>账户余额</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">下载</el-button>
      </el-button-group>
    </el-row>

    <ms-slide title="项目余额转出" :width="500" @close="closeSlide()" ref="slidePayment">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formPayment">
        <el-form-item label="账户名" prop="accountTitle">
          <el-input v-model="row.form.accountTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属渠道" prop="channelTitle">
          <el-input v-model="row.form.channelTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="客户端" prop="clientId">
          <el-select v-model="row.form.clientId" :disabled="true">
            <el-option label="PC端" :value="1"></el-option>
            <el-option label="手机端" :value="2"></el-option>
            <el-option label="APP" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返点率" prop="rate">
          <el-input v-model="row.form.rate" :disabled="true">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="金额" prop="money1" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.money1" placeholder="必填，现金，如：1200.50"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="payment()">提交</el-button>
          <el-button @click="resetForm('formPayment')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="校准" :width="500" @close="closeSlide()" ref="slideCorrect">
      <el-tabs v-model="row.correct.activeName" @tab-click="tabChange">
        <el-tab-pane label="余额校准" name="correct">
          <template>
            <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formCorrect">
              <el-form-item label="剩余点数" prop="coin">
                <el-input v-model="row.form.coin">
                  <template slot="append">点</template>
                </el-input>
              </el-form-item>
              <el-form-item label="校准原因" prop="reason" :rules="[{required: true, message: '必填'}]">
                <el-input v-model="row.form.reason" placeholder="请认真填写"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="correct()">提交</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-tab-pane>
        <el-tab-pane label="校准记录" name="correctLog">
          <template>
            <el-table size="small" stripe border :data="this.row.correct.log.list" :fit="true">
              <el-table-column prop="publishDay" label="日期"></el-table-column>
              <el-table-column prop="beforeCoin" label="原点数">
                <template slot-scope="scope">
                  <span>{{scope.row.beforeCoin}}点</span>
                </template>
              </el-table-column>
              <el-table-column prop="coin" label="改后点数">
                <template slot-scope="scope">
                  <span>{{scope.row.coin}}点</span>
                </template>
              </el-table-column>
              <el-table-column prop="publisher" label="操作者"></el-table-column>
              <el-table-column prop="reason" label="申请原因"></el-table-column>
            </el-table>
            <el-pagination
              v-if="row.correct.log.length > 0"
              class="pagination"
              layout="prev, pager, next"
              :current-page.sync="row.correct.log.pagination.page"
              :total="row.correct.log.pagination.totalRow"
              @current-change="moreAdjustJob"></el-pagination>
          </template>
        </el-tab-pane>
      </el-tabs>
    </ms-slide>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary

      :data="table.list"
      :fit="true">
      <el-table-column prop="accountTitle" label="账户名称" min-width="140" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=1)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="accountGenre" label="账户类型" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.accountGenre === 1" class="ms-info">服务户</span>
          <span v-else-if="scope.row.accountGenre === 0" class="ms-success">无忧户</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="所属平台" min-width="70">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="channelTitle" label="推广渠道" min-width="110"></el-table-column>
      <el-table-column prop="client" label="客户端" min-width="60">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"/>
        </template>
      </el-table-column>
      <el-table-column prop="beforeYesterdayCoin" :formatter="formatMoney" label="前天消费" align="right"
                       header-align="center" min-width="100"></el-table-column>
      <el-table-column prop="yesterdayCoin" :formatter="formatMoney" label="昨日消费" align="right"
                       header-align="center" min-width="100"></el-table-column>
      <el-table-column prop="lastPayTime" label="最后打款时间" min-width="140"></el-table-column>
      <el-table-column prop="coin" label="剩余点数" align="right" header-align="center" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.coin < 0" class="ms-danger">{{parseFloat(scope.row.coin).toFixed(2)}} 点</span>
          <span v-else-if="scope.row.coin > 0">{{parseFloat(scope.row.coin).toFixed(2)}} 点</span>
          <span v-else class="ms-info">0 点</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="剩余金额" align="right" header-align="center" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.rate > 0">{{parseFloat(scope.row.money).toFixed(2)}} 元</span>
          <span v-else class="ms-danger">未设置正确的客户返点</span>
        </template>
      </el-table-column>
      <el-table-column label="建议打款额(元)" align="right" header-align="center" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.suggestedMoney > 0" class="ms-success">{{parseFloat(scope.row.suggestedMoney).toFixed(2)}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="showCorrect(scope.$index)">校准</el-button>
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">打款</el-button>
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
  import MsDevice from '@/components/common/Device.vue'
  import MsPlatform from '@/components/common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/channel-account-coin'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import { SEARCH_CONDITION } from '@/models/platform/channel-account-coin'

  export default {
    components: {
      MsDevice,
      MsPlatform,
      MsSearch,
      MsSlide
    },
    created () {
      this.search.list = SEARCH_CONDITION

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
            index: 0
          },
          form: {},
          correct: {
            log: {
              list: [],
              pagination: {}
            },
            activeName: 'correct'
          }
        }
      }
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

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = []
            this.table.pagination = ResponseParse.pagination(response.headers)
            body.forEach(item => {
              let fiducialMoney = 0
              if (item.yesterdayCoin > 0 && item.rate > 0) {
                fiducialMoney = (item.yesterdayCoin * 100 / item.rate).toFixed(2)
              } else {
                fiducialMoney = (item.beforeYesterdayCoin * 100 / item.rate).toFixed(2)
              }
              item.suggestedMoney = (Math.ceil((fiducialMoney - item.coin) / 100)) * 100
              item.money = (item.coin * 100 / item.rate).toFixed(2)
              this.table.list.push(item)
            })
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
      editRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.index = index

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form.token = body.token || ''
          }
        })

        this.showSlide('slidePayment')
      },
      payment () {
        this.$refs['formPayment'].validate((valid) => {
          if (valid) {
            let totalMoney = Number(this.row.form.money) + Number(this.row.form.money1)
            this.row.form.money = this.row.form.money1
            Api.payment({id: this.row.form.id, form: this.row.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                let index = this.row.edit.index
                this.table.list[index].money = totalMoney.toFixed(2)
                this.table.list[index].coin = totalMoney * body.rate / 100
                let data = Object.assign({}, this.table.list[index])
                this.table.list.splice(index, 1, data)

                // 关闭
                this.$refs['slidePayment'].close()
              } else {
                this.$message.error(body.error || '打款失败')
              }
            })
          }
        })
      },
      showCorrect (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.index = index

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form.token = body.token || ''
          }
        })

        this.showSlide('slideCorrect')
      },
      tabChange (tab) {
        if (tab.name === 'correctLog') {
          this.row.correct.log.list = []
          this.getCorrectLog()
        }
      },
      correct () {
        this.$refs['formCorrect'].validate((valid) => {
          if (valid) {
            Api.correct({id: this.row.form.id, form: this.row.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                let index = this.row.edit.index
                this.table.list[index].coin = this.row.form.coin
                this.table.list[index].money = (Number(this.row.form.coin) * 100 / this.table.list[index].rate).toFixed(2)
                let data = Object.assign({}, this.table.list[index])
                this.table.list.splice(index, 1, data)
                this.resetForm('formCorrect')
                this.$message.success('校准成功')
              } else {
                this.$message.error(body.error || '打款失败')
              }
            })
          }
        })
      },
      getCorrectLog () {
        Api.getCorrectLog(this.row.form, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.row.correct.log.list = body
            this.row.correct.log.pagination = ResponseParse.pagination(response.headers)
          }
        })
      },
      moreAdjustJob (val) {
        this.row.correct.log.pagination.page = val
        this.row.correct.log.list = []
        this.getCorrectLog()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.row.correct.activeName = 'correct'
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      formatMoney (row, column) {
        return parseFloat(row[column.property]).toFixed(2)
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
          if (column.property === 'beforeYesterdayCoin' || column.property === 'yesterdayCoin' ||
            column.property === 'coin' || column.property === 'money') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value) && value !== Infinity) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            }
          }
          if (column.property === 'coin') {
            sums[index] = sums[index].toFixed(2) + '点'
          }
          if (column.property === 'money') {
            sums[index] = sums[index].toFixed(2) + '元'
          }
        })
        sums[5] = sums[5].toFixed(2)
        sums[6] = sums[6].toFixed(2)
        return sums
      },
      download () {
        let search = ''
        this.search.list.forEach(item => {
          let text = item.name
          let value = item.value
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
              search = '?' + text + '=' + value
            }
          } else {
            if (value !== '') {
              search += '&' + text + '=' + value
            }
          }
        })
        window.location.href = '/rest/boss/platform/channel-account-coins/files' + search
      }
    }
  }
</script>

<style scoped>

</style>
