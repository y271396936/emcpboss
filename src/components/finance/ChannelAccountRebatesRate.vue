<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>返点率</el-breadcrumb-item>
        <el-breadcrumb-item>推广平台返点</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增账户返点</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑账户返点' : '新增账户返点'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="推广平台" prop="platformId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.platformId" @change="getChannel" :disabled="row.edit.enabled">
            <template v-for="platform in platforms">
              <el-option :label="platform.title" :value="platform.id" :disabled="platform.status === 0"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道账户" prop="accountId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.accountId" filterable remote placeholder="请输入关键字"
                     :remote-method="accountLikeness" :loading="remote.account.loading" :disabled="row.edit.enabled">
            <el-option v-for="account in remote.account.list" :key="account.id" :label="account.name"
              :value="account.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="推广渠道" prop="channelId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.channelId" :disabled="row.edit.enabled">
            <template v-for="channel in channels">
              <el-option :label="channel.title" :value="channel.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="客户端" prop="clientId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.clientId" :disabled="row.edit.enabled">
            <el-option label="PC端" :value="1"></el-option>
            <el-option label="手机端" :value="2"></el-option>
            <el-option label="APP" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="返点率" prop="rate" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.rate" placeholder="如：充值后获得120%，则填120">
            <template slot="append">%，百分比</template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>

    </ms-slide>

    <ms-slide
      title="账户返点率修改记录"
      :width="600"
      @close="closeLogSlide()"
      ref="slideLogModifyRow">

      <el-table :data="tableData.list"
                v-loading="tableData.loading"
                style="width: 100%;margin-left: 5px"
                max-height="850"
                size="small" stripe border>
        <el-table-column prop="id" label="ID" min-width = 50></el-table-column>
        <el-table-column prop="channelAccountRebatesRateId" label="返点ID" min-width = 70></el-table-column>
        <el-table-column label="变更前返点" min-width =100>
          <template slot-scope="scope">
            <span>{{scope.row.originRate}}%</span>
          </template>
        </el-table-column>
        <el-table-column label="变更后返点"  min-width = 100>
          <template slot-scope="scope">
            <span>{{scope.row.toRate}}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="day" label="变更日期" min-width = 150></el-table-column>
        <el-table-column prop="operator" label="操作者"></el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :current-page.sync="tableData.pagination.page"
        :total="tableData.pagination.totalRow"
        :page-size="tableData.pagination.pageSize"
        :page-sizes="tableData.pagination.pageSizes"
        @size-change="tableDataSizeChange"
        @current-change="tableDataCurrentChange">
      </el-pagination>

    </ms-slide>

    <!--<ms-search :data="search.list" @click="updateConditions"/>-->
    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="accountTitle" label="渠道账户" min-width="160">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=1)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="推广平台" min-width="80">
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
      <el-table-column label="返点率" min-width="60" align="right" header-align="center">
        <template slot-scope="scope">
          <span>{{scope.row.rate}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="160">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click ="showChangLog(scope.$index)">返点变更记录</el-button>
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>

          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除账户<code>{{scope.row.accountTitle}}</code>的返点吗？</p>
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
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsDevice from '@/components/common/Device.vue'
  import MsPlatform from '@/components/common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import AccountApi from '@/api/platform/channel-account'
  import FormTokenApi from '@/api/system/form-token'
  import PlatformApi from '@/api/platform/platform'
  import Api from '@/api/platform/channel-account-rebates-rate'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import {
    Remote,
    SEARCH_CONDITION
  } from '@/models/platform/channel-account-rebates-rate'

  export default {
    components: {
      MsConfirmButton,
      MsDevice,
      MsPlatform,
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
        tableData: {
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
        remote: new Remote(),
        channels: []
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
    mounted: function () {
      this.$nextTick(function () {
        this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
      })
    },
    created () {
      this.search.list = SEARCH_CONDITION

      this.table.list = []
      this.requestList()
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
      requestChangLogList () {
        this.tableData.loading = true
        const search = Object.assign({}, this.tableData.pagination)
        Api.changLogList({id: this.table.list[this.row.edit.index].id, search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.tableData.list = body
            this.tableData.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.tableData.list = []
            this.$message.error(body.error || '数据获取失败')
          }
          this.tableData.loading = false
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
      tableDataSizeChange (val) {
        this.tableData.pagination.pageSize = val
        this.requestChangLogList()
      },
      tableDataCurrentChange (val) {
        this.tableData.pagination.page = val
        this.requestChangLogList()
      },
      updateConditions (conditions) {
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      getChannel () {
        this.channels = []
        PlatformApi.channels({id: this.row.form.platformId}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.channels = body
          } else {
            this.channels = []
          }
        })
      },
      accountLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.account.list = []
          return
        }

        this.remote.account.loading = true
        AccountApi.likeness({search: {platformId: this.row.form.platformId, name: query}}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.account.list = body
          }
          this.remote.account.loading = false
        })
      },
      addRow () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0

        this.remote.account.list = []

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
        this.remote.account.list = []
        this.channels = []
        this.remote.account.list.push({id: this.row.form.accountId, name: this.row.form.accountTitle})
        this.channels.push({id: this.row.form.channelId, title: this.row.form.channelTitle})

        this.showSlide('slideModifyRow')
      },
      showChangLog (index) {
        this.row.edit.index = index
        this.showSlide('slideLogModifyRow')
        this.requestChangLogList()
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              let index = this.row.edit.index
              Api.modify({id: this.row.form.id, form: this.row.form, originRate: this.table.list[index].rate}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
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
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
          } else {
            this.$message.error(body.error || '操作失败')
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
      closeLogSlide () {
        this.tableData.list = []
        this.row.edit.index = 0
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style scoped>

</style>
