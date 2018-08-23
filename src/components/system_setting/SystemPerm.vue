<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>系统设置</el-breadcrumb-item>
        <el-breadcrumb-item>组织架构</el-breadcrumb-item>
        <el-breadcrumb-item>系统权限</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑权限' : '新增权限'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="一级标题" prop="firstLevel" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.firstLevel"></el-input>
        </el-form-item>
        <el-form-item label="二级标题" prop="secondLevel" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.secondLevel"></el-input>
        </el-form-item>
        <el-form-item label="权限名称" prop="permName" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.permName"></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="perm" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.perm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <el-table v-loading="table.loading" size="small" stripe border :data="table.list" :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="firstLevel" label="一级标题" min-width="80"></el-table-column>
      <el-table-column prop="secondLevel" label="二级标题" min-width="150"></el-table-column>
      <el-table-column prop="permName" label="权限名称" min-width="100"></el-table-column>
      <el-table-column prop="perm" label="权限" min-width="200"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
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
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/system/system-perm'
  import FormTokenApi from '@/api/system/form-token'
  import ResponseParse from '@/utils/response-parse'

  export default {
    components: {
      MsSlide
    },
    data () {
      return {
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
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeight) })
    },
    created () {
      this.table.list = []
      this.requestList()
    },
    methods: {
      requestList () {
        this.table.loading = true

        const search = Object.assign({}, this.table.pagination)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeight)
//            }
          } else {
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
      handleSizeChange (val) {
        this.table.pagination.pageSize = val
        this.requestList()
      },
      handleCurrentChange (val) {
        this.table.pagination.page = val
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
