<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>工作流程</el-breadcrumb-item>
        <el-breadcrumb-item>工作反聩</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click.native.prevent="addRow()"><strong>+</strong>新增反馈</el-button>
      </el-button-group>
    </el-row>
    <ms-search :data="search.list" @click="updateConditions"/>

    <ms-slide
      style="z-index: 2"
      :title="row.edit.enabled ? '编辑反馈' : '新增反馈'"
      :width="500"
      ref="slideFeedbackRow">
      <KindEditor :editContents="row.edit.enabled ? row.form : {}" @click="coupleBack"></KindEditor>
    </ms-slide>

    <!--展示数据-->
    <div v-for="(item, index) in table.list" class="media-list">
      <el-card class="box-card">
        <div style="margin: -10px 0;">
          <div class="pull-left">
            <p><strong>{{item.publishTime.toString().slice(5, 10)}}</strong></p>
            <p><strong>{{item.userName}}</strong></p>
            <div class="box-card-margin">
              <el-button class="blue" type="text" size="small" @click.native.prevent="editRow(item, index)">编辑
              </el-button>
            </div>
            <div>
              <el-button v-if="item.read == 0" class="blue" type="text" size="small" @click.native.prevent="readRow(item, index)">已读
              </el-button>
            </div>
          </div>
          <div class="media-body">
            <p class="media-body-top">
              针对 <span class="blue">@{{item.atUserName}}</span> 的评估汇报如下：
              <span v-if="item.read == 1" class="ms-green">已读</span>
              <span v-else-if="item.read == 0" class="ms-read-status">未读</span>
            </p>
            <strong>工作</strong>：
            <p v-html="item.work"></p>
            <div v-if="item.mindset" class="media ms-approval">
              <div class="media-body">
                <strong>心态</strong>：
                <p v-html="item.mindset"></p>
              </div>
            </div>
            <div v-if="item.proposal" class="media ms-approval">
              <div class="media-body">
                <strong>建议</strong>：
                <p v-html="item.proposal"></p>
              </div>
            </div>
            <div v-if="item.remark" class="media ms-approval">
              <div class="media-body">
                <strong>备注</strong>：
                <p>{{item.remark}}</p>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

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
  import KindEditor from '@/components/workflow/FeedbackEditor.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/bid-work-feedback'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import {
    FormArgument,
    SEARCH_CONDITION
  } from '@/models/platform/bid-work-feedback'
  import {
    BidOperation, FEEDBACK_STYLE, FeedbackCode, Remote,
    StatusPetition
  } from '@/models/platform/item-solution'

  export default {
    components: {
      MsSearch,
      MsSlide,
      KindEditor
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
          option: {
            index: 0,
            id: 0
          },
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument(),
          statusPetition: new StatusPetition(),
          feedbackCode: new FeedbackCode(),
          bidOperation: new BidOperation()
        },
        remote: new Remote(),
        checkAndApproveShow: false,
        itemSolution: {},
        textareaValue: '',
        itemEdit: {
          form: new FormArgument()
        },
        newToken: ''
      }
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.loading = true
      this.table.list = []
      this.requestList()
    },
    computed: {
      platforms () {
        return PLATFORM_LIST
      },
      feedbackStyle () {
        const list = [
          {label: 'PC 页面', list: []},
          {label: '手机页面', list: []}
        ]
        FEEDBACK_STYLE.forEach(item => {
          if (item.clientId === 1) {
            list[0].list.push(item)
          } else if (item.clientId === 2) {
            list[1].list.push(item)
          }
        })
        return list
      }
    },
    methods: {
      // 操作按钮显示逻辑
      cellMouseEnter (row, column, cell, event) {
        // 判断是否显示操作图标
        const oldIndex = this.row.option.index
        const index = this.table.list.findIndex(item => item.id === row.id)
        if (oldIndex !== index || index === 0) {
          this.table.list[oldIndex].toolEnabled = false

          this.row.option.index = index
          this.row.option.id = row.id
          row.toolEnabled = true

          this.row.statusPetition = new StatusPetition()
        }
      },
      // 列表
      requestList () {
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        this.table.loading = true
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
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
//      新增
      addRow () {
        this.row.edit.enabled = false
        this.row.edit.index = 0
        this.row.form = {}
        // 重新获得 form token
        this.newToken = ''
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.newToken = body.token || ''
          }
        })
        this.showSlide('slideFeedbackRow')
      },
      editRow (item, index) {
        this.row.edit.index = index
        this.row.form.id = item.id
        this.row.form.atUserName = item.atUserName
        this.row.form.work = item.work
        this.row.form.mindset = item.mindset
        this.row.form.proposal = item.proposal
        this.row.form.remark = item.remark
        this.row.edit.enabled = true
        this.showSlide('slideFeedbackRow')
      },
      coupleBack (conditions) {
        let formList = conditions
        if (this.row.edit.enabled) {
          Api.modify({id: formList.id, form: formList}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              let index = this.row.edit.index
              let data = Object.assign({}, this.table.list[index], body)
              this.$set(this.table.list, index, data)
              // 关闭
              this.$refs['slideFeedbackRow'].close()
            } else {
              this.$message.error(body.error || '修改失败')
            }
          })
        } else {
          formList.token = this.newToken
          Api.create({form: formList}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              // 新数据加到数组开头
              body.read = 0
              this.table.list.unshift(body)
              // 关闭
              this.$refs['slideFeedbackRow'].close()
            } else {
              this.$message.error(body.error || '新增失败')
            }
          })
        }
      },
      // 是否已读
      readRow (item, index) {
        this.row.form = item
        this.row.edit.enabled = true
        this.row.edit.item = item
        Api.modifyStatus({id: this.row.form.id, status: this.row.form.status}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            let data = Object.assign({}, item[index], body)
//            this.$set(this.table.list, index, data)
            this.table.list[index].read = data.read
            this.$message.success('修改成功')
          } else {
            this.$message.error(response.data.error || '修改失败')
          }
        })
      },
      showSlide (ref) {
        this.$refs[ref].show()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/env";

  .blue {
    color: $color-primary-active;
  }

  .blue:hover {
    color: $color-primary;
    text-decoration: underline;
  }

  .ms-green {
    color: $color-success;
  }

  .ms-list {
    .editor {
      margin: 10px 22px;
    }
    .media-list {
      .box-card {
        width: 99.5%;
        margin-bottom: 5px;
      }
      .pull-left {
        float: left;
        min-width: 45px;
        margin-right: 10px;
        margin-top: -5px;
        text-align: right;
        p {
          margin: 4px 0;
        }
        div {
          height: 15px;
        }
        .box-card-margin {
          margin-top: -8px;
        }
      }
      .media-body {
        position: relative;
        zoom: 1;
        margin-bottom: 3px;
        padding-left: 10px;
        border-left: #ccc 2px solid;
        overflow: hidden;
        .media-body-top {
          margin-bottom: 5px;
          .ms-read-status {
            color: #ff0000;
          }
        }
        p {
          margin: 0;
        }
        .media {
          margin-top: 5px;
        }
      }
    }
  }
</style>
