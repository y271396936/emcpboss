<template>
  <div class="ms-tree">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>组织架构</el-breadcrumb-item>
        <el-breadcrumb-item>部门架构</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRootNode()">新增部门</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="node.edit.enabled ? '编辑部门' : '新增部门'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyNode">
      <el-form class="form" label-width="120px" size="small" :model="node.form" ref="formModifyNode">
        <el-form-item v-if="node.form.pid !== 0" label="父级部门" prop="pTitle">
          <el-input v-model="node.form.pTitle" disabled/>
        </el-form-item>
        <el-form-item label="部门名称" prop="title" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="node.form.title"/>
        </el-form-item>
        <el-form-item v-if="node.edit.enabled" label="rank排序" prop="rank">
          <el-input v-model="node.form.rank"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitNode()">提交</el-button>
          <el-button v-if="!node.edit.enabled" @click="resetForm('formModifyNode')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide
      title="系统用户"
      :width="900"
      @close="closeSlide()"
      ref="slideUser">
      <el-table v-loading="table.loading" size="small" stripe border :data="table.list">
        <el-table-column prop="name" label="姓名" width="60" fixed/>
        <el-table-column prop="loginAccount" label="登录账号" width="80"/>
        <el-table-column prop="departmentTitle" label="职务" width="70"/>
        <el-table-column prop="roleTitle" label="角色" width="70"/>
        <el-table-column prop="mobile" label="手机" width="100"/>
        <el-table-column prop="qq" label="qq" width="100"/>
        <el-table-column prop="wechat" label="微信" width="100"/>
        <el-table-column prop="status" label="状态" width="50">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">有效</span>
            <span v-if="scope.row.status === 0">无效</span>
            <span v-else-if="scope.row.status === -1">已离职</span>
            <span v-else-if="scope.row.status === -1">未知</span>
          </template>
        </el-table-column>
        <el-table-column prop="entryTime" label="入职时间" width="135"/>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
            <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index)">离职</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ms-slide>

    <ms-slide
      :title="row.edit.enabled ? '编辑用户' : '新增用户'"
      :width="500"
      @close="closeSlide()"
      ref="slideUserModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="所属部门" prop="departmentTitle">
          <el-input v-model="row.form.departmentTitle" :disabled="true"/>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.roleId">
            <template v-for="role in roles">
              <el-option :label="role.title" :value="role.id"/>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="jobNumber" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.jobNumber" placeholder="纯数字" :disabled="row.edit.enabled"/>
        </el-form-item>
        <el-form-item
          label="登录账号"
          prop="loginAccount"
          :rules="[
            {required: true, message: '必填'},
            {min: 6, max: 16, message: '长度在16个字符以内', trigger: 'blur'}
            ]">
          <el-input v-model="row.form.loginAccount" placeholder="以字母开头，由字母、数字、下划线组成的6-16位字符串"/>
        </el-form-item>
        <el-form-item
          label="登录密码"
          prop="password"
          :rules="[
            {min: 8, message: '长度最少8个字符', trigger: 'blur'}
            ]" v-if="row.edit.enabled">
          <el-input v-model="row.form.password" placeholder="不修改密码请留空"/>
        </el-form-item>
        <el-form-item
          label="登录密码"
          prop="password"
          :rules="[
            {required: true, message: '必填'},
            {min: 8, message: '长度最少8个字符', trigger: 'blur'},
            { validator: validatePass, trigger: 'blur'}
            ]" v-if="!row.edit.enabled">
          <el-input v-model="row.form.password" placeholder="最少8位，必须包含字母、数字"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.name"/>
        </el-form-item>
        <el-form-item label="手机" prop="mobile" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.mobile"/>
        </el-form-item>
        <el-form-item label="QQ" prop="qq">
          <el-input v-model="row.form.qq"/>
        </el-form-item>
        <el-form-item label="微信" prop="wechat">
          <el-input v-model="row.form.wechat"/>
        </el-form-item>
        <el-form-item label="入职时间" prop="entryTime" :rules="[{required: true, message: '必填'}]">
          <el-date-picker
            v-model="row.form.entryTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            :disabled="row.edit.enabled">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="row.form.remark"/>
        </el-form-item>
        <el-form-item v-if="row.edit.enabled" label="状态" prop="status" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.status">
            <el-option label="有效" :value="1"/>
            <el-option label="无效" :value="0"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide
      title="离职"
      :width="500"
      @close="closeSlide()"
      ref="slideDeleteUser">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formDeleteRow">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="row.form.name" :disabled="true"/>
        </el-form-item>
        <el-form-item label="离职原因" prop="leaveReason" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.leaveReason"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="deleteUser()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formDeleteRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <el-tree
      lazy
      node-key="id"
      :props="tree.props"
      :load="loadChild"
      :expand-on-click-node="false"
      ref="tree">
      <p class="option" slot-scope="{ node, data }">
        <span>{{node.label}}</span>
        <span>
          <el-button size="mini" :type="node.level === 1 ? 'warning' : 'text'" @click="() => remove(data)">删除</el-button>
          <el-button size="mini" :type="node.level === 1 ? 'primary' : 'text'" @click="() => modify(node, data)">编辑</el-button>
          <el-button type="primary" size="mini" @click="() => createChild(node, data)">新增子部门</el-button>
          <el-button type="primary" size="mini" @click="() => showUser(data.id)">查看用户</el-button>
          <el-button type="primary" size="mini" @click="() => createUser(data)">新增用户</el-button>
        </span>
      </p>
    </el-tree>
  </div>
</template>

