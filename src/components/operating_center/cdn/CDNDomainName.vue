<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>CDN刷新管理</el-breadcrumb-item>
        <el-breadcrumb-item>CDN域名管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addRow()">新增CDN域名</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑CDN域名' : '新增CDN域名'"
      :width="500"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="所属账号" prop="accountId" :rules="[{required: true, message: '请选择所属账号'}]">
          <el-select v-model="row.form.accountId">
            <template v-for="account in accounts">
              <el-option v-if="account.idcId === 1" :label="account.loginAccount + '-' + '阿里云'"
                         :value="account.id"></el-option>
              <el-option v-else-if="account.idcId === 2" :label="account.loginAccount + '-' + '腾讯云'"
                         :value="account.id"></el-option>
              <el-option v-else-if="account.idcId === 3" :label="account.loginAccount + '-' + '百度云'"
                         :value="account.id"></el-option>
              <el-option v-else :label="account.loginAccount + '-' + '未知'" :value="account.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="域名前缀" prop="subDomain" :rules="[{required: true, message: '请填写域名前缀'}]">
          <el-input v-model="row.form.subDomain" placeholder="域名前缀" clearable>
            <template slot="append">.</template>
          </el-input>
        </el-form-item>
        <el-form-item label="域名" prop="domain" :rules="[{required: true, message: '请填写域名'}]">
          <el-input v-model="row.form.domain" placeholder="域名，如 qudao51.com" clearable></el-input>
        </el-form-item>
        <el-form-item
          v-if="row.edit.enabled"
          label="状态"
          prop="status">
          <el-select v-model="row.form.status">
            <el-option label="无效" :value="0"></el-option>
            <el-option label="有效" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>
    <!--<ms-search :data="search" @click="updateConditions" @clickH="calculatedHeight"></ms-search>-->
    <div ref="msSearch"><ms-search :data="search" @click="updateConditions"/></div>

    <el-table
      v-loading="loading"
      class="element-table"
      size="small" stripe border

      :data="list"
      :highlight-current-row="true"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="idcId" label="IDC服务商" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.idcId === 1">阿里云</span>
          <span v-else-if="scope.row.idcId === 2">腾讯云</span>
          <span v-else-if="scope.row.idcId === 3">百度云</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="loginAccount" label="账号" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.loginAccount === '请刷新后查看'" class="ms-warning">{{ scope.row.loginAccount }}</span>
          <span v-else>{{ scope.row.loginAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="domain" label="域名" min-width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.domain !== ''">
            {{ scope.row.subDomain }}.
            <a href="javascript:;" @click="searchCriteria(scope.row.domain, index=0)">{{scope.row.domain}}</a>
          </span>
          <span v-else>
            <a href="javascript:;" @click="searchCriteria(scope.row.domain, index=0)">{{scope.row.domain}}</a>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">有效</span>
          <s v-else-if="scope.row.status === 0">无效</s>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <el-alert
              title="警告"
              type="warning"
              description="您确定要删除此行信息？"
              :show-icon="true">
            </el-alert>
          </ms-confirm-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pagination.page"
      :total="pagination.totalRow"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import Api from '@/api/platform/cdn-domain'
  import AccountApi from '@/api/platform/cdn-account'
  import MsSlide from '@/components/common/Slide.vue'
  import FormTokenApi from '@/api/system/form-token'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE } from '@/utils/constants'

  export default {
    components: {
      MsSlide,
      MsSearch,
      MsConfirmButton
    },
    created () {
      this.search = [
        {
          name: 'domain',
          title: '主域名',
          placeholder: '主域名，须全部',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'status',
          title: '状态',
          placeholder: '--状态--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: '1', label: '有效'},
              {value: '0', label: '无效'}
            ]
          }
        }
      ]
      this.list = []
      this.requestList()
    },
    data () {
      return {
        search: [],
        list: [],
        loading: false,
        row: {
          edit: {
            enabled: false,
            index: 0
          },
          form: {
            token: '',
            accountId: '',
            domain: '',
            subDomain: '',
            status: ''
          }
        },
        accounts: [],
        pagination: {}
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search[index], 'value', val)
      },
//      calculatedHeight () {
//        this.$nextTick(function () {
//          this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//        })
//      },
      requestList () {
        this.loading = true
        let params = Object.assign({}, {page: this.pagination.page, pageSize: this.pagination.pageSize},
          this.search.condition)
        Api.list(params, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.list = body
            this.pagination = ResponseParse.pagination(response.headers)
//            if (this.pagination.totalPage === this.pagination.page && body.length <= 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.list = []
            this.$message.error(body.error || '获取数据失败')
          }
          this.loading = false
        })
      },
      handleSizeChange (val) {
        this.pagination.pageSize = val
        this.requestList()
      },
      handleCurrentChange (val) {
        this.pagination.page = val
        this.requestList()
      },
      updateConditions (conditions) {
        this.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      editRow (index) {
        this.row.form = Object.assign({}, this.list[index])
        this.row.edit.enabled = true
        this.row.edit.index = index

        let account = this.accounts
        if (account.length < 1 || account === undefined) {
          this.getAllAccount()
        }
        this.showSlide('slideModifyRow')
      },
      getAllAccount () {
        // 获取 所有有效的CDN账号
        AccountApi.getAccounts(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.accounts = body
          }
        })
      },
      addRow () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0

        this.getAllAccount()

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
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              Api.modify(this.row.form, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  let index = this.row.edit.index
                  let data = Object.assign({}, this.list[index], body)
                  // 将原值替换为修改后的值
                  this.list.splice(index, 1, data)

                  this.$message.success('编辑成功')
                  // 关闭
                  this.$refs['slideModifyRow'].close()
                }
              })
            } else {
              Api.create(this.row.form, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  if (body.loginAccount === undefined) {
                    body.loginAccount = '请刷新后查看'
                  }
                  // 新数据加到数组开头
                  this.list.unshift(body)

                  // 提示
                  this.$message.success('新增成功')

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
        Api.delete({id: this.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.list.splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(body.error || '删除失败')
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .element-table th {
  height: 48px;
  }

</style>
