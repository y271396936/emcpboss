<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营培训</el-breadcrumb-item>
        <el-breadcrumb-item>技巧培训</el-breadcrumb-item>
        <el-breadcrumb-item>行业资讯</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增资讯</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑资讯' : '新增资讯'"
      :width="800"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="资讯标题" prop="title" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.title"></el-input>
        </el-form-item>
        <el-form-item label="资讯内容" prop="content" :rules="[{required: true, message: '必填'}]">
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

    <div v-show="showList">
      <!--@clickH="caculatedHeight"-->
      <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

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
        <el-table-column prop="publishUserName" label="发布人" min-width="80">
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" min-width="140"></el-table-column>
        <el-table-column prop="updateUserName" label="修改人" min-width="80">
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="140"></el-table-column>
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
      <el-pagination
        class="pagination"
        layout="total, sizes, prev, pager, next,jumper"
        :current-page.sync="table.pagination.page"
        :total="table.pagination.totalRow"
        :page-size="table.pagination.pageSize"
        :page-sizes="table.pagination.pageSizes"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <ms-detail-show :detail="detail" @closeDetail="closeDetail" v-show="!showList"></ms-detail-show>

  </div>
</template>
<script>
  import MsEditor from '../common/Editor.vue'
  import Api from '@/api/platform/train-industry-information'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import ResponseParse from '@/utils/response-parse'
  import MsSlide from '@/components/common/Slide.vue'
  import MsDetailShow from '@/components/common/DetailShow'
  import MsSearch from '@/components/common/Search.vue'
  import { SEARCH_CONDITION, FormArgument, FileFormArgument } from '@/models/platform/train-industry-information'
  import FormTokenApi from '@/api/system/form-token'
  import moment from 'moment'
  export default {
    components: {
      MsEditor,
      MsSearch,
      MsSlide,
      MsDetailShow,
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
        showList: true,
        detail: {
          content: '',
          title: '',
          publishTime: '',
          publishUserName: ''
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
        },
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
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
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      seeDetail (index) {
        this.detail.content = this.table.list[index].content
        this.detail.title = this.table.list[index].title
        this.detail.publishTime = this.table.list[index].publishTime
        this.detail.publishUserName = this.table.list[index].publishUserName
        this.showList = false
      },
      backDetail () {
        this.showList = true
      },
      formatTime (value) {
        return moment(value, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD')
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
      submitServer () {
        this.$refs.upload.submit()
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              Api.modify({form: this.row.form}, response => {
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
              Api.insert({form: this.row.form}, response => {
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
<style scoped>
  .detail {
    display: flex;
    word-wrap: break-word;
    word-break: break-all;
    border:2px solid #c0c9db;
  }
  .back {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #409eff;
  }
  .icon-bg {
    color: white;
  }

  .detail-scroll {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }
  .title {
    line-height: 50px;
    font-size: 32px;
    color: #565656;
  }
  .text {
    width: 1024px;
    padding: 25px 28px;
  }
  .time-author {
    font-size: 15px;
    color: rgb(160, 160, 160);
    display: flex;
  }
  .time {
    margin-right: 10px;
  }
  .author {
    margin-left: 10px;
  }
</style>
