<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>品牌优化</el-breadcrumb-item>
        <el-breadcrumb-item>SEO优化</el-breadcrumb-item>
        <el-breadcrumb-item>站点管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增站点</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑站点' : '新增站点'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">

        <el-form-item
          label="站点名称"
          prop="title"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.title" placeholder="20字以内"></el-input>
        </el-form-item>

        <el-form-item
          label="站点框架"
          prop="webFramework">
          <el-select v-model="row.form.webFramework">
            <el-option label="帝国CMS" :value="1"/>
          </el-select>
        </el-form-item>

        <el-form-item
          label="站点编码"
          prop="webCharset"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.webCharset">
            <el-option label="UTF-8" :value="1"/>
            <el-option label="GBK2312" :value="2"/>
            <el-option label="BIG5" :value="3"/>
          </el-select>
        </el-form-item>

        <el-form-item
          label="首页URL"
          prop="indexUrl"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.indexUrl" placeholder="以 http:// 开头"></el-input>
        </el-form-item>


        <el-form-item
          label="后台URL"
          prop="adminUrl"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.adminUrl" placeholder="以 http:// 开头"></el-input>
        </el-form-item>


        <el-form-item
          label="登录账号"
          prop="loginAccount"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.loginAccount" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          label="登录密码"
          prop="loginPassword"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.loginPassword" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          label="发布栏目父ID"
          prop="categoryPid"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-input v-model="row.form.categoryPid" placeholder="20个字符以内"></el-input>
        </el-form-item>

        <el-form-item
          label="发布栏目ID"
          prop="categoryId"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-input v-model="row.form.categoryId" placeholder="20个字符以内"></el-input>
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

      :data="recombineList"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="title" label="站点名称" min-width="140" fixed></el-table-column>
      <el-table-column prop="webFramework" label="站点框架" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.webFramework ===1">帝国CMS</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="webCharset" label="站点编码" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.webCharset === 1" class="ms-success">UTF-8</span>
          <span v-else-if="scope.row.webCharset === 2">GBK2312</span>
          <span v-else-if="scope.row.webCharset === 3">BIG5</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="adminUrl" label="后台地址" min-width="200"></el-table-column>
      <el-table-column prop="categoryPid" label="发布栏目父ID" min-width="80"></el-table-column>
      <el-table-column prop="categoryId" label="发布栏目ID" min-width="80"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0" class="ms-info">无效</span>
          <span v-else-if="scope.row.status === 1" class="ms-success">有效</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="创建时间" min-width="140"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>
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
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/seo-article-site'
  import ResponseParse from '@/utils/response-parse'
  import FormTokenApi from '@/api/system/form-token'
  import { FormArgument } from '@/models/platform/seo-article-site'

  export default {
    components: {
      MsSearch,
      MsSlide,
      MsConfirmButton
    },
    created () {
      this.table.loading = true
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
            enabled: false,
            index: 0
          },
          form: new FormArgument()
        },
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeight) })
    },
    computed: {
      recombineList () {
        let list = []
        this.table.list.forEach(item => {
          let channel = item
          list.push(channel)
        })
        return list
      }
    },
    methods: {
      requestList () {
        this.table.loading = true
        const search = Object.assign({}, this.table.pagination)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeight)
//            }
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
        let time = conditions.time || []
        this.search.condition = Object.assign({}, conditions, {startTime: time[0], endTime: time[1]})
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
        const rows = this.table.list.slice(index, index + 1)

        this.row.form = Object.assign({}, rows[0])
        this.row.edit.enabled = true
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              Api.modify({id: this.row.form.id, form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || []
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
                let body = response.data || []
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
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlideModify () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      }
    }
  }
</script>
