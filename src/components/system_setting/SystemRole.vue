<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>组织架构</el-breadcrumb-item>
        <el-breadcrumb-item>系统角色</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑角色' : '新增角色'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="所属架构" prop="departmentId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.departmentId">
            <template v-for="department in departments">
              <el-option :label="department.title" :value="department.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="角色名称" prop="title" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.title"></el-input>
        </el-form-item>
        <el-form-item label="角色标识符" prop="ename">
          <el-input v-model="row.form.ename" :disabled="row.edit.enabled"></el-input>
        </el-form-item>
        <el-form-item label="角色数据范围" prop="dataScope" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.dataScope">
            <el-option label="无数据权限" :value="0"></el-option>
            <el-option label="仅本人" :value="1"></el-option>
            <el-option label="本人及当前部门" :value="2"></el-option>
            <el-option label="本部门所有" :value="3"></el-option>
            <el-option label="全部" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide
      title="角色权限管理"
      :width="650"
      @close="closeSlide()"
      ref="slideAuthorityManagement">
      <!--获取角色-->
      <label class="control-label"><span class="ms-stress">*</span>角色</label>
      <el-select v-model="partOptionsvalue" style="height:10px;" clearable placeholder="请选择" @change="partSwitching">
        <el-option
          v-for="item in partOptionsList"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
      <ul class="permission-list">
        <li v-for="item in permissionList">
          <span :class="['permission-title', item.show? 'permission-title-bg': '']" @click="clickTitle(item)">
            <i :class="item.show ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"></i>{{item.label}}
          </span>
          <ul v-for="(itemChild, index) in item.children" v-show="item.children && item.show" class="permission-list">
            <li>
              <span class="submenu-title" @click="clickChildren(itemChild)">
                <i :class="itemChild.show ? 'el-icon-caret-right' : 'el-icon-caret-bottom'"></i>
                <el-checkbox
                  :indeterminate="itemChild.isIndeterminate"
                  v-model="itemChild.checkAll"
                  @change="handleCheckAllChange(itemChild)"
                  ref="title72">
                  {{itemChild.label}}
                </el-checkbox>
              </span>
              <span v-for="submenu in itemChild.children" v-show="!itemChild.show" class="submenu-box">
                <el-checkbox-group
                  v-model="submenuList"
                  @change="handleCheckedCitiesChange(itemChild, submenu.value)">
                  <el-checkbox name="perms" :label="submenu.value" :key="submenu.value" @change="handleSubmenu">{{submenu.label}}</el-checkbox>
                </el-checkbox-group>
              </span>
            </li>
          </ul>
        </li>
      </ul>
      <span class="permission-button"><el-button type="primary" size="mini" @click="permissionSubmit">提交</el-button></span>
    </ms-slide>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table v-loading="table.loading" size="small" stripe border :data="table.list" :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="departmentTitle" label="所属部门" min-width="80" fixed></el-table-column>
      <el-table-column prop="title" label="角色名称" min-width="100">
        <template slot-scope="scope">
          <span>{{scope.row.title}}</span>
          <span v-if="scope.row.dataScope === 0">[无数据权限]</span>
          <span v-if="scope.row.dataScope === 1">[仅本人]</span>
          <span v-if="scope.row.dataScope === 2">[本人及当前部门]</span>
          <span v-if="scope.row.dataScope === 3">[本部门所有]</span>
          <span v-if="scope.row.dataScope === 4">[全部]</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <el-button type="text" size="small" @click.native.prevent="AuthorityManagement(scope.row.id)">权限</el-button>
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
  import Api from '@/api/system/system-role'
  import DepartmentApi from '@/api/system/system-department'
  import FormTokenApi from '@/api/system/form-token'
  import ResponseParse from '@/utils/response-parse'
  import permission from '@/models/system/system-role-jurisdiction'
  import { FormArgument, SEARCH_CONDITION } from '@/models/system/system-role'

  export default {
    components: {
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
          form: {},
          edit: {
            index: 0,
            enabled: false
          }
        },
        departments: [],
        permissionList: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        AddPart: new FormArgument(),
        partOptionsList: [],
        partOptionsvalue: '',
        submenuList: [],
        submenuItem: [],
        submenuValue: '',
        submenuShow: '',
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeight) })
    },
    created () {
      this.search.list = SEARCH_CONDITION
      DepartmentApi.listChild({pid: 0}, response => {
        let status = response.status || 0
        let body = response.data || []
        if (status >= 200 && status <= 204) {
          body.forEach(item => {
            this.search.list[0].config.list.push({value: item.id, label: item.title})
          })
          this.departments = body
        }
      })
      this.table.list = []
      this.requestList()

      this.permissionList = permission.permissionList
      Api.part(response => {
        let status = response.status || 0
        let body = response.data || []
        if (status >= 200 && status <= 204) {
          //        请求角色
          this.partOptionsList = body
        } else {
          this.$message.error(body.error || '角色获取失败')
        }
        this.table.loading = false
      })
    },
    methods: {
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
//            if (this.table.pagination.totalPage === this.table.pagination.page) {
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
      addRow () {
        this.row.edit.enabled = false
        this.row.edit.index = 0
        this.row.form = {}

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
      updateSubmenu (id) {
        let _this = this
        let list = []
        this.submenuList = []
        for (let item in permission.permissionList) {
          list.push(permission.permissionList[item])
        }
        Api.submenuList({id: id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            for (let item in body) {
              _this.submenuList.push(body[item].perm)
              for (let index in list) {
                for (let key in list[index].children) {
                  if (item === '0') {
                    this.$set(list[index].children[key], 'list', [])
                    this.$set(list[index].children[key], 'checkAll', false)
                    this.$set(list[index].children[key], 'isIndeterminate', false)
                  }
                  for (let value in list[index].children[key].children) {
                    if (list[index].children[key].children[value].value === body[item].perm) {
                      list[index].children[key].list.push(body[item].perm)
                    }
                  }
                  this.$set(list[index].children[key], 'checkAll', list[index].children[key].list.length === list[index].children[key].children.length)
                  this.$set(list[index].children[key], 'isIndeterminate', list[index].children[key].list.length > 0 && list[index].children[key].list.length < list[index].children[key].children.length)
                }
              }
            }
            _this.permissionList = list
          } else {
            for (let index in list) {
              for (let key in list[index].children) {
                this.$set(list[index].children[key], 'list', [])
                this.$set(list[index].children[key], 'checkAll', false)
                this.$set(list[index].children[key], 'isIndeterminate', false)
              }
            }
          }
        })
      },
      handleCheckAllChange (list) {
//        全选、全不选
        if (list.checkAll) {
          for (let key in list.children) {
            for (let value in list.list) {
              if (list.list[value] === list.children[key].value) {
                list.list = list.list.filter(function (item) {
                  return item !== list.children[key].value
                })
                this.submenuList = this.submenuList.filter(function (item) {
                  return item !== list.children[key].value
                })
              }
            }
            list.list.push(list.children[key].value)
            this.submenuList.push(list.children[key].value)
          }
        } else {
          for (let key in list.children) {
            this.submenuList = this.submenuList.filter(function (item) {
              return item !== list.children[key].value
            })
            list.list = []
          }
        }
        this.$set(list, 'checkAll', list.list.length === list.children.length)
        this.$set(list, 'isIndeterminate', list.list.length > 0 && list.list.length < list.children.length)
      },
      handleCheckedCitiesChange (list, submenu) {
        if (this.submenuShow) {
          list.list.push(submenu)
        } else {
          list.list = list.list.filter(function (item) {
            return item !== submenu
          })
        }
        this.$set(list, 'checkAll', list.list.length === list.children.length)
        this.$set(list, 'isIndeterminate', list.list.length > 0 && list.list.length < list.children.length)
      },
      handleSubmenu (val) {
//        保存子菜单选中状态
        this.submenuShow = val
      },
      AuthorityManagement (id) {
        let _this = this
        this.showSlide('slideAuthorityManagement')
        this.partOptionsvalue = id
//        获取权限
        this.updateSubmenu(id)
        this.permissionList.forEach(function (e) {
          _this.$set(e, 'show', false)
        })
        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.AddPart.token = body.token || ''
          }
        })
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              Api.modify({id: this.row.form.id, form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  this.departments.forEach(item => {
                    if (item.id === body.departmentId) {
                      body.departmentTitle = item.title
                    }
                  })
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
                  this.departments.forEach(item => {
                    if (item.id === body.departmentId) {
                      body.departmentTitle = item.title
                    }
                  })
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
      partSwitching (value) {
        this.updateSubmenu(value)
      },
      clickTitle (item) {
        let _this = this
        let show = item.show || false
        this.$set(item, 'show', !show)
//        把其他选项关闭
        _this.permissionList.forEach(function (e) {
          if (item !== e) {
            _this.$set(e, 'show', false)
          }
        })
      },
      clickChildren (item) {
        let show = item.show || false
        this.$set(item, 'show', !show)
      },
      permissionSubmit () {
        if (this.partOptionsvalue === '') {
          this.$message.error('请选择角色')
        } else {
          this.AddPart.perms = this.submenuList
          Api.addPerm({form: this.AddPart, id: this.partOptionsvalue}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.$message.success('成功')
              // 获得 form token
              FormTokenApi.create(response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  this.AddPart.token = body.token || ''
                }
              })
            } else {
              this.$message.error(body.error || '数据获取失败')
            }
            this.table.loading = false
          })
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
  .ms-list {
    .control-label {
      padding-right: 3px;
      font-weight: bold;
      .ms-stress {
        padding: 0 3px 0 13px;
        color: #f00;
      }
    }
    .permission-list {
      padding-left: 10px;
      list-style: none;
      .permission-title, .submenu-title {
        display: block;
      }
      .permission-title:hover, .submenu-title:hover {
        background-color: #eef1f6;
        cursor: pointer;
      }
      .permission-title {
        font-weight: bold;
        line-height: 25px;
        background-color: #fafafa;
        margin-bottom: 5px;
      }
      .permission-title-bg {
        background-color: #eef1f6;
      }
      .submenu-box {
        display: inline-block;
        padding-left: 10px;
        font-size: 12px;
      }
    }
    .permission-button {
      padding-left: 10px;
    }
  }
</style>

<style lang="scss">
  .submenu-box {
    .el-checkbox {
      font-size: 12px;
      .el-checkbox__label {
        font-size: 12px;
      }
      .el-checkbox__inner {
        width: 12px;
        height: 12px;
      }
      .el-checkbox__inner {
        position: static;
      }
    }
  }
</style>
