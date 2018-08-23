<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>CDN刷新管理</el-breadcrumb-item>
        <el-breadcrumb-item>CDN账号管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="addRow()">新增CDN账号</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑CDN账号' : '新增CDN账号'"
      :width="500"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item
          label="IDC服务商"
          prop="idcId"
          :rules="[
              {required: true, message: '请选择 IDC服务商'}
            ]">
          <el-select v-model="row.form.idcId" placeholder="请选择IDC服务商">
            <el-option label="阿里云" :value="1"></el-option>
            <el-option label="腾讯云" :value="2"></el-option>
            <el-option label="百度云" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="登陆账号"
          prop="loginAccount"
          :rules="[
          {required: true, message: '请填写登陆账号'}
        ]">
          <el-input v-model="row.form.loginAccount" placeholder="20个字符以内" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="关联手机"
          prop="mobile"
          :rules="[
          {required: true, message: '请填写关联手机号'},
          {type: 'number', maxlength: 11, message: '手机号一般为11位数字', trigger: 'blur'}
        ]">
          <el-input v-model.number="row.form.mobile" placeholder="一般为11个字符" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="ACCESS KEY"
          prop="accessKey"
          :rules="[
          {required: true, message: '请填写ACCESS KEY'}
        ]">
          <el-input v-model="row.form.accessKey" placeholder="20个字符以内" clearable></el-input>
        </el-form-item>
        <el-form-item
          label="ACCESS SECRET"
          prop="accessSecret"
          :rules="[
          {required: true, message: '请填写ACCESS SECRET'}
        ]">
          <el-input v-model="row.form.accessSecret" placeholder="20个字符以内" clearable></el-input>
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
      <el-table-column prop="idcId" label="IDC服务商" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.idcId === 1">阿里云</span>
          <span v-else-if="scope.row.idcId === 2">腾讯云</span>
          <span v-else-if="scope.row.idcId === 3">百度云</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="loginAccount" label="账号" min-width="120">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.loginAccount, index=1)">{{scope.row.loginAccount}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="关联手机" min-width="120"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">有效</span>
          <s v-else-if="scope.row.status === 0">无效</s>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
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
  import MsSlide from '@/components/common/Slide.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/cdn-account'
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
          name: 'idcId',
          title: 'IDC服务商',
          placeholder: '--请选择IDC服务商--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: '1', label: '阿里云'},
              {value: '2', label: '腾讯云'},
              {value: '3', label: '百度云'}
            ]
          }
        },
        {
          name: 'loginAccount',
          title: '登陆账号',
          placeholder: '登陆账号，可模糊查询',
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
            idcId: '',
            loginAccount: '',
            mobile: '',
            accessKey: '',
            accessSecret: '',
            status: ''
          }
        },
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
      editRow (index) {
        this.row.form = Object.assign({}, this.list[index])
        this.row.edit.enabled = true
        this.row.edit.index = index

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
