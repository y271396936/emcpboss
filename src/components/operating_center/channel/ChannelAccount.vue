<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>平台渠道</el-breadcrumb-item>
        <el-breadcrumb-item>平台账户</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑账户' : '新增账户'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item
          label="推广平台"
          prop="platformId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.platformId">
            <template v-for="platform in platforms">
              <el-option :label="platform.title" :value="platform.id" :disabled="platform.status === 0"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="账户类型"
          prop="genre"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.genre">
            <el-option label="无忧户「由我方公司或客户自己开户的账号，按返点收费」" :value="0"/>
            <el-option label="服务户「由客户自己开户的账号，按服务费收费」" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item
          label="账户名"
          prop="name"
          :rules="[
              {required: true, message: '必填'},
              {min: 2, max: 50, message: '长度在 50个字符以内', trigger: 'blur'}
            ]">
          <el-input v-model="row.form.name" placeholder=""/>
        </el-form-item>
        <el-form-item
          v-if="!row.edit.enabled"
          label="账户密码"
          prop="password"
          :rules="[
              {required: true, message: '必填'},
              {min: 2, max: 20, message: '长度在 20个字符以内', trigger: 'blur'}
            ]">
          <el-input v-model="row.form.password" placeholder="20个字符以内"/>
        </el-form-item>
        <el-form-item
          label="开户公司名"
          prop="company"
          :rules="[
              {required: true, message: '必填'},
              {min: 2, max: 20, message: '长度在 20个字符以内', trigger: 'blur'}
            ]">
          <el-input v-model="row.form.company" placeholder="20个字符以内"/>
        </el-form-item>
        <el-form-item
          label="版权文件URL"
          prop="copyrightUrl">
          <el-input v-model="row.form.copyrightUrl"/>
        </el-form-item>
        <el-form-item
          v-if="row.edit.enabled"
          label="状态"
          prop="status">
          <el-select v-model="row.form.status">
            <el-option label="已下稿" :value="-1"/>
            <el-option label="无效" :value="0"/>
            <el-option label="有效" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide
      title="修改账户密码"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyPassword">
      <el-form class="form" label-width="120px" size="small" :model="password.form" ref="formModifyPassword">
        <el-form-item
          label="推广平台"
          prop="platformId">
          <el-select v-model="password.form.platformId" :disabled="true">
            <template v-for="platform in platforms">
              <el-option :label="platform.title" :value="platform.id" :disabled="platform.status === 0"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          label="账户名"
          prop="name">
          <el-input v-model="password.form.name" :disabled="true"/>
        </el-form-item>
        <el-form-item
          label="账户密码"
          prop="password"
          :rules="[
              {required: true, message: '必填'},
              {min: 2, max: 20, message: '长度在 20个字符以内', trigger: 'blur'}
            ]">
          <el-input v-model="password.form.password" placeholder="20个字符以内"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPassword()">提交</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" fixed/>
      <el-table-column prop="name" label="账户名" min-width="140" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.name, index=2)">{{scope.row.name}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="推广平台" min-width="80">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="genre" label="账户类型" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.genre === 1" class="ms-info">服务户</span>
          <span v-else-if="scope.row.genre === 0" class="ms-success">无忧户</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="company" label="开户公司" min-width="200"/>
      <el-table-column prop="password" label="密码" min-width="140">
        <template slot-scope="scope">
          <!-- 查看密码操作 -->
          <template v-if="scope.row.status === 1">
            <el-tooltip v-if="scope.row.password.length > 0 && scope.row.password === '***'" content="查看密码">
              <icon name="low-vision" class="ms-icon-btn" @click.native.prevent="showPassword(scope.$index)"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.password.length < 1" content="未设置密码" class="ms-danger">
              <icon name="eye-slash"/>
            </el-tooltip>
          </template>

          <!-- 密码内容 -->
          <template>
            <code v-if="scope.row.password.length > 0 && scope.row.password !== '***'">
              {{scope.row.password}}
            </code>
            <span v-else :class="[scope.row.password !== '***' ? 'ms-danger' : '']">
              <icon v-if="scope.row.passwordLoading" name="spinner" pulse/> ***
            </span>
          </template>

          <!-- 修改密码操作 -->
          <el-tooltip v-if="scope.row.status === 1" content="修改密码">
            <icon name="pencil-square-o" class="ms-icon-btn" @click.native.prevent="editPassword(scope.$index)"/>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="copyrightUrl" label="版权文件URL" min-width="160"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <!-- 状态 -->
          <template>
            <span v-if="scope.row.status === 1" class="ms-success">有效</span>
            <span v-else-if="scope.row.status === -1" class="ms-danger">已下稿</span>
            <span v-else class="ms-gray">未知</span>
          </template>

          <!-- 上下稿操作 -->
          <template>
            <el-tooltip v-if="scope.row.status === 1" content="设置下稿">
              <icon name="arrow-circle-down" class="ms-icon-btn" @click.native.prevent="modifyStatus(scope.$index)"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status === -1" content="设置上稿">
              <icon name="arrow-circle-up" class="ms-icon-btn" @click.native.prevent="modifyStatus(scope.$index)"/>
            </el-tooltip>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>

          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除账户<code>{{scope.row.name}}</code>吗？</p>
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
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsPlatform from '@/components/common/Platform.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/channel-account'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import {
    FormArgument,
    SEARCH_CONDITION
  } from '@/models/platform/channel-account'

  export default {
    components: {
      MsSearch,
      MsSlide,
      MsConfirmButton,
      MsPlatform
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
        password: {
          index: 0,
          form: {
            password: ''
          }
        },
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
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

        // 获得 platform mapping
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
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeight - this.$refs.msSearch.clientHeight)
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
        this.search.condition = conditions
        this.requestList()
      },
      // 新增 / 编辑
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
        this.row.form = Object.assign({}, this.table.list[index])
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
                  // 重置表单
                  this.row.form = new FormArgument()

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
      showPassword (index) {
        let data = Object.assign({}, {passwordLoading: true}, this.table.list[index])
        this.table.list.splice(index, 1, data)
        Api.password({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            let rowData = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, rowData)
          } else {
            this.$message.error(body.error || '操作失败')
          }
          this.table.list[index].passwordLoading = false
        })
      },
      editPassword (index) {
        this.password.form = Object.assign({}, this.table.list[index])
        this.password.index = index

        this.showSlide('slideModifyPassword')
      },
      submitPassword () {
        this.$refs['formModifyPassword'].validate((valid) => {
          if (valid) {
            Api.modifyPassword(this.password.form, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                let index = this.password.index
                let data = Object.assign({}, this.table.list[index], body)
                this.table.list.splice(index, 1, data)

                // 关闭
                this.$refs['slideModifyPassword'].close()
              } else {
                this.$message.error(body.error || '操作失败')
              }
            })
          } else {
            return false
          }
        })
      },
      // 上下稿
      modifyStatus (index) {
        const row = this.table.list[index]
        let status
        switch (row.status) {
          case 1:
            status = -1
            break
          case -1:
            status = 1
            break
          default:
            this.$message.error('未知的状态，无法操作')
            return
        }

        Api.modifyStatus({id: row.id, status: status}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1, Object.assign({}, row, body))
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

        this.password.form = {}
        this.password.index = 0
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
