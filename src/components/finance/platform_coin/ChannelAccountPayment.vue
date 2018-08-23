<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>平台款项</el-breadcrumb-item>
        <el-breadcrumb-item>平台打款记录</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">下载</el-button>
      </el-button-group>
    </el-row>

    <ms-slide title="撤销平台打款" :width="500" @close="closeSlide()" ref="slideRevoke">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formRevoke">
        <el-form-item label="所属平台" prop="platformId">
          <el-select v-model="row.form.platformId" :disabled="true">
            <template v-for="platform in platforms">
              <el-option :label="platform.title" :value="platform.id" :disabled="platform.status === 0"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="平台账户" prop="accountTitle">
          <el-input v-model="row.form.accountTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="推广渠道" prop="channelTitle">
          <el-input v-model="row.form.channelTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="设备客户端" prop="clientId">
          <el-select v-model="row.form.clientId" :disabled="true">
            <el-option label="PC端" :value="1"></el-option>
            <el-option label="手机端" :value="2"></el-option>
            <el-option label="APP" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值金额">
          <el-input v-model="row.form.money" :disabled="true">
            <template slot="append">元</template>
          </el-input>
          <el-input v-model="row.form.coin" :disabled="true">
            <template slot="prepend">共</template>
            <template slot="append">点</template>
          </el-input>
        </el-form-item>
        <el-form-item label="撤销原因" prop="revokeReason" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.revokeReason" placeholder="请认真填写"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="revoke()">提交</el-button>
          <el-button @click="resetForm('formRevoke')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="accountTitle" label="账户名称" min-width="140">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=1)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="所属平台" min-width="70">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="channelTitle" label="推广渠道" min-width="110"></el-table-column>
      <el-table-column prop="clientId" label="客户端" min-width="60">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"/>
        </template>
      </el-table-column>
      <el-table-column prop="money" :formatter="formatMoney" label="充值金额(元)" align="right" header-align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="coin" :formatter="formatMoney" label="充值点数(点)" align="right" header-align="center" min-width="100">
      </el-table-column>
      <el-table-column prop="payTime" label="充值时间" min-width="140"></el-table-column>
      <el-table-column prop="payer" label="操作人" min-width="60"></el-table-column>
      <el-table-column label="状态" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.revoke === 0" class="ms-success">正常</span>
          <span v-else class="ms-danger">已撤销</span>
        </template>
      </el-table-column>
      <el-table-column prop="revokeReason" label="撤销原因" min-width="100"></el-table-column>
      <el-table-column prop="revokeOperator" label="撤销人" min-width="60"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
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
  import MsDevice from '@/components/common/Device.vue'
  import MsPlatform from '@/components/common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/channel-account-payment'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import { SEARCH_CONDITION } from '@/models/platform/channel-account-payment'

  export default {
    components: {
      MsDevice,
      MsPlatform,
      MsSearch,
      MsSlide
    },
    created () {
      this.search.list = SEARCH_CONDITION

      let date = []
      date[0] = moment().format('YYYY-MM-01')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.condition.date = date
      this.search.list[0].value = date

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
          form: {}
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
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
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
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
      },
      deleteRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.index = index

        this.showSlide('slideRevoke')
      },
      revoke () {
        Api.revoke(this.row.form, response => {
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
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
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
          if (column.property === 'money' || column.property === 'coin') {
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
          if (column.property === 'money' || column.property === 'coin') {
            sums[index] = sums[index].toFixed(2)
          }
        })

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
            if (text === 'date' && value !== '') {
              search = '?startTime=' + value[0] + '&endTime=' + value[1]
            } else {
              if (value !== '') {
                search = '?' + text + '=' + value
              }
            }
          } else {
            if (text === 'date' && value !== '') {
              search = '&startTime=' + value[0] + '&endTime=' + value[1]
            } else {
              if (value !== '') {
                search += '&' + text + '=' + value
              }
            }
          }
        })
        window.location.href = '/rest/boss/platform/channel-account-payments/files' + search
      }
    }
  }
</script>

<style scoped>

</style>
