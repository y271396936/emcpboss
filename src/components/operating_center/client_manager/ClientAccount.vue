<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>客户账号</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增客户账号</el-button>
      </el-button-group>
    </el-row>

    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <ms-slide
      :title="row.edit.enabled ? '编辑账号' : '新增账号'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item
          v-if="!row.edit.enabled"
          label="所属客户"
          prop="customerId"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-select
            v-model="row.form.customerId"
            filterable
            remote
            placeholder="请输入关键字"
            :remote-method="customerLikeness"
            :loading="remote.customer.loading"
          >
            <el-option
              v-for="customer in remote.customer.list" :key="customer.id"
              :label="customer.title"
              :value="customer.id"
              :disabled="customer.status === 0"/>
          </el-select>
        </el-form-item>

        <el-form-item label="头像" prop="thumbnail" v-if="row.edit.enabled">
          <el-input v-model="row.form.thumbnail" disabled></el-input>
          <div class="upload">
            <el-upload
              class="upload-server"
              ref="upload"
              action="/rest/support/editor/kind/files"
              :http-request="userDefinedUpload"
              :file-list="row.fileList"
              :auto-upload="false"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              list-type="picture">
              <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
              <el-button size="small" type="success" @click="submitServer()">
                上传到服务器
              </el-button>
              <div v-if="row.form.thumbnail !== ''"></div>
              <div slot="tip">只能上传jpg/png文件，且不超过1M</div>
            </el-upload>
            <img class="upload-img" :src="row.form.thumbnail">
          </div>
        </el-form-item>

        <el-form-item label="头像" prop="thumbnail" v-if="!row.edit.enabled" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.thumbnail" disabled></el-input>
          <div class="upload">
            <el-upload
              class="upload-server"
              ref="upload"
              action="/rest/support/editor/kind/files"
              :http-request="userDefinedUpload"
              :file-list="row.fileList"
              :auto-upload="false"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              list-type="picture">
              <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
              <el-button size="small" type="success" @click="submitServer()" :disabled="row.form.thumbnail === ''">
                {{row.form.thumbnail !== '' ? '上传到服务器' : '头像图上传成功'}}
              </el-button>
              <div v-if="row.form.thumbnail !== ''"></div>
              <div slot="tip">只能上传jpg/png文件，且不超过1M</div>
            </el-upload>
            <img class="upload-img" :src="row.form.thumbnail">
          </div>
        </el-form-item>

        <el-form-item
          label="角色"
          prop="role">
          <el-input v-model="row.form.role" :disabled="true"></el-input>
        </el-form-item>

        <el-form-item
          label="登录账号"
          prop="loginAccount"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-input v-model="row.form.loginAccount" placeholder="以字母开头,由字母、数字、下划线组成6-16位字符串"></el-input>
        </el-form-item>

        <el-form-item
          label="登录密码"
          prop="password"
          v-if="row.edit.enabled"
        >
          <el-input v-model="row.form.password" placeholder="不修改密码请留空"></el-input>
        </el-form-item>

        <el-form-item
          label="登录密码"
          prop="password1"
          v-if="!row.edit.enabled"
        >
          <el-input v-model="row.form.password1" placeholder="最少6位,建议字母,数字,特殊字符组合"></el-input>
        </el-form-item>

        <el-form-item
          label="姓名"
          prop="name" v-if="row.edit.enabled"

        >
          <el-input v-model="row.form.name" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          label="手机"
          prop="mobile"
          v-if="row.edit.enabled"
        >
          <el-input v-model="row.form.mobile" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          label="姓名"
          prop="name1"
          v-if="!row.edit.enabled"
          :rules="[
              {required: true, message: '必填'},
            ]"
        >
          <el-input v-model="row.form.name1" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          label="手机"
          prop="mobile1"
          v-if="!row.edit.enabled"
          :rules="[
              {required: true, message: '必填'},
            ]"
        >
          <el-input v-model="row.form.mobile1" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="后台模式"
          prop="systemMode"
        >
          <el-select v-model="row.form.systemMode">
            <el-option label="旧系统模式" :value="0"></el-option>
            <el-option label="新平台模式" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="状态"
          prop="status"
        >
          <el-select v-model="row.form.status">
            <el-option label="无效" :value="0"></el-option>
            <el-option label="有效" :value="1"></el-option>
            <el-option label="未知" :value="-1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设置查看数据开始时间" v-if="row.edit.enabled" prop="readStartTime">
          <!--<el-input placeholder="格式:20180501"  v-model="row.form.readStartTime"></el-input>-->
          <el-date-picker
            v-model="row.form.readStartTime"
            type="date"
            value-format="yyyyMMdd"
            placeholder="选择日期">
          </el-date-picker>
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
      <el-table-column prop="id" label="ID" min-width="80"></el-table-column>
      <el-table-column prop="customerTitle" label="客户名称" min-width="120">
        <template slot-scope="scope">
          <a href="javascript:;"
             @click="searchCriteria(scope.row.customerTitle, index=0)">{{scope.row.customerTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="loginAccount" label="登录账号" min-width="140">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.loginAccount, index=1)">{{scope.row.loginAccount}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" min-width="100"></el-table-column>
      <el-table-column prop="systemMode" label="后台模式" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.systemMode === 0" class="ms-success">旧系统模式</span>
          <span v-else-if="scope.row.systemMode === 1" class="ms-gray">新平台模式</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">有效</span>
          <span v-else-if="scope.row.status === 0" class="ms-gray">无效</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="registerTime" label="注册时间" min-width="140"></el-table-column>
      <el-table-column prop="readStartTime" label="设置查看数据开始时间" min-width="140"></el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录时间" min-width="140"></el-table-column>
      <el-table-column prop="creater" label="创建者" min-width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" min-width="150">
        <template slot-scope="scope">
          <router-link
            :to="{path:'/customer-center/login-analysis/',query:{userId:scope.row.id, customerId: scope.row.customerId, customer:scope.row.customerTitle}}"
            target="_blank">登录分析
          </router-link>
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>你确定要删除账户<code>{{scope.row.name}}</code>吗？</p>
          </ms-confirm-button>
          <el-button type="text" size="small" @click.native.prevent="ssoLogin(scope.row.id)">SSO</el-button>
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
  import Api from '@/api/platform/customer-user'
  import ResponseParse from '@/utils/response-parse'
  import {
    FormArgument, Remote,
    SEARCH_CONDITION, FileFormArgument
  } from '@/models/platform/customer-user'
  import CustomerApi from '@/api/platform/customer'
  import LoginApi from '@/api/system/user'

  export default {
    components: {
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
          fileList: [],
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument(),
          fileForm: new FileFormArgument()
        },
        remote: new Remote()
      }
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.list = []
      this.requestList()
    },
    computed: {
      recombineList () {
        let statusTexts = {
          1: '有效',
          0: '无效'
        }
        let list = []
        this.table.list.forEach(item => {
          let channel = item
          if (item.hasOwnProperty('status')) {
            channel.statusText = statusTexts[item.status] || '未知'
          }
          list.push(channel)
        })

        return list
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
      addRow () {
        this.row.form = {}
        this.row.form.role = '超级管理员'
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
      editRow (index) {
        const rows = this.table.list.slice(index, index + 1)
        this.row.form = Object.assign({}, rows[0])
        this.row.form.role = '超级管理员'
        this.row.form.password = ''
        if (this.row.form.roleId === 0) {
          this.row.form.role = '超级管理员'
        }
        this.row.edit.enabled = true
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },
      ssoLogin (id) {
        LoginApi.ssoLogin({id: id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            if (body.type === 'customer') {
              window.location.href = '/'
            } else {
              this.$message.error(body.error || '跳转失败')
            }
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
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
              this.row.form.mobile = this.row.form.mobile1
              this.row.form.name = this.row.form.name1
              this.row.form.password = this.row.form.password1
              Api.create({form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  const index = this.remote.customer.list.findIndex(d => d.id === body.customerId)
                  if (index !== -1) {
                    body.customerTitle = this.remote.customer.list[index].title
                  }
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
      beforeAvatarUpload (file) {
        let format = ['gif', 'jpg', 'jpeg', 'png', 'bmp']
        let index = format.findIndex(suffix => 'image/' + suffix === file.type)
        if (index === -1) {
          this.$message.error('上传头像图片的格式必须为: gif, jpg, jpeg, png, bmp')
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 1

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
          return false
        }
        return true
      },
      userDefinedUpload (item) {
        this.row.fileForm.imgFile = item.file
        Api.thumbnailUpload({form: this.row.fileForm}, response => {
          if (response !== undefined) {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              if (body.error === 0) {
                this.$set(this.row.form, 'thumbnail', body.url)
                this.$message.success('略缩图上传成功')
              } else {
                this.$message.error(body.message || '略缩图上传失败')
              }
            } else {
              this.$message.error(body.message || '略缩图上传失败')
            }
          }
        })
      },
      submitServer () {
        this.$refs.upload.submit()
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      updateConditions (conditions) {
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      closeSlideModify () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      }
    }
  }
</script>
