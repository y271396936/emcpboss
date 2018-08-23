<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价管理</el-breadcrumb-item>
        <el-breadcrumb-item>53快服管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑53账户' : '新增53账户'"
      :width="500" @close="closeSlide()" ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="所属项目" prop="itemId" :rules="[{required: true, message: '必填'}]">
          <el-select
            v-model="row.form.itemId"
            placeholder="请输入关键字"
            filterable remote
            :remote-method="itemLikeness"
            :loading="remote.item.loading"
            :disabled="row.edit.enabled">
            <el-option
              v-for="item in remote.item.list" :key="item.id"
              :label="item.title"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="53快服账号" prop="loginAccount">
          <el-input v-model="row.form.loginAccount" :disabled="row.edit.enabled"/>
        </el-form-item>
        <el-form-item label="53快服密码" prop="password">
          <el-input v-if="row.form.password === '***'" placeholder="无修改密码的权限" disabled/>
          <el-input v-else v-model="row.form.password" placeholder="不修改密码请留空"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small"

      stripe border fit
      :data="table.list"
      :span-method="columnSpanMethod">
      <el-table-column prop="id" label="ID" min-width="40" fixed/>
      <el-table-column prop="itemTitle" label="所属项目" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=0)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="loginAccount" label="账号名称" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.loginAccount, index=1)">{{scope.row.loginAccount}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="password" label="密码" min-width="150">
        <template slot-scope="scope">
          <!--&lt;!&ndash; 查看密码操作 &ndash;&gt;-->
          <!--<template v-if="scope.row.status === 1">-->
            <!--<el-tooltip v-if="scope.row.password.length > 0 && scope.row.password === '***'" content="查看密码">-->
              <!--<icon name="low-vision" class="ms-icon-btn" @click.native.prevent="showPassword(scope.$index)"/>-->
            <!--</el-tooltip>-->
            <!--<el-tooltip v-if="scope.row.password.length < 1" content="未设置密码" class="ms-danger">-->
              <!--<icon name="eye-slash"/>-->
            <!--</el-tooltip>-->
          <!--</template>-->

          <!-- 密码内容 -->
          <template>
            <code v-if="scope.row.password.length > 0 && scope.row.password !== '***'">
              {{scope.row.password}}
            </code>
            <span v-else :class="[scope.row.password !== '***' ? 'ms-danger' : '']">
              <icon v-if="scope.row.passwordLoading" name="spinner" pulse/> ***
            </span>
          </template>

          <!--&lt;!&ndash; 修改密码操作 &ndash;&gt;-->
          <!--<template v-if="scope.row.toolEnabled && scope.row.status === 1">-->
            <!--<ms-confirm-button-->
              <!--title="修改密码"-->
              <!--type="icon"-->
              <!--icon="pencil-square-o"-->
              <!--:popover-width="220"-->
              <!--@confirm="modifyPassword(scope.$index)">-->
              <!--<el-input v-model="scope.row.newPassword" size="small" placeholder="请输入内容"/>-->
            <!--</ms-confirm-button>-->
          <!--</template>-->
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <!-- 状态 -->
          <template>
            <span v-if="scope.row.status === 1" class="ms-success">有效</span>
            <span v-else-if="scope.row.status === -1" class="ms-danger">已下稿</span>
            <span v-else class="ms-gray">未知</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除ID为<code>{{scope.row.id}}</code>的53快服账号吗？</p>
          </ms-confirm-button>
          <el-button type="text" size="small" @click.native.prevent="login(scope.$index)">登录</el-button>
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
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import Api from '@/api/platform/53kf-account'
  import FormTokenApi from '@/api/system/form-token'
  import ItemApi from '@/api/platform/item'
  import ResponseParse from '@/utils/response-parse'
  import { Remote, SEARCH_CONDITION } from '@/models/platform/53kf-account'

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
          form: {},
          edit: {
            enabled: false,
            index: 0
          }
        },
        remote: new Remote()
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
    computed: {
      mergerInfo () {
        let mergerIndex = []
        let value = ''
        if (this.table.list.length > 0) {
          this.table.list.forEach((item, index) => {
            if (index === 0) {
              value = item.loginAccount
            } else {
              if (value !== item.loginAccount) {
                value = item.loginAccount
                mergerIndex.push(index - 1)
              }
            }
          })
          mergerIndex.push(this.table.list.length - 1)
        }

        let mergerInfo = {}
        if (mergerIndex.length > 0) {
          mergerIndex.forEach((item, index, array) => {
            if (index === 0) {
              mergerInfo[0] = item + 1
            } else {
              mergerInfo[array[index - 1] + 1] = array[index] - array[index - 1]
            }
          })
        }

        return mergerInfo
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
          if (status >= 200 && status <= 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 20) {
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
      columnSpanMethod ({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 2) {
          const rowspan = this.mergerInfo[rowIndex]
          if (rowspan !== undefined) {
            return {
              rowspan: rowspan,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      itemLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.item.list = []
          return
        }

        this.remote.item.loading = true
        ItemApi.likeness({title: query}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.item.list = body
          }
          this.remote.item.loading = false
        })
      },
      addRow () {
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

        this.remote.item.list.push({id: this.row.form.itemId, title: this.row.form.itemTitle})

        this.showSlide('slideModifyRow')
      },
      submit () {
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
                  this.$message.success('修改成功')
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
                  this.remote.item.list.forEach(item => {
                    if (item.id === body.itemId) {
                      body.itemTitle = item.title
                    }
                  })
                  this.table.list.unshift(body)

                  // 关闭
                  this.$refs['slideModifyRow'].close()
                  this.$message.success('新增成功')
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
            this.$message.error(body.error || '删除失败')
          }
        })
      },
      login (index) {
        const response = Api.asyncGetUrl({id: this.table.list[index].id})
        const status = response.status || 0
        const body = response.data || {}
        if (status >= 200 && status <= 204) {
          const url = body.url + '&ms_token=' + body.token + '&ms_cookie=' + body.cookie +
            '&ms_session=' + body.session + '&ms_key=' + body.key + '&ms_time=' + body.time + '&ms_mode=' + body.mode
          this.$open.window(url, 'Kf53Login')
        } else {
          this.$message.error(body.error || '获取登陆链接失败')
        }
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
