<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>品牌优化</el-breadcrumb-item>
        <el-breadcrumb-item>营销服务</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group v-show="showList">
        <el-button type="primary" size="small" @click="addRow()">新增营销服务</el-button>
      </el-button-group>
    </el-row>

    <div ref="msSearch" v-show="showList"><ms-search :data="search.list" @click="updateConditions"/></div>

    <ms-slide
      :title="row.edit.enabled ? '编辑营销' : '新增营销'"
      :width="800"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="营销标题" prop="title" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.title"></el-input>
        </el-form-item>
        <el-form-item label="略缩图" prop="picture">
          <el-input v-model="row.form.picture" disabled></el-input>
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
              <el-button size="small" type="success" @click="submitServer()" :disabled="row.form.picture === ''">
                {{row.form.picture !== '' ? '上传到服务器' : '缩略图上传成功'}}
              </el-button>
              <div v-if="row.form.picture !== ''"></div>
              <div slot="tip">只能上传jpg/png文件，且不超过1M</div>
            </el-upload>
            <img class="upload-img" :src="row.form.picture">
          </div>
        </el-form-item>
        <el-form-item label="营销分类" prop="categoryId" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.categoryId" placeholder="请选择您的营销服务分类">
            <el-option v-for="item in category" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营销内容" prop="content" :rules="[{required: true, message: '必填'}]">
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
      v-show="showList"
      :data="recombineList"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="categoryName" label="分类" min-width="80" fixed></el-table-column>
      <el-table-column prop="title" label="标题" min-width="200" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.title, index=0)">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="publishUserName" label="发布人" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.publishUserName, index=1)">{{scope.row.publishUserName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" min-width="140"></el-table-column>
      <el-table-column label="操作" min-width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>你确定要删除标题<code>{{scope.row.title}}</code>吗？</p>
          </ms-confirm-button>
          <el-button type="text" size="small" @click.native.prevent="seeDetail(scope.$index)"> 查看 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ms-detail-show :detail="detail" @closeDetail="closeDetail" v-show="!showList"></ms-detail-show>
    <el-pagination
      v-show="showList"
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
  import MsDetailShow from '@/components/common/DetailShow'
  import Api from '@/api/platform/marketing-service'
  import ResponseParse from '@/utils/response-parse'
  import { FormArgument, SEARCH_CONDITION, FileFormArgument } from '@/models/platform/marketing-service'
  import FormTokenApi from '@/api/system/form-token'

  export default {
    components: {
      MsEditor,
      MsSearch,
      MsSlide,
      MsDetailShow,
      MsConfirmButton
    },
    created () {
      let categoryList = []
      Api.getCategory(response => {
        let status = response.status || 0
        let body = response.data || []
        if (status === 200 || status === 204) {
          this.category = body
          body.forEach(item => {
            categoryList.push({value: item.id, label: item.name})
          })
        }
      })
      this.search.list = SEARCH_CONDITION
      this.search.list[0].config.list = categoryList
      this.table.list = []
      this.requestList()
    },
    data () {
      return {
        category: [],
        showList: true,
        detail: {
          content: '',
          title: '',
          publishTime: '',
          publisher: ''
        },
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
        }
      }
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
      closeDetail () {
        this.showList = true
      },
      seeDetail (index) {
        this.detail.content = this.table.list[index].content
        this.detail.title = this.table.list[index].title
        this.detail.publishTime = this.table.list[index].publishTime
        this.detail.publisher = this.table.list[index].publishUserName
        this.showList = false
      },
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
                this.$set(this.row.form, 'picture', body.url)
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
            let form = Object.assign({}, this.row.form, {type: 1})
            if (this.row.edit.enabled) {
              Api.modify({id: this.row.form.id, form: form}, response => {
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
              Api.create({form: form}, response => {
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
