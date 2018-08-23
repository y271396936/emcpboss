<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营培训</el-breadcrumb-item>
        <el-breadcrumb-item>信息流</el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button v-show="showList" type="primary" size="small" @click="addRow()">新增数据分析</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.edit.enabled ? '编辑数据分析' : '新增数据分析'"
      :width="800"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="案例标题" prop="title" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.title"></el-input>
        </el-form-item>
        <el-form-item label="案例内容" prop="content" :rules="[{required: true, message: '必填'}]">
          <ms-editor v-model="row.form.content" width="650px" height="600px" :textId="'contentWord'"></ms-editor>
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

        :data="table.list"
        :fit="true">
        <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
        <el-table-column prop="title" label="标题" min-width="200" fixed>
          <template slot-scope="scope">
            <a href="javascript:;"  @click="searchCriteria(scope.row.title, index=0)">{{scope.row.title}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="publisher" label="发布人" min-width="80">
          <template slot-scope="scope">
            <a href="javascript:;" @click="searchCriteria(scope.row.publisher, index=1)">{{scope.row.publisher}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="publishTime" label="发布时间" min-width="140"></el-table-column>
        <el-table-column prop="updator" label="更新人" min-width="80">
          <template slot-scope="scope">
            <a href="javascript:;" @click="searchCriteria(scope.row.updator, index=2)">{{scope.row.updator}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" min-width="140"></el-table-column>
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
        layout="total, sizes, prev, pager, next, jumper"
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
  import Api from '@/api/platform/train-information-analysic'
  import ResponseParse from '@/utils/response-parse'
  import MsSlide from '@/components/common/Slide.vue'
  import MsDetailShow from '@/components/common/DetailShow'
  import MsSearch from '@/components/common/Search.vue'
  import {SEARCH_CONDITION, FormArgument} from '@/models/platform/train-information-analysic'
  import FormTokenApi from '@/api/system/form-token'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import moment from 'moment'
  export default {
    components: {
      MsSearch,
      MsSlide,
      MsDetailShow,
      MsEditor,
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
          form: new FormArgument()
        }
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
        this.detail.publisher = this.table.list[index].publisher
        this.showList = false
      },
      backDetail () {
        this.showList = true
      },
      formatTime (value) {
        return moment(value, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD')
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
      closeSlide () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      },
      closeTrainSlide () {
        this.row.form = {}
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
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
