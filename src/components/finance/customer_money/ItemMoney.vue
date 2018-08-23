<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>客户款项</el-breadcrumb-item>
        <el-breadcrumb-item>客户项目余额</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">下载</el-button>
      </el-button-group>
    </el-row>

    <ms-slide title="项目余额转出" :width="500" @close="closeSlide()" ref="slideTransfer">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formTransfer">
        <el-form-item label="转出项目" prop="title">
          <el-input v-model="row.form.title" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="余额" prop="money">
          <el-input v-model="row.form.money" :disabled="true">
            <template slot="prepend">&yen;</template>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="转入项目" prop="transfereeItemId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.transfereeItemId" :disabled="row.edit.enabled">
            <template v-for="item in items">
              <el-option :label="item.title" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="转出金额" prop="transferMoney" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.transferMoney" placeholder="填写现金，如1200.50">
            <template slot="prepend">&yen;</template>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitTransfer()">提交</el-button>
          <el-button @click="resetForm('formTransfer')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="项目退款" :width="500" @close="closeSlide()" ref="slideRefund">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formRefund">
        <el-form-item label="余额" prop="money">
          <el-input v-model="row.form.money" :disabled="true">
            <template slot="prepend">&yen;</template>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundMoney" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.refundMoney" placeholder="填写现金，如1200.50">
            <template slot="prepend">&yen;</template>
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="我方退款银行" prop="bank">
          <el-input v-model="row.form.bank"></el-input>
        </el-form-item>
        <el-form-item label="银行流水号" prop="bankCode">
          <el-input v-model="row.form.bankCode"></el-input>
        </el-form-item>
        <el-form-item label="收款银行" prop="dueBank">
          <el-input v-model="row.form.dueBank"></el-input>
        </el-form-item>
        <el-form-item label="退款时间" prop="refundTime">
          <el-date-picker v-model="row.form.refundTime" type="datetime" placeholder="留空为当前时间"
                          value-format="yyyy-MM-dd HH:mm:ss" :disabled="row.edit.enabled">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退款原因" prop="reason" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.reason" placeholder="客户可见，请认真填写"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRefund()">提交</el-button>
          <el-button @click="resetForm('formRefund')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="title" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.title, index=2)">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="customerTitle" label="所属客户" min-width="130">
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="searchCriteria(scope.row.customerTitle, index=1)">{{scope.row.customerTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="customerGenre" label="客户类型" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.customerGenre === 1" class="ms-info">服务户</span>
          <span v-else-if="scope.row.customerGenre === 0" class="ms-success">无忧户</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="现金金额(元)" align="right" header-align="center" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.money < 0" class="ms-danger">{{parseFloat(scope.row.money).toFixed(2)}}</span>
          <span v-else>{{parseFloat(scope.row.money).toFixed(2)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="$store.state.user.info.systemType != 'sale' && $store.state.user.info.systemType != 'increment'"
        prop="beforeYesterdayCostCoin" label="前日消费点数" align="right" header-align="center"
        min-width="100">
        <template slot-scope="scope">
          {{parseFloat(scope.row.beforeYesterdayCostCoin === undefined ? 0 : scope.row.beforeYesterdayCostCoin).toFixed(2)}} 点
        </template>
      </el-table-column>
      <el-table-column prop="beforeYesterdayCostMoney" label="前日消费金额" min-width="100" align="right"
                       header-align="center">
        <template slot-scope="scope">
          {{parseFloat(scope.row.beforeYesterdayCostMoney === undefined ? 0 : scope.row.beforeYesterdayCostMoney).toFixed(2)}} 元
        </template>
      </el-table-column>
      <el-table-column
        v-if="$store.state.user.info.systemType != 'sale' && $store.state.user.info.systemType != 'increment'"
        prop="yesterdayCostCoin" label="昨日消费点数" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          {{parseFloat(scope.row.yesterdayCostCoin === undefined ? 0 : scope.row.yesterdayCostCoin).toFixed(2)}} 点
        </template>
      </el-table-column>
      <el-table-column prop="yesterdayCostMoney" label="昨日消费金额" min-width="100" align="right" header-align="center">
        <template slot-scope="scope">
          {{parseFloat(scope.row.yesterdayCostMoney === undefined ? 0 : scope.row.yesterdayCostMoney).toFixed(2)}} 元
        </template>
      </el-table-column>
      <el-table-column prop="budget" :formatter="formatMoney" label="预算(点)" align="right"
                       header-align="center" min-width="90"></el-table-column>
      <el-table-column prop="consumeDay" label="可消费天数" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.canConsumeDay === 0" class="ms-danger">已欠费</span>
          <span v-else-if="scope.row.canConsumeDay >= 7"
                class="ms-success">可消费{{scope.row.canConsumeDay.toFixed(2)}}天</span>
          <span v-else class="ms-warning">可消费{{scope.row.canConsumeDay.toFixed(2)}}天</span>
        </template>
      </el-table-column>
      <el-table-column prop="serviceCoin" label="服务户总消费(点)" :formatter="formatMoney" align="right"
                       header-align="center" min-width="100"></el-table-column>
      <el-table-column prop="saler" label="销售经理" min-width="70">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.saler, index=8)">{{scope.row.saler}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">上稿中</span>
          <span v-else-if="scope.row.status === 0" class="ms-gray">无效</span>
          <span v-else-if="scope.row.status === -1" class="ms-danger">已下稿</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="查看" fixed="right" min-width="180">
        <template slot-scope="scope">
          <router-link :to="{path:'/finance/item-payments/',query:{itemTitle:scope.row.title}}" target="_blank">
            付款记录
          </router-link>
          <router-link :to="{path:'/import-data/item-solution-reports/',query:{itemTitle:scope.row.title}}"
                       target="_blank">
            消费列表
          </router-link>
          <router-link :to="{path:'/finance/item-consumption/',query:{itemTitle:scope.row.title}}" target="_blank">
            消费日报
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="130">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="transfer(scope.$index)">转出</el-button>
          <el-button type="text" size="small" @click.native.prevent="refund(scope.$index)">退款</el-button>
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
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/item-money'
  import FormTokenApi from '@/api/system/form-token'
  import ItemApi from '@/api/platform/item'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/platform/item-money'

  export default {
    components: {
      MsSearch,
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
        row: {
          edit: {
            index: 0
          },
          form: {}
        },
        items: []
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

      if (this.$route.query.hasOwnProperty('maxMoney')) {
        const maxMoney = this.$route.query['maxMoney'] || ''
        this.search.condition.maxMoney = maxMoney

        const index = this.search.list.findIndex(d => d.name === 'maxMoney')
        this.search.list[index].value = maxMoney
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
            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
              this.tbHeight = ''
            } else {
              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
            this.$message.error(body.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      transfer (index) {
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

        // 获得转出项目
        ItemApi.listValidItem({id: this.row.form.customerId}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            body.forEach(item => {
              if (item.id !== this.row.form.id) {
                this.items.push(item)
              }
            })
          }
        })

        this.showSlide('slideTransfer')
      },
      submitTransfer () {
        this.$refs['formTransfer'].validate((valid) => {
          if (valid) {
            Api.transfer({
              form: {
                transferorItemId: this.row.form.id,
                transfereeItemId: this.row.form.transfereeItemId,
                money: this.row.form.transferMoney,
                token: this.row.form.token
              }
            }, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                let index = this.row.edit.index
                this.table.list[index].money = this.table.list[index].money - this.row.form.transferMoney

                // 关闭
                this.$refs['slideTransfer'].close()
              } else {
                this.$message.error(body.error || '转出失败')
              }
            })
          } else {
            return false
          }
        })
      },
      refund (index) {
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

        this.showSlide('slideRefund')
      },
      submitRefund () {
        this.$refs['formRefund'].validate((valid) => {
          if (valid) {
            this.row.form.money = this.row.form.refundMoney
            this.row.form.itemId = this.row.form.id
            Api.refund({form: this.row.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                let index = this.row.edit.index
                this.table.list[index].money = this.table.list[index].money - this.row.form.money

                // 关闭
                this.$refs['slideRefund'].close()
              } else {
                this.$message.error(body.error || '转出失败')
              }
            })
          } else {
            return false
          }
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
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      download () {
        let condition = ''
        if (this.search.condition.customerGenre !== undefined) {
          let customerGenre = 'customerGenre=' + this.search.condition.customerGenre
          if (condition === '') {
            condition = '?' + customerGenre
          } else {
            condition = condition + '&' + customerGenre
          }
        }
        if (this.search.condition.customerTitle !== undefined) {
          let customerTitle = 'customerTitle=' + this.search.condition.customerTitle
          if (condition === '') {
            condition = '?' + customerTitle
          } else {
            condition = condition + '&' + customerTitle
          }
        }
        if (this.search.condition.itemTitle !== undefined) {
          let itemTitle = 'itemTitle=' + this.search.condition.itemTitle
          if (condition === '') {
            condition = '?' + itemTitle
          } else {
            condition = condition + '&' + itemTitle
          }
        }
        if (this.search.condition.itemStatus !== undefined) {
          let itemStatus = 'itemStatus=' + this.search.condition.itemStatus
          if (condition === '') {
            condition = '?' + itemStatus
          } else {
            condition = condition + '&' + itemStatus
          }
        }
        if (this.search.condition.maxMoney !== undefined) {
          let maxMoney = 'maxMoney=' + this.search.condition.maxMoney
          if (condition === '') {
            condition = '?' + maxMoney
          } else {
            condition = condition + '&' + maxMoney
          }
        }
        if (this.search.condition.maxCostDay !== undefined) {
          let maxCostDay = 'maxCostDay=' + this.search.condition.maxCostDay
          if (condition === '') {
            condition = '?' + maxCostDay
          } else {
            condition = condition + '&' + maxCostDay
          }
        }

        if (this.search.condition.other !== undefined) {
          let other = 'other=' + this.search.condition.other
          if (condition === '') {
            condition = '?' + other
          } else {
            condition = condition + '&' + other
          }
        }
        if (this.search.condition.orderBy !== undefined) {
          let orderBy = 'orderBy=' + this.search.condition.orderBy
          if (condition === '') {
            condition = '?' + orderBy
          } else {
            condition = condition + '&' + orderBy
          }
        }
        if (this.search.condition.saler !== undefined) {
          let saler = 'saler=' + this.search.condition.saler
          if (condition === '') {
            condition = '?' + saler
          } else {
            condition = condition + '&' + saler
          }
        }
        if (this.search.condition.server !== undefined) {
          let server = 'server=' + this.search.condition.server
          if (condition === '') {
            condition = '?' + server
          } else {
            condition = condition + '&' + server
          }
        }

        if (condition === '') {
          window.location.href = '/rest/boss/platform/item-moneys/download'
        } else {
          window.location.href = '/rest/boss/platform/item-moneys/download' + condition
        }
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

          if (column.property === 'money' || column.property === 'budget' || column.property === 'serviceCoin' ||
            column.property === 'beforeYesterdayCostCoin' || column.property === 'beforeYesterdayCostMoney' ||
            column.property === 'yesterdayCostCoin' || column.property === 'yesterdayCostMoney') {
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
              sums[index] = 0
            }
          }
          if (column.property === 'beforeYesterdayCostMoney' || column.property === 'yesterdayCostMoney') {
            sums[index] = sums[index].toFixed(2) + '元'
          }
          if (column.property === 'beforeYesterdayCostCoin' || column.property === 'yesterdayCostCoin') {
            sums[index] = sums[index].toFixed(2) + '点'
          }
          if (column.property === 'money' || column.property === 'budget' || column.property === 'serviceCoin') {
            sums[index] = sums[index].toFixed(2)
          }
        })

        return sums
      }
    }
  }
</script>

<style scoped>

</style>