<script>
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/system/system-department'
  import UserApi from '@/api/system/system-user'

  export default {
    components: {
      MsSlide,
      MsConfirmButton
    },
    data () {
      return {
        channels: [],
        tree: {
          props: {
            children: 'children',
            label: 'title'
          }
        },
        table: {
          list: []
        },
        node: {
          edit: {
            enabled: false,
            index: 0
          },
          form: {}
        },
        row: {
          form: {},
          edit: {
            enabled: false,
            index: 0
          }
        },
        roles: []
      }
    },
    // created () {
    //   Api.listChild({pid: 0}, response => {
    //     let status = response.status || 0
    //     let body = response.data || []
    //     if (status === 200 || status === 204) {
    //       this.tree.list = body
    //     }
    //   })
    // },
    methods: {
      loadChild (node, resolve) {
        this.resolve = resolve

        if (node.level === 0) {
          Api.listChild({pid: 0}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status === 200 || status === 204) {
              return resolve(body)
            }
          })
        } else {
          Api.listChild({pid: node.data.id}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status === 200 || status === 204) {
              node.data = Object.assign({}, node.data, {children: body})
              return resolve([])
            }
          })
        }

        return resolve([])
      },
      resolve () {
        // [修复][element-ui 2.2.0][el-tree]
        // 保存 loadChild 中的 resolve 方法，在动态加载节点，需要使用该方法防止 element-ui 无限渲染 bug
      },
      // renderContent (h, {node, data, store}) {
      //   return (
      //     <p style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
      //       <span>{node.label}</span>
      //       <span>
      //         <el-button size="mini" type={node.level === 1 ? 'warning' : 'text'} on-click={ () => this.delete(node, data) }>删除</el-button>
      //         <el-button size="mini" type={node.level === 1 ? 'primary' : 'text'} on-click={ () => this.modify(node, data) }>编辑</el-button>
      //         <el-button type="primary" size="mini" on-click={() => this.createChild(node, data) }>新增子部门</el-button>
      //         <el-button type="primary" size="mini" on-click={() => this.showUser(data.id) }>查看用户</el-button>
      //         <el-button type="primary" size="mini" on-click={() => this.createUser(data) }>新增用户</el-button>
      //       </span>
      //     </p>)
      // },
      addRootNode () {
        this.node.form = {}
        this.node.form.pid = 0
        this.node.form.title = ''

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.node.form.token = body.token || ''
          }
        })

        this.showSlide('slideModifyNode')
      },
      createChild (node, data) {
        this.node.form = {}
        this.node.form.pid = data.id
        this.node.form.pTitle = data.title

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.node.form.token = body.token || ''
          }
        })

        this.showSlide('slideModifyNode')
      },
      modify (node, data) {
        this.node.form = Object.assign({}, data)
        this.node.edit.enabled = true
        if (data.pid > 0) {
          this.node.form.pTitle = node.parent.label
        }

        this.showSlide('slideModifyNode')
      },
      submitNode () {
        this.$refs['formModifyNode'].validate((valid) => {
          if (valid) {
            if (this.node.edit.enabled) {
              Api.modify({id: this.node.form.id, form: this.node.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  const node = this.$refs['tree'].getNode(this.node.form.id)
                  node.data = Object.assign({}, node.data, body)
                  this.resolve([])

                  // 关闭
                  this.$refs['slideModifyNode'].close()
                } else {
                  this.$message.error(body.error || '修改失败')
                }
              })
            } else {
              Api.create({form: this.node.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  this.$refs['tree'].append(body, this.node.form.pid)
                  this.resolve([])

                  // 关闭
                  this.$refs['slideModifyNode'].close()
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
      remove (data) {
        Api.delete({id: data.id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.$refs['tree'].remove(data.id)
            this.resolve([])
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      showUser (id) {
        Api.listUser({pid: id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.showSlide('slideUser')
          } else {
            this.$message.error(body.error || '该部门暂时没有员工')
          }
        })
      },
      createUser (data) {
        this.row.form = {}
        this.row.form.departmentId = data.id
        this.row.form.departmentTitle = data.title
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

        // 获取该部门下的所有角色
        Api.listRole({pid: data.id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.roles = body.map.roles
          }
        })

        this.showSlide('slideUserModifyRow')
      },
      editRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.enabled = true
        this.row.edit.index = index
        this.row.form.password = ''

        // 获取该部门下的所有角色
        this.roles = []
        Api.listRole({pid: this.row.form.departmentId}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.roles = body.map.roles
          }
        })
        this.$refs['slideUser'].close()
        this.showSlide('slideUserModifyRow')
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              UserApi.modify({id: this.row.form.id, form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  let index = this.row.edit.index
                  let data = Object.assign({}, this.table.list[index], body)
                  this.table.list.splice(index, 1, data)

                  // 关闭
                  this.$refs['slideUserModifyRow'].close()
                  this.showSlide('slideUser')
                } else {
                  this.$message.error(body.error || '修改失败')
                }
              })
            } else {
              UserApi.create({form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  // 关闭
                  this.$refs['slideUserModifyRow'].close()
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
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.index = index

        this.$refs['slideUser'].close()
        this.showSlide('slideDeleteUser')
      },
      deleteUser () {
        this.$refs['formDeleteRow'].validate((valid) => {
          if (valid) {
            UserApi.delete({id: this.row.form.id, leaveReason: this.row.form.leaveReason}, response => {
              let status = response.status || 0
              let body = response.data || []
              if (status >= 200 && status <= 204) {
                let index = this.row.edit.index
                this.table.list.splice(index, 1)

                // 关闭
                this.$refs['slideDeleteUser'].close()
                this.showSlide('slideUser')
              } else {
                this.$message.error(body.error || '离职失败')
              }
            })
          }
        })
      },
      validatePass (rule, value, callback) {
        let regp = /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/
        if (regp.test(value)) {
          callback()
        } else {
          callback(new Error('必须包含字母和数字!'))
        }
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.node.form = {}
        this.node.edit = {}
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
