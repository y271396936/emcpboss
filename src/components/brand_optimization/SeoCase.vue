<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>品牌优化</el-breadcrumb-item>
        <el-breadcrumb-item>优化案例</el-breadcrumb-item>
        <el-breadcrumb-item>案例发布</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增案例</el-button>
      </el-button-group>
    </el-row>
    <!--@clickH="caculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <ms-slide
      :title="row.edit.enabled ? '编辑案例' : '新增案例'"
      :width="800"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="案例标题" prop="title" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.title"></el-input>
        </el-form-item>
        <el-form-item label="略缩图" prop="thumbnail" :rules="[{required: true, message: '必填'}]">
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
                {{row.form.thumbnail !== '' ? '上传到服务器' : '缩略图上传成功'}}
              </el-button>
              <div v-if="row.form.thumbnail !== ''"></div>
              <div slot="tip">只能上传jpg/png文件，且不超过1M</div>
            </el-upload>
            <img class="upload-img" :src="row.form.thumbnail">
          </div>
        </el-form-item>
        <el-form-item label="案例内容" prop="content" :rules="[{required: true, message: '必填'}]">
          <ms-editor v-model="row.form.content" width="650px" height="600px"></ms-editor>
        </el-form-item>
        <el-form-item v-if="row.edit.enabled && row.form.flag" label="是否撤回" prop="revoke"
                      :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.revoke">
            <el-option label="不撤回" :value="false"/>
            <el-option label="撤回" :value="true"/>
          </el-select>
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
      <el-table-column prop="title" label="标题" min-width="200" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.title, index=0)">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="publisher" label="发布人" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.publisher, index=1)">{{scope.row.publisher}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" min-width="140"></el-table-column>
      <el-table-column prop="reviewer" label="审批人" min-width="80"></el-table-column>
      <el-table-column prop="flag" label="审批状态" min-width="80">
        <template slot-scope="scope">
          <template>
            <span v-if="scope.row.flag === false" class="ms-danger">未审批</span>
            <span v-else-if="scope.row.flag === true" class="ms-success">已审批</span>
            <span v-else class="ms-gray">未知</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="reviewTime" label="审批时间" min-width="140"></el-table-column>
      <el-table-column label="操作" min-width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>你确定要删除标题<code>{{scope.row.title}}</code>吗？</p>
          </ms-confirm-button>

          <span v-if="scope.row.flag !==true">
            <ms-confirm-button title="审批" @confirm="applyRow(scope.$index)">
            <p>您确定要审批标题<code>{{scope.row.title}}</code>吗？同意之后无法再次更改</p>
          </ms-confirm-button>
          </span>

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
  import MsEditor from '../common/Editor.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/seo-case-show'
  import ResponseParse from '@/utils/response-parse'
  import { FormArgument, SEARCH_CONDITION, FileFormArgument } from '@/models/platform/seo-case-show'
  import FormTokenApi from '@/api/system/form-token'

  export default {
    components: {
      MsEditor,
      MsSearch,
      MsSlide,
      MsConfirmButton
    },
    created () {
      this.search.list = SEARCH_CONDITION
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
          fileList: [],
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument(),
          fileForm: new FileFormArgument()
        },
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
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
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      caculatedHeight () {
        this.$nextTick(function () {
          this.$set(this, 'tbHeight', this.PHeight - this.$refs.msSearch.clientHeight)
        })
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
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 20) {
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
      deleteRow (index) {
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(body.error || '删除失败')
          }
        })
      },
      applyRow (index) {
        const item = this.table.list[index]
        Api.applyCase({id: item.id}, response => {
          let status = response.status || 0
          let body = response.data || []
          let data = item
          if (status >= 200 && status <= 204) {
//            this.table.list.splice(index, 1)
//            data = Object.assign({}, item, body)
            this.$message.success('审批成功')
          } else {
            this.$message.error(body.error || '审批失败')
          }
          this.table.list[index] = data
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
//            debugger
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
                  this.$message.success('修改成功')
                } else {
                  this.$message.error(body.error || '修改失败')
                }
                // 关闭
                this.$refs['slideModifyRow'].close()
              })
            } else {
              Api.create({form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  // 新数据加到数组开头
                  this.table.list.unshift(body)
                  this.$message.success('新增成功')
                } else {
                  this.$message.error(body.error || '新增失败')
                }
                // 关闭
                this.$refs['slideModifyRow'].close()
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
      closeSlide () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      }
    }
  }
</script>

<style lang="scss" scoped="">
  .ms-list {
    .upload {
      display: flex;
      .upload-server {
        width: 300px;
      }
      .upload-img {
        max-height: 167px;
        min-height: 167px;
      }
    }
  }
</style>
