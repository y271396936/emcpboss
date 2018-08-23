<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目方案运营过程</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"/>

    <!--展示数据-->
    <div class="media-list">
      <el-card v-for="(item, index) in table.list" class="box-card" :key="item.id">
        <div class="pull-left">
          <p class="pull-left-day">
            {{item.day.toString().slice(4, 6)}}月{{item.day.toString().slice(6, 8)}}日<br>
            {{item.day.toString().slice(0, 4)}}年
          </p>
          <div>
            <!--<span class="blue" @click="checkAndApprove(item, index)">审阅</span>-->
            <ms-confirm-button title="审阅"
                               popover-placement="top"
                               :popover-width="200"
                               @confirm="checkAndApprovePresent"
                               @show="checkAndApprove(index)">
              <el-form>
                <el-form-item label="批语">
                  <el-input size="mini" placeholder="请输入批语" type="textarea" v-model="row.form.replyContent"></el-input>
                </el-form-item>
              </el-form>
              <!--<div>-->
                <!--批语: <el-input placeholder="请输入批语" type="textarea" autosize v-model="textareaValue"></el-input>-->
              <!--</div>-->
              </ms-confirm-button>
            <router-link :to="{ path: '/operating-center/item-solutions', query: { id: item.itemSolutionId }}" target="_blank">查看方案</router-link>

          </div>
        </div>
        <div class="media-body">
          <p class="media-title">
            <sub class="midel">项目：</sub><span class="midel spans">{{item.itemTitle}}</span>
            <sub class="midel">渠道：</sub><span class="midel spans">{{item.channelTitle}}</span>
            <sub class="midel">客户端：</sub>
            <span class="midel spans" v-if="item.clientId == 0">综合端</span>
            <span class="midel spans" v-if="item.clientId == 1">PC端</span>
            <span class="midel spans" v-if="item.clientId == 2">手机端</span>
            <span class="midel spans" v-if="item.clientId == 3">APP端</span>
            <el-tooltip class="item" effect="dark" content="未审阅" placement="bottom">
              <icon v-if="item.status == 0" name="check-square-o"></icon>
            </el-tooltip>
            <el-tooltip class="itemtip" effect="dark" content="已锁定" placement="bottom">
              <icon v-if="item.status == 1" name="lock" style="color: #FFA500;"></icon>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="已审阅" placement="bottom">
              <icon v-if="item.status == 2" name="check-square-o" style="color: #10C410;"></icon>
            </el-tooltip>
          </p>
          <p class="explain">
            <sub class="midel">在账户</sub><span class="midel">{{item.accountTitle}}</span><span class="midel">下</span>
            <span class="midel ms-red" v-if="item.kf53Opened == 0">未开53强制</span>
            <span v-else-if="item.kf53Opened == 1" class="ms-orange midel">已开53强制</span>
            <span class="midel" v-else>未知</span><span class="midel">由{{item.regulator}}负责运营</span>
          </p>
          <div class="out-wrap" v-if="item.content != undefined">
            <span class="blue">@{{item.operator}}:</span>
            <div v-if="item.editContent !== undefined && item.editContent !== ''" class="in-wrap" v-html="item.editContent"></div>
            <div class="in-wrap" v-else v-html="item.content"></div>
          </div>
          <div v-if="item.replyContent != undefined" class="media-content out-wrap">
            <span class="blue">@{{item.replyer}}:</span>
            <div class="in-wrap" v-html="item.replyContent"></div>
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
  import MsSearch from '@/components/common/Search.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import Api from '@/api/platform/item-operation-process'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import { FormArgument, SEARCH_CONDITION } from '@/models/platform/item-operation-process-adjust-job'
  import {
    BidOperation, FEEDBACK_STYLE, FeedbackCode, Remote, StatusPetition
  } from '@/models/platform/item-solution'

  export default {
    components: {
      MsSearch,
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
          reply: {
            index: 0
          },
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
        itemEdit: {
          form: new FormArgument()
        }
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
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
      },
      // 审查
      checkAndApprove (index) {
        this.row.reply.index = index
        this.row.form.replyContent = this.table.list[index].replyContent
      },
      checkAndApprovePresent () {
        if (this.row.form.replyContent === this.table.list[this.row.reply.index].replyContent) {
          this.$message.error('请修改审批内容后再提交!')
        } else {
          Api.amend({
            id: this.table.list[this.row.reply.index].id,
            form: this.row.form
          }, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
//              this.$set(this.table.list[this.row.reply.index], 'replyContent', body.replyContent)
              this.$set(this.table.list, this.row.reply.index, Object.assign({}, this.table.list[this.row.reply.index], body))
//              this.table.list[this.row.reply.index] = Object.assign({}, this.table.list[this.row.reply.index], body)
            } else {
              this.$message.error(body.error || '修改批语失败')
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  .blue {
    color: $color-primary-active;
  }

  .ms-list {
    .media-list {
      padding: 0 10px 0 5px;
      .box-card {
        margin-bottom: 5px;
        font-size: 12px;
        .pull-left {
          display: inline-block;
          float: left;
          width: 60px;
          margin: -21px 0 0 -10px;
          line-height: 18px;
          text-align: right;
          .pull-left-day {
            font-weight: bold;
          }
          a:link, a:visited, a:hover, a:active {
            color: $color-info;
            text-decoration: none;
          }
          span {
            display: block;
          }
        }
        .media-body {
          margin: -25px -10px -25px 60px;
          padding: 0 0 0px 8px;
          line-height: 10px;
          border-left: 2px solid #DDD;
          .midel {
            vertical-align: middle;
          }
          .media-title {
            font-size: 17.5px;
            .spans {
              font-size: 15px;
              font-weight: 700;
              margin-right: 24px;
              color: #7c7f86;
            }
          }
          .explain {
            padding-bottom: 5px;
            border-bottom: 1px dashed #DDD;
            .ms-orange {
              padding:0 28px;
              color: #FFA500;
            }
            .ms-red {
              padding:0 28px;
              color: #10c410;
            }
          }
          .out-wrap {
            padding: 10px 0;
            .in-wrap {
              padding: 10px 5px;
            }
          }
          .media-content {
            padding-left: 8px;
            border-left: 2px solid #DDD;
          }
        }
      }
    }
    .checkAndApproveBox {
      .checkAndApprove-content {
        position: fixed;
        top: 30px;
        left: 50%;
        z-index: 201;
        width: 600px;
        height: auto;
        margin-left: -300px;
        background-color: #fff;
        border: 1px solid #b2b6c0;
        box-shadow: 0 5px 20px 0 rgba(0, 0, 0, .3);
        border-radius: 4px;
        .modal-header {
          margin: -1px;
          padding-left: 15px;
          color: #fff;
          line-height: 50px;
          font-size: 17.5px;
          font-weight: bold;
          //background-color: $color-primary;
          background-color: #2c74be;
        }
        .modal-body-box {
          max-height: 400px;
          overflow-y: auto;
          border-bottom: 1px solid #000;
        }
        .modal-body {
          margin: 15px 15px 35px;
          font-size: 12px;
          background-color: #eee;
          text-align: center;
          span {
            line-height: 35px;
            vertical-align: top;
          }
          .ms-stress-left {
            padding-right: 8px;
            font-weight: bolder;
            font-size: 14px;
            color: #f00;
          }
          .ms-stress-right {
            margin-right: 15px;
          }
          textarea {
            width: 206px;
            max-width: 400px;
            height: auto;
            padding: 6px;
            margin-bottom: -2px;
            line-height: 20px;
            border: 1px solid #d4d4d4;
          }
        }
        .modal-footer {
          padding: 14px 15px 15px;
          margin-bottom: 0;
          text-align: right;
          button {
            border: rgba(0, 0, 0, .1) 1px solid;
            padding: 10px 18px;
            font-size: 12px;
            line-height: 18px;
            color: #444444;
            text-align: center;
          }
          .present {
            color: #fff;
            background-color: #009600;
          }
          .present:hover {
            background-color: #014401;
          }
          .close:hover {
            color: #fff;
            background-color: #7c798f;
          }
        }
      }
      .checkAndApprove-bg {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 200;
        background-color: rgba(0, 0, 0, .5);
      }
    }
  }
</style>
