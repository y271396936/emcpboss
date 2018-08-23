<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目状态更新申请</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table v-loading="table.loading" size="small" stripe border :data="table.list" :fit="true">
      <el-table-column prop="itemId" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="itemName" label="项目名称" min-width="140" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemName, index=1)">{{scope.row.itemName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="genre" label="申请类型" min-width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.genre === 1">下稿</span>
          <span v-else-if="scope.row.genre === 2">暂停</span>
          <span v-else-if="scope.row.genre === 3">无效</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="申请人" min-width="90">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.operator, index=3)">{{scope.row.operator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="原因" min-width="140"></el-table-column>
      <el-table-column prop="publishTime" label="申请时间" min-width="140"></el-table-column>
      <el-table-column label="销售审批" min-width="80">
        <template slot-scope="scope">
          <ms-confirm-button v-if="scope.row.saleApproval === 0" title="通过" :popover-width="200"
                             @confirm="approve(scope.$index)">
            <p>确定同意该申请？</p>
          </ms-confirm-button>
          <ms-confirm-button v-if="scope.row.saleApproval === 0" type="text" size="small" title="拒绝" placement="top"
                             :popover-width="220" @confirm="repulse(scope.$index)">
            <el-form>
              <el-form-item label="原因">
                <el-input size="mini" type="textarea" v-model="row.reason"></el-input>
              </el-form-item>
            </el-form>
          </ms-confirm-button>
        </template>
      </el-table-column>
      <el-table-column prop="saleApproval" label="销售审批状态" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.saleApproval === -1" class="ms-success">拒绝</span>
          <span v-else-if="scope.row.saleApproval === 0" class="ms-gray">未审批</span>
          <span v-else-if="scope.row.saleApproval === 1" class="ms-gray">审批同意</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="saleRepulseReason" label="销售审批结果" min-width="140"></el-table-column>
      <el-table-column prop="saleApprovalTime" label="销售审核时间" min-width="140"></el-table-column>
      <el-table-column label="运营审批" min-width="80">
        <template slot-scope="scope">
          <ms-confirm-button v-if="(scope.row.operateApproval === 0 && scope.row.saleApproval === 1)" title="通过"
                             :popover-width="200" popover-placement="top" @confirm="approve(scope.$index)">
            <p>确定同意该申请？</p>
          </ms-confirm-button>
          <ms-confirm-button v-if="(scope.row.operateApproval === 0 && scope.row.saleApproval === 1)" type="text"
                             size="small" title="拒绝" popover-placement="top" :popover-width="220"
                             @confirm="repulse(scope.$index)">
            <el-form>
              <el-form-item label="原因">
                <el-input size="mini" type="textarea" v-model="row.reason"></el-input>
              </el-form-item>
            </el-form>
          </ms-confirm-button>
        </template>
      </el-table-column>
      <el-table-column prop="operateApproval" label="运营审批状态" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.operateApproval === -1" class="ms-success">拒绝</span>
          <span v-else-if="scope.row.operateApproval === 0" class="ms-gray">未审批</span>
          <span v-else-if="scope.row.operateApproval === 1" class="ms-gray">审批同意</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="operateRepulseReason" label="运营审批结果" min-width="140"></el-table-column>
      <el-table-column prop="operateApprovalTime" label="运营审核时间" min-width="140" fixed="right"></el-table-column>
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
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/platform/item-draft'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/platform/client-items-draf'

  export default {
    components: {
      MsConfirmButton,
      MsSearch
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
          form: {},
          reason: '',
          edit: {
            index: 0
          }
        }
      }
    },
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
      requestList () {
        this.table.loading = true

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.table.list = []
            this.$message.error(body.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      approve (index) {
        const id = this.table.list[index].id
        Api.approve({id: id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)
            this.$message.success(body.success || '操作成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      repulse (index) {
        const id = this.table.list[index].id
        if (this.row.reason === '' || this.row.reason === null || this.row.reason === undefined) {
          return this.$message.error('内容不能为空 ！! !')
        }
        Api.repulse({id: id, reason: this.row.reason}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)
            this.$message.success(body.success || '操作成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
        this.row.reason = ''
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
