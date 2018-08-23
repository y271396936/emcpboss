<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目方案预算修改申请</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-slide title="拒绝预算申请" :width="500" @close="closeSlide()" ref="slideRepulse">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formRepulse">
        <el-form-item label="日期" prop="day">
          <el-input v-model="row.form.day" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="申请人" prop="operator">
          <el-input v-model="row.form.operator" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="预算" prop="beforeBudget">
          <el-input v-model="row.form.beforeBudget" :disabled="true">
            <template slot="prepend">由</template>
          </el-input>
          <el-input v-model="row.form.budget" :disabled="true">
            <template slot="prepend">更改为</template>
          </el-input>
        </el-form-item>
        <el-form-item label="拒绝原因" prop="repulseReason" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.repulseReason" placeholder="快捷选择">
            <el-option label="申请人和运营专员不一致" value="申请人和运营专员不一致"></el-option>
            <el-option label="申请原因不符合实情" value="申请原因不符合实情"></el-option>
          </el-select>
          <el-input v-model="row.form.repulseReason" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="resetForm('formRepulse')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table v-loading="table.loading" size="small" stripe border :data="table.list" :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="day" label="预算日期" min-width="75"></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=1)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="channelTitle" label="推广渠道" min-width="80"></el-table-column>
      <el-table-column prop="accountTitle" label="渠道账户" min-width="80">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.accountGenre === 1" content="服务户">
            <icon name="user"/>
          </el-tooltip>
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=3)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="clientId" label="设备客户端" min-width="60">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"/>
        </template>
      </el-table-column>
      <el-table-column prop="beforeBudget" label="原预算" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.beforeBudget.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="budget" label="新预算" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.budget.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="申请人" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.operator, index=4)">{{scope.row.operator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="申请原因" min-width="150"></el-table-column>
      <el-table-column prop="publishTime" label="申请时间" min-width="140"></el-table-column>
      <el-table-column prop="approver" label="审批人" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.approver, index=6)">{{scope.row.approver}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="repulseReason" label="拒绝原因" min-width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.approval === -1">
            <span v-if="scope.row.repulseReason.length > 0">{{scope.row.repulseReason}}</span>
            <span v-else>未填写拒绝理由</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="approvalTime" label="审批时间" min-width="140"></el-table-column>
      <el-table-column prop="approval" label="审核状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.approval === -1" class="ms-danger">拒绝</span>
          <span v-else-if="scope.row.approval === 0">未审核</span>
          <span v-else-if="scope.row.approval === 1" class="ms-success">同意</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="80">
        <template slot-scope="scope">
          <ms-confirm-button v-if="scope.row.approval === 0"
                             title="通过"
                             popover-placement="top"
                             :popover-width="220"
                             @confirm="approve"
                             @show="showApprove(scope.$index)">
            <el-form>
              <el-form-item label="原因(若原因不合理, 请进行修改)">
                <el-input size="mini" type="textarea" v-model="row.form.reason"></el-input>
              </el-form-item>
            </el-form>
          </ms-confirm-button>
          <el-button v-if="scope.row.approval === 0" type="text" size="small"
                     @click.native.prevent="repulse(scope.$index)">拒绝
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
      @current-change="handleCurrentChange"/>

  </div>
</template>

<script>
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsDevice from '@/components/common/Device.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/item-solution-budget-petition'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION, FormArgument } from '@/models/platform/item-solution-budget-petition'

  export default {
    components: {
      MsConfirmButton,
      MsDevice,
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
          form: new FormArgument(),
          edit: {
            index: 0
          }
        }
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    created () {
      this.search.list = SEARCH_CONDITION

      this.table.loading = true
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
          if (status >= 200 && status <= 204) {
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
      showApprove (index) {
        this.$set(this.row.form, 'reason', this.table.list[index].reason)
        this.row.edit.index = index
      },
      approve () {
        Api.approve({
          id: this.table.list[this.row.edit.index].id,
          form: this.row.form
        }, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            let data = Object.assign({}, this.table.list[this.row.edit.index], body)
            this.table.list.splice(this.row.edit.index, 1, data)
            this.$message.info('已同意该项目方案的预算修改申请')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      repulse (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.index = index
        this.showSlide('slideRepulse')
      },
      submit () {
        Api.repulse(this.row.form, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            let index = this.row.edit.index
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)

            // 关闭
            this.$refs['slideRepulse'].close()
          } else {
            this.$message.error(body.error || '拒绝失败')
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
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.row.form = {}
        this.row.edit.index = 0
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
