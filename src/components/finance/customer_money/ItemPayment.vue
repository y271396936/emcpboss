<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>客户款项</el-breadcrumb-item>
        <el-breadcrumb-item>客户付款</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">客户付款</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">下载</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑付款' : '客户付款'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="所属客户" prop="customerId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.customerId" @change="getItem" filterable remote placeholder="请输入关键字"
                     :remote-method="customerLikeness" :loading="remote.customer.loading" :disabled="row.edit.enabled">
            <el-option v-for="customer in remote.customer.list" :key="customer.id" :label="customer.title"
                       :value="customer.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="itemId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.itemId" :disabled="row.edit.enabled">
            <template v-for="item in items">
              <el-option :label="item.title" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="付款人" prop="payer">
          <el-input v-model="row.form.payer"></el-input>
        </el-form-item>
        <el-form-item label="支付行" prop="bank">
          <el-input v-model="row.form.bank"></el-input>
        </el-form-item>
        <el-form-item label="银行流水号" prop="bankCode">
          <el-input v-model="row.form.bankCode" placeholder="用于对账"></el-input>
        </el-form-item>
        <el-form-item label="打款到账时间" prop="payTime" :rules="[{required: true, message: '必填'}]">
          <el-date-picker v-model="row.form.payTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="和银行回执单保持一致"></el-date-picker>
        </el-form-item>
        <el-form-item label="入账银行" prop="dueBank">
          <el-input v-model="row.form.dueBank"></el-input>
        </el-form-item>
        <el-form-item label="入账金额" prop="money" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.money" placeholder="填写现金" :disabled="row.edit.enabled">
            <template slot="prepend">￥</template>
            <template slot="append">.00元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="row.form.remark" placeholder="客户可见，请认真填写，无特殊内容可留空"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="撤销充值" :width="500" @close="closeSlide()" ref="slideRevoke">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formRevoke">
        <el-form-item label="所属客户" prop="customerTitle">
          <el-input v-model="row.form.customerTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="itemTitle">
          <el-input v-model="row.form.itemTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="充值金额" prop="money">
          <el-input v-model="row.form.money" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="撤销原因" prop="revokeReason" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.revokeReason" placeholder="客户可见，请认真填写"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="revoke()">提交</el-button>
          <el-button @click="resetForm('formRevoke')">重置</el-button>
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
      :show-summary="true"

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="customerTitle" label="所属客户" min-width="130">
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="searchCriteria(scope.row.customerTitle, index=3)">{{scope.row.customerTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="itemTitle" label="客户项目" min-width="120">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=4)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="money" label="充值金额(元)" :formatter="formatMoney" min-width="100" align="right"
                       header-align="center">
      </el-table-column>
      <el-table-column prop="payer" label="打款人" min-width="75">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.payer, index=6)">{{scope.row.payer}}</a>
        </template>
      </el-table-column>
      <el-table-column label="入账银行流水号" min-width="160">
        <template slot-scope="scope">
          <span>{{scope.row.dueBank}}</span>
          <br>
          <span>{{scope.row.bankCode || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="打款到帐时间" min-width="140"></el-table-column>
      <el-table-column prop="remark" label="备注" min-width="80"></el-table-column>
      <el-table-column label="状态" min-width="130">
        <template slot-scope="scope">
          <span v-if="scope.row.revoke === 0" class="ms-success">正常</span>
          <span v-else class="ms-danger">已撤销</span>
          <div v-if="scope.row.revoke !== 0">
            <span class="ms-info">@{{scope.row.revokeOperator}}</span>
            <span>: {{scope.row.revokeReason}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="salesman" label="销售员" min-width="60">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.salesman, index=7)">{{scope.row.salesman}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="publisher" label="录入者" min-width="60"></el-table-column>
      <el-table-column prop="publishTime" label="录入时间" min-width="140"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.revoke === 0" type="text" size="small"
                     @click.native.prevent="editRow(scope.$index)">编辑
          </el-button>
          <el-button v-if="scope.row.revoke === 0" type="text" size="small"
                     @click.native.prevent="deleteRow(scope.$index)">撤销
          </el-button>
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
  import CustomerApi from '@/api/platform/customer'
  import FormTokenApi from '@/api/system/form-token'
  import ItemApi from '@/api/platform/item'
  import Api from '@/api/platform/item-payment'
  import ResponseParse from '@/utils/response-parse'
  import { Remote, SEARCH_CONDITION } from '@/models/platform/item-payment'

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
            enabled: false,
            index: 0
          },
          form: {}
        },
        items: [],
        remote: new Remote()
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

      if (this.$route.query.itemTitle !== undefined) {
        this.search.condition.itemTitle = this.$route.query.itemTitle
        this.search.list[4].value = this.$route.query.itemTitle
      } else {
        let date = []
        date[0] = moment().format('YYYY-MM-01')
        date[1] = moment().format('YYYY-MM-DD')
        this.search.condition.startTime = date[0]
        this.search.condition.endTime = date[1]
        this.search.list[0].value = date
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
        const payDate = conditions.payDate || []
        this.search.condition = Object.assign({}, conditions, {
          startTime: date[0],
          endTime: date[1],
          payStartTime: payDate[0],
          payEndTime: payDate[1]
        })
        this.requestList()
      },
      getItem () {
        this.items = []
        ItemApi.listValidItem({id: this.row.form.customerId}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.items = body
          }
        })
      },
      customerLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.customer.list = []
          return
        }

        this.remote.customer.loading = true
        CustomerApi.likeness({search: {title: query, status: 1}}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.customer.list = body
          }
          this.remote.customer.loading = false
        })
      },
      addRow () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0

        this.remote.customer.list = []

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form.token = body.token || ''
          }
        })

        this.showSlide('slideModifyRow')
      },
      editRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.enabled = true
        this.row.edit.index = index
        this.remote.customer.list = []
        this.items = []

        this.remote.customer.list.push({id: this.row.form.customerId, title: this.row.form.customerTitle})
        this.items.push({id: this.row.form.itemId, title: this.row.form.itemTitle})

        this.showSlide('slideModifyRow')
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              Api.modify({id: this.row.form.id, form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  let index = this.row.edit.index
                  let data = Object.assign({}, this.table.list[index], body)
                  this.table.list.splice(index, 1, data)

                  // 关闭
                  this.$refs['slideModifyRow'].close()
                } else {
                  this.$message.error(body.error || '修改失败')
                }
              })
            } else {
              Api.create({form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  // 新数据加到数组开头
                  this.table.list.unshift(body)

                  // 关闭
                  this.$refs['slideModifyRow'].close()
                } else {
                  this.$message.error(body.error || '新增失败')
                }
              })
            }
          } else {
            return false
          }
        })
      },
      deleteRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.index = index

        this.showSlide('slideRevoke')
      },
      revoke () {
        this.$refs['formRevoke'].validate((valid) => {
          if (valid) {
            Api.revoke({id: this.row.form.id, revokeReason: this.row.form.revokeReason}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                let index = this.row.edit.index
                let data = Object.assign({}, this.table.list[index], body)
                this.table.list.splice(index, 1, data)

                // 关闭
                this.$refs['slideRevoke'].close()
              } else {
                this.$message.error(body.error || '撤销失败')
              }
            })
          }
        })
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
        if (this.search.condition.startTime !== undefined && this.search.condition.endTime !== undefined) {
          let startTime = 'startTime=' + this.search.condition.startTime
          let endTime = 'endTime=' + this.search.condition.endTime
          if (condition === '') {
            condition = '?' + startTime + '&' + endTime
          } else {
            condition = condition + '&' + startTime + '&' + endTime
          }
        }
        if (this.search.condition.payStartTime !== undefined && this.search.condition.payEndTime !== undefined) {
          let payStartTime = 'payStartTime=' + this.search.condition.payStartTime
          let payEndTime = 'payEndTime=' + this.search.condition.payEndTime
          if (condition === '') {
            condition = '?' + payStartTime
          } else {
            condition = condition + '&' + payStartTime + '&' + payEndTime
          }
        }
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
        if (this.search.condition.revoke !== undefined) {
          let revoke = 'revoke=' + this.search.condition.revoke
          if (condition === '') {
            condition = '?' + revoke
          } else {
            condition = condition + '&' + revoke
          }
        }
        if (this.search.condition.payer !== undefined) {
          let payer = 'payer=' + this.search.condition.payer
          if (condition === '') {
            condition = '?' + payer
          } else {
            condition = condition + '&' + payer
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
        if (condition === '') {
          window.location.href = '/rest/boss/platform/item-payments/download'
        } else {
          window.location.href = '/rest/boss/platform/item-payments/download' + condition
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
          let values = data.map(function (item) {
            let number
            if (item.revoke === 0) {
              number = Number(item[column.property])
            }
            return number
          }
          )
          if (column.property === 'money') {
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
        })
        sums[3] = sums[3].toFixed(2)
        return sums
      }
    }
  }
</script>

<style scoped>

</style>
