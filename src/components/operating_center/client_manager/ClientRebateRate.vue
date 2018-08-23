<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>返点率</el-breadcrumb-item>
        <el-breadcrumb-item>客户返点率</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增客户返点率</el-button>
      </el-button-group>
    </el-row>

    <div ref="msSearch">
      <!--@clickH="calculatedHeight"-->
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <ms-slide title='返点修改记录' :width="500" @close="closeSlideModify()" ref="modifyHistory">
      <el-tabs>
        <el-tab-pane label="返点记录">
          <template>
            <el-table size="small" stripe border :data="this.row.rate.logList" :fit="true">
              <el-table-column property="id" label="ID" min-width="50"></el-table-column>
              <el-table-column property="changeText" label="变化" min-width="100"></el-table-column>
              <el-table-column property="operator" label="操作者" min-width="80"></el-table-column>
              <el-table-column property="publishTime" label="时间" min-width="150"></el-table-column>
            </el-table>
            <el-pagination
              class="pagination"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="row.rate.pagination.page"
              :total="row.rate.pagination.totalRow"
              :page-size="row.rate.pagination.pageSize"
              @current-change="moreRowRate()">
            </el-pagination>
          </template>
        </el-tab-pane>
      </el-tabs>
    </ms-slide>

    <ms-slide
      :title="row.edit.enabled ? '编辑客户返点率' : '新增客户返点率'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">

        <el-form-item
          v-if="!row.edit.enabled"
          label="所属客户"
          prop="customerId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select
            v-model="row.form.customerId"
            filterable
            remote
            placeholder="请输入关键字"
            :remote-method="customerLikeness"
            :loading="remote.customer.loading">
            <el-option
              v-for="customer in remote.customer.list" :key="customer.id"
              :label="customer.title"
              :value="customer.id"
              :disabled="customer.status === 0"/>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!row.edit.enabled"
          label="推广平台"
          prop="platformId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.platformId" @change="platformChange">
            <el-option
              v-for="platform in platforms" :key="platform.id"
              :label="platform.title"
              :value="platform.id"
              :disabled="platform.status === 0"/>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!row.edit.enabled"
          label="计划类型"
          prop="planTypeId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.planTypeId">
            <el-option label="产品计划" :value="1"></el-option>
            <el-option label="竞品计划" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!row.edit.enabled"
          label="返点率"
          prop="rate"
          :rules="[
            {required: true, message:'必須指定一個返點率'}
            ]">
          <el-input v-model="row.form.rate" placeholder="如：最后给到客户120%,则给120">
            <template slot="append">%,百分比</template>
          </el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="计划类型"
          prop="planTypeId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.planTypeId" :disabled="true">
            <el-option label="产品计划" :value="1"></el-option>
            <el-option label="竞品计划" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="原返点"
          prop="rate">
          <el-input v-model="row.form.rate" :disabled="true">
            <template slot="append">%,百分比</template>
          </el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="新返点"
          prop="rate1"
          :rules="[
            {required: true, message:'必須指定一個返點率'}
            ]">
          <el-input v-model="row.form.rate1" placeholder="20个字符以内">
            <template slot="append">%,百分比</template>
          </el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="生效日期"
          prop="effectiveType"
        >
          <el-select v-model="row.form.effectiveType" placeholder="--请选择--">
            <el-option label="立即生效" :value="1"></el-option>
            <el-option label="定时生效" :value="2" :disabled="true"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <el-table
      v-loading="table.loading"
      size="small" stripe border

      :data="table.list"
      cell-class-name="cell-box"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80"></el-table-column>
      <el-table-column prop="customerTitle" label="所属客户" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="searchCriteria(scope.row.customerTitle, index=1)">{{scope.row.customerTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="customerGenre" label="客户类型" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.customerGenre === 1" class="ms-success">销售客户</span>
          <span v-else-if="scope.row.customerGenre === 2" class="ms-danger">渠道客户</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="所属平台" min-width="100">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="planTypeId" label="计划类型" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.planTypeId === 1" class="ms-success">产品计划</span>
          <span v-else-if="scope.row.planTypeId === 2" class="ms-danger">竞品计划</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="rate" label="返点率" align="right" header-align="center" min-width="120" :model="row.form">
        <template slot-scope="scope">
          <span>{{scope.row.rate}}%</span>
          <template v-if="scope.row.toolEnabled">
            <ms-confirm-button
              title="改返点"
              type="icon"
              icon="pencil-square-o"
              :popover-width="400"
              @confirm="modifyRate(scope.$index)">
              <el-form label-position="left" label-width="100px" :model="row.form">
                <el-form-item
                  label="计划类型"
                >
                  <el-select v-model="scope.row.planTypeId" :disabled="true">
                    <el-option label="产品计划" :value="1"></el-option>
                    <el-option label="竞品计划" :value="2"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item

                  label="原返点"
                  prop="rate">
                  <el-input v-model="scope.row.rate" :disabled="true">
                    <template slot="append">%,百分比</template>
                  </el-input>
                </el-form-item>

                <el-form-item
                  label="新返点"
                  prop="rate1">
                  <el-input v-model="row.rate1" placeholder="20个字符以内">
                    <template slot="append">%,百分比</template>
                  </el-input>
                </el-form-item>

                <el-form-item
                  label="生效日期"
                  prop="effectiveType"
                >
                  <el-select v-model="row.effectiveType" placeholder="--请选择--">
                    <el-option label="立即生效" :value="1"></el-option>
                    <el-option label="定时生效" :value="2" :disabled="true"></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </ms-confirm-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="customerSaler" label="销售经理" min-width="100"></el-table-column>

      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>你确定要该客户吗？</p>
          </ms-confirm-button>
          <el-button type="text" size="small" @click.native.prevent="changeHistory(scope.$index)">变更历史</el-button>
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
  import FormTokenApi from '@/api/system/form-token'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import Api from '@/api/platform/rebates-rate'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import {
    FormArgument, Remote,
    SEARCH_CONDITION
  } from '@/models/platform/rebates-rate'
  import MsPlatform from '../../common/Platform'
  import CustomerApi from '@/api/platform/customer'
  import ChannelApi from '@/api/platform/channel'
  import SalerApi from '@/api/platform/spread-client'

  export default {
    components: {
      MsPlatform,
      MsSearch,
      MsSlide,
      MsConfirmButton
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
          rate: {
            logList: [],
            pagination: {}
          },
          form: new FormArgument(),
          rate1: '',
          effectiveType: ''
        },
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100,
        remote: new Remote()
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.list = []
      if (this.$route.query.customerTitle !== undefined) {
        this.search.condition.customerTitle = this.$route.query.customerTitle
        this.search.list[1].value = this.$route.query.customerTitle
      }
      this.row.rate.logList = []
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
        const platforms = {}
        PLATFORM_LIST.forEach(item => {
          platforms[item.id] = item.title
        })
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.list.forEach(item => {
              item.toolEnabled = true
              return item
            })
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 20) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
          }
          this.table.loading = false
        })
        // 获取销售经理列表
        SalerApi.salerMediumList(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.salerList = body
          } else {
            this.table.salerList = []
          }
        })
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlideModify () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      },
      moreRowRate (val) {
        this.row.rate.pagination.page = val
        this.changeHistory()
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
      addRow () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0

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
      customerLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.customer.list = []
          return
        }
        this.remote.customer.loading = true
        const search = {title: query, pageSize: 100}
        CustomerApi.likeness({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.customer.list = body
          }
          this.remote.customer.loading = false
        })
      },
      platformChange (id) {
        if (id > 0) {
          // 获得渠道列表
          this.remote.channel.loading = true
          this.row.form.channelId = ''
          ChannelApi.list({platformId: id, pageSize: 100}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.remote.channel.list = body
            }
            this.remote.channel.loading = false
          })
        }
      },
      modifyRate (index) {
        // 将新值赋值给rate
        const item = this.table.list[index]
        const params = {id: item.id, rate: this.row.rate1, effectiveType: this.row.effectiveType}
        Api.modify(params, response => {
          let status = response.status || 0
          let body = response.data || []
          let data = item
          if (status >= 200 && status <= 204) {
            item.rate = this.row.rate1
            this.$message.success(body.success || '修改成功')
          } else {
            this.$message.error(body.error || '修改失败')
          }
          this.row.rate1 = ''
          this.row.effectiveType = ''
          this.table.list[index] = data
        })
      },
      editRow (index) {
        const rows = this.table.list.slice(index, index + 1)

        this.row.form = Object.assign({}, rows[0])
        this.row.edit.enabled = true
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },
      changeHistory (index) {
        const item = this.table.list[index]
        let params = {
          id: item.id,
          page: this.row.rate.pagination.page || 1,
          pageSize: this.row.rate.pagination.pageSize || 10
        }
        Api.changeHistory(params, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            body.forEach(item => {
              item['changeText'] = '由' + item.beforeRate + '变更为' + item.rate
            })
            this.row.rate.logList = body
            this.row.rate.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.row.rate.logList = []
          }
          this.showSlide('modifyHistory')
        })
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              // 将新值赋值给rate
              this.row.form.rate = this.row.form.rate1
              Api.modify({id: this.row.form.id, form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  let index = this.row.edit.index
                  let data = Object.assign({}, this.table.list[index], body)

                  this.table.list.splice(index, 1, data)
                  this.table.list.unshift(body)
                  this.$message.success(body.success || '修改成功')
                } else {
                  this.$message.error(body.error || '修改失败')
                }
                // 关闭
                this.$refs['slideModifyRow'].close()
              })
            } else {
              Api.create({form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  const index = this.remote.customer.list.findIndex(d => d.id === body.customerId)
                  if (index !== -1) {
                    body.customerTitle = this.remote.customer.list[index].title
                    body.customerGenre = this.remote.customer.list[index].genre
                  }
                  // 新数据加到数组开头
                  this.table.list.unshift(body)
                  this.$message.success(body.success || '新增成功')
                } else {
                  this.$message.error(body.error || '新增失败')
                }
                // 关闭
                this.$refs['slideModifyRow'].close()
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
            this.list.splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cell-box {
    .el-button {
      padding: 0;
    }
  }
</style>
