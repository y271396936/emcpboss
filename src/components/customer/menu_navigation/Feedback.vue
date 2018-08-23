<template>
  <div class="wrap-list">

    <el-row class="operation button-wrap">
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">
          <icon name="cloud-download"/>&nbsp;&nbsp;留言导出
        </el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="row.title"
      :width="500"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="起止日期" :rules="[{required: true, message: '请选择起止日期'}]">
          <el-col>
            <el-date-picker
              v-model="row.form.date"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              :value-format="row.format"
              clearable>
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="导出项目" prop="id" :rules="[{required: true, message: '请选择导出项目'}]">
          <el-select v-model="row.form.id">
            <template v-for="item in items">
              <el-option :label="item.title" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="已读状态" prop="readStatus" :rules="[{required: true, message: '请选择已读状态'}]">
          <el-select v-model="row.form.readStatus">
            <el-option label="不限" :value="-1"></el-option>
            <el-option label="未读" :value="0"></el-option>
            <el-option label="已读" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导出格式" prop="fileGenre" :rules="[{required: true, message: '请选择导出格式'}]">
          <el-select v-model="row.form.fileGenre">
            <el-option label="CSV格式" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="exportFile()">导出</el-button>
          <el-button @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <!-- 原来的留言表格
    <el-table
      class="element-table"
      size="small"
      stripe border
      :data="table.list"
      :highlight-current-row="true"
      :fit="true"
    >
      <el-table-column type="expand" min-width="20">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="联系人">
              <span>{{ scope.row.contacts }}</span>
            </el-form-item>
            <el-form-item label="身份证">
              <span>{{ scope.row.idCard }}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{ scope.row.mobile }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ scope.row.phone }}</span>
            </el-form-item>
            <el-form-item label="QQ">
              <span>{{ scope.row.qq }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ scope.row.address }}</span>
            </el-form-item>
            <el-form-item label="IP地区">
              <span>{{ scope.row.ipArea }}</span>
            </el-form-item>
            <el-form-item label="留言内容" class="content">
              <span>{{ scope.row.content }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="ID" prop="id" min-width="80">
        <template slot-scope="scope">
          <!--未读：标记切换
          <span v-if="scope.row.readStatus === 0">
            <!--原来的未读状态
            <img src="../../../../static/images/unread.png" height="13" alt="未读"/>
            <icon name="envelope" style="color:#ff1a2b;"></icon>
          </span>
          <!--已读：标记切换
          <span v-else>
            <icon name="envelope-open" style="color:#409eff;"></icon>
          </span>
          <!--列表的ID列
          <template>{{scope.row.id}}</template>
        </template>
      </el-table-column>
      <el-table-column label="项目" prop="itemTitle">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.customerTitle" placement="top">
            <span>{{scope.row.itemTitle}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="客户端" prop="clientId" min-width="50">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"></ms-device>
        </template>
      </el-table-column>
      <el-table-column label="来自" prop="genreTitle" min-width="80">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.templateStyleTitle" placement="top">
            <span>{{scope.row.genreTitle}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="publishTime" min-width="140"/>
      <el-table-column label="搜索词" prop="searchWord">
        <template slot-scope="scope">
          <el-popover
            placement="top-start"
            width="380">
            <div slot="reference">
              <span>{{scope.row.searchWord}}</span>
              <el-button class="check-btn" type="button" size="small">查看</el-button>
            </div>
            <table class="ms-table">
              <tbody>
              <tr>
                <td class="left" style="width: 60px;"><strong>搜索引擎</strong></td>
                <td class="left">{{scope.row.searchTitle}}</td>
              </tr>
              <tr>
                <td class="left"><strong>搜索词</strong></td>
                <td class="left">{{scope.row.searchWord}}</td>
              </tr>
              <tr>
                <td class="left"><strong>来源页</strong></td>
                <td class="left">
                  <a class="over-hidden" :href="scope.row.referrerUrl" target="_blank">{{scope.row.referrerUrlView}}</a>
                </td>
              </tr>
              <tr>
                <td class="left"><strong>着路页</strong></td>
                <td class="left">
                  <a class="over-hidden" :href="scope.row.pageUrl" target="_blank">{{scope.row.pageUrl}}</a>
                </td>
              </tr>
              </tbody>
            </table>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="问卷" prop="questionnaire" min-width="50">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.openQuestionnaireId > 0"
            placement="top-start"
            width="380"
            @show="showQuestionnaire(scope.$index)">
            <el-button slot="reference" type="text" size="small">已填</el-button>
            <table class="ms-table ms-table-striped">
              <thead>
              <tr>
                <th>问题</th>
                <th>用户回答</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(questionnaire, index) in row.questionnaire" :key="index">
                <td class="left">{{questionnaire.title}}</td>
                <td class="left">{{questionnaire.answer}}</td>
              </tr>
              </tbody>
            </table>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="80" class-name="option">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status > -1"
                     type="info" size="mini"
                     icon="el-icon-delete" circle
                     @click="deleteRow(scope.$index)">
          </el-button>
          <!--已读状态：readStatus === 1
          <el-button v-if="scope.row.readStatus === 1"
                     type="primary" size="mini"
                     circle icon="el-icon-message"
                     @click="setting(scope.$index)">
          </el-button>
          <!--未读状态：readStatus === 0
          <el-button v-if="scope.row.readStatus === 0"
                     type="danger" size="mini" circle
                     icon="el-icon-message"
                     @click="setting(scope.$index)">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    -->
    <template v-if="showData">
      <div class="table-learn">
        <label>全选/反选<input type="checkbox" v-model="is_check" @click="select_all()"/></label>
        <el-button size="mini" type="primary" @click="read()">标为已读</el-button>
        <el-button size="mini" type="success" @click="unRead()">标为未读</el-button>
        <!--<el-button size="mini" type="danger">删除选中</el-button>-->
      </div>
      <div class="table-wrap">
        <table cellspacing="0"
               class="table table-bordered"
               v-for="(item,index) in table.list">
          <tbody>
          <tr>
            <td width="30" rowspan="5">
              <p><input type="checkbox"
                        :checked="item.flag"
                        @click="is_check_fn(index)"></p>
              <p v-if="item.readStatus === 0">
                <img src="../../../../static/images/unread.png"
                     width="21" height="16" alt="未读">
              </p>
            </td>
            <td><strong>ID：</strong>{{item.id}}</td>
            <td><strong>项目：</strong>{{item.itemTitle}}</td>
            <td>
              <strong>投放端：</strong>
              <ms-device :client-id="item.clientId"></ms-device>
            </td>
            <td colspan="2"><strong>自定义来源：</strong>{{item.source}}</td>
            <td rowspan="5" class="feedback">
              <p><strong>留言内容：</strong>{{item.content}}</p>
              <icon name="flag"></icon>
              来自{{item.genreTitle}}
              <p v-if="item.ipArea !== undefined && item.searchWord.length > 0">
                <icon name="search"></icon> 通过关键词
                <el-popover
                  placement="top-start"
                  width="380">
                  <span slot="reference">
                    <a style="cursor: pointer">{{item.searchWord}}</a> 访问
                  </span>
                  <table class="ms-table">
                    <tbody>
                    <tr>
                      <td class="left" style="width: 60px;"><strong>搜索引擎</strong></td>
                      <td class="left">{{item.searchTitle}}</td>
                    </tr>
                    <tr>
                      <td class="left"><strong>搜索词</strong></td>
                      <td class="left">{{item.searchWord}}</td>
                    </tr>
                    <tr>
                      <td class="left"><strong>来源页</strong></td>
                      <td class="left">
                        <a class="over-hidden" :href="item.referrerUrl" target="_blank">{{item.referrerUrlView}}</a>
                      </td>
                    </tr>
                    <tr>
                      <td class="left"><strong>着路页</strong></td>
                      <td class="left">
                        <a class="over-hidden" :href="item.pageUrl" target="_blank">{{item.pageUrl}}</a>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </el-popover>
              </p>
            </td>
          </tr>
          <tr>
            <td><strong>联系人：</strong>{{item.contacts}}</td>
            <td><strong>手机：</strong>{{item.mobile}}</td>
            <td><strong>电话：</strong>{{item.phone}}</td>
            <td><strong>QQ：</strong>{{item.qq}}</td>
          </tr>
          <tr>
            <td><strong>时间：</strong>{{item.publishTime}}</td>
            <td colspan="4"><strong>地址：</strong>
              {{item.address}}
              <span v-if="item.ipArea !== undefined && item.ipArea.length > 0 && item.ipArea !== '中国'">（IP来自 {{item.ipArea}}）</span>
            </td>
          </tr>
          <tr>
            <td colspan="5" class="active">
              <strong>操作：</strong>
              <a @click="deleteRow(index)">删除</a>
              <a v-if="item.readStatus === 0" @click="setting(index)">标为已读</a>
              <a class="no-read" v-if="item.readStatus === 1" @click="setting(index)">标为未读</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </template>
    <template v-else>
      <div class="no-data">无相关留言数据</div>
    </template>

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
  import MsSearch from '@/components/common/Search.vue'
  import moment from 'moment'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsDevice from '@/components/common/Device.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Items from '@/api/customer/items'
  import Api from '@/api/customer/feedback'
  import ResponseParse from '@/utils/response-parse'
  import {
    GENRES, SEARCH_CONDITION, SEARCH_ENGINES,
    TEMPLATE_STYLES
  } from '../../../models/customer/feedbacks'
  import ElButton from '../../../../node_modules/element-ui/packages/button/src/button.vue'

  export default {
    components: {
      ElButton,
      MsSlide,
      MsSearch,
      MsConfirmButton,
      MsDevice
    },
    data () {
      return {
        showData: false,
        is_check: [],
        currentPage: 1,
        currentSize: 0,
        search: {
          list: [],
          condition: {}
        },
        table: {
          list: [],
          pagination: {}
        },
        row: {
          questionnaire: [],
          title: '留言导出',
          enabled: false,
          format: 'yyyy-MM-dd',
          form: {
            date: [],
            id: '',
            fileGenre: '',
            readStatus: ''
          }
        },
        items: []
      }
    },
    created () {
      this.search.list = SEARCH_CONDITION
      let date = []
      date[0] = moment().subtract(6, 'days').format('YYYY-MM-DD')
      date[1] = moment().subtract(0, 'days').format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.list[0].value = date
      Api.itemTitle(response => {
        let itemTitle = response.data || []
        let title = []
        itemTitle.forEach(value => {
          title.push({value: value.title, label: value.title})
        })
        this.search.list[1].config.list = title
      })
      this.table.list = []
      this.requestList()
    },
    methods: {
      /* 1.获取table中被选中的input的状态
       * 2.通过被选中的input状态，获取选中的table的数据 */
      getCheckCollection () {
        /* 每当pagination改变时，重新设置is_check集合的值 */
        this.is_check = []
        let page = this.table.pagination
        this.currentPage = page.page
        this.currentSize = page.pageSize
        for (let x = 0; x < page.totalPage; x++) {
          this.is_check[x] = []
          for (let y = 0; y < page.pageSize; y++) {
            this.is_check[x][y] = false
          }
        }
      },
      is_check_fn (index) {
        /* 对应点击时，修改is_check集合对应的值 */
        let data = Object.assign({}, this.table.list[index], {flag: !this.table.list[index].flag})
        this.table.list.splice(index, 1, data)
      },
      select_all () {
        for (let i = 0; i < this.table.list.length; i++) {
          this.table.list[i].flag = !this.table.list[i].flag
        }
      },
      read () {
        let ids = []
        for (let i = 0; i < this.table.list.length; i++) {
          if (this.table.list[i].flag) {
            ids.push(this.table.list[i].id)
          }
        }
        Api.readMul({ids: ids}, () => {
          this.requestList()
        })
      },
      unRead () {
        let ids = []
        for (let i = 0; i < this.table.list.length; i++) {
          if (this.table.list[i].flag) {
            ids.push(this.table.list[i].id)
          }
        }
        Api.unReadMul({ids: ids}, () => {
          this.requestList()
        })
      },
      requestList () {
        let params = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: params}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body.map(item => {
              item.flag = false
              item.genreTitle = item.genreId > 0 && GENRES.hasOwnProperty(item.genreId) ? GENRES[item.genreId] : '其他'
              item.templateStyleTitle = TEMPLATE_STYLES[item.templateStyle] || '自定义模板'

              item.searchTitle = SEARCH_ENGINES[item.searchDomain]
              item.referrerUrlView = item.referrerUrl && item.referrerUrl.length > 100
                ? item.referrerUrl.substr(0, 50) + '...' + item.referrerUrl.substr(-30, 30) : item.referrerUrl

              return item
            })
            this.showData = true
            this.table.pagination = ResponseParse.pagination(response.headers)
            this.getCheckCollection()
          } else {
            this.showData = false
            this.table.list = []
            this.$message.error(body.error, '数据获取失败')
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
      updateConditions (conditions) {
        this.table.pagination.page = 1

        const time = conditions.time || []
        this.search.condition = Object.assign({}, conditions, {startTime: time[0], endTime: time[1]})
        this.requestList()
      },
      showQuestionnaire (index) {
        const item = this.table.list[index]

        Api.getOpenQuestionnaire({id: item.id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.questionnaire = JSON.parse(body.content || '[]')
          } else {
            this.row.questionnaire = []
          }
        })
      },
      deleteRow (index) {
        const item = this.table.list[index]
        Api.delete({id: item.id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1, Object.assign({}, item, {status: -1}))
          } else {
            this.$message.error(body.error || '操作失败')
          }
          this.requestList()
        })
      },
      setting (index) {
        const item = this.table.list[index]
        if (item.readStatus === 1) {
          Api.unread({id: item.id}, response => {
            let status = response.status || 0
            let body = response.data || {}
            if (status >= 200 && status <= 204) {
              this.table.list[index].readStatus = 0
              this.$message.success('操作成功')
              this.$store.commit('increment')
            } else {
              this.$message.error(body.error || '操作失败')
            }
          })
        } else if (item.readStatus === 0) {
          Api.read({id: item.id}, response => {
            let status = response.status || 0
            let body = response.data || {}
            if (status >= 200 && status <= 204) {
              this.table.list[index].readStatus = 1
              this.$message.success('操作成功')
              this.$store.commit('decrement')
            } else {
              this.$message.error(body.error || '操作失败')
            }
          })
        }
      },
      addRow () {
        this.row.form = {}
        // 获得 所有项目
        Items.getItems(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.items = body
          }
        })

        this.showSlide('slideModifyRow')
      },
      exportFile () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            let $data = this.row.form
            let parameters1 = '?startTime=' + $data.date[0] + '&endTime=' + $data.date[1]
            let parameters2 = '&itemId=' + $data.id
            let parameters3 = '&fileGenre=' + $data.fileGenre
            let parameters4 = '&readStatus=' + $data.readStatus

            window.location.href = '/rest/customer/feedback/feedbacks/files' +
              parameters1 + parameters2 + parameters3 + parameters4
          } else {
            return false
          }
        })
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style>
  .main-section .operation {
    margin: 0;
  }
</style>
<style lang="scss">
  @import "../../../assets/styles/env";

  .no-data {
    text-align: center;
    color: #8f9196;
    padding: 20px;
    border: 1px solid #ebedf1;
  }
  .wrap-list {
    padding-top: 10px;
  }

  .button-wrap {
    position: absolute;
    top: 11px;
    right: 6px;
    z-index: 1;
  }

  .check-btn {
    padding: 4px 10px;
  }

  .el-table__column-filter-trigger {
    padding-left: 5px;
  }

  .over-hidden {
    overflow: hidden;
    display: inline-block;
    width: 345px;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
  }

  .el-popover {
    overflow: hidden;
  }

  .ms-list {
    padding: 3px 0 0 !important;
  }

  .element-table th {
    height: 48px;
  }

  .table-expand {
    text-align: left;
    label {
      width: 80px;
      line-height: 28px;
      font-weight: bold;
      color: $color-secondary
    }
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: calc((100% - 100px) / 2);
      &__content {
        line-height: 28px;
      }
    }
    .content {
      width: 88%;
    }
  }

  .ms-table {
    width: 100%;
    border-collapse: collapse;
    font-size: $size-small;
    line-height: $size-small;
    th {
      padding: 8px 5px;
    }
    td, th {
      border: 1px solid $color-white-tint;
      text-align: center;
      word-break: break-all;
      padding: 5px;
      &.left {
        text-align: left;
      }
      p {
        margin: 2px 0;
      }
      a {
        color: $color-info
      }
    }
    &.ms-table-striped {
      tr:nth-child(even) {
        td {
          background-color: $color-tint;
        }
      }
    }
  }

  .table-learn {
    margin-bottom: 10px;
    font-size: 14px;
    input {
      vertical-align: middle;
    }
    a {
      cursor: pointer;
    }
  }

  .table-bordered {
    border: 1px solid #b4c0da;
    border-bottom: none;
    border-collapse: separate;
    border-left: 0;
    font-size: 12px;
    color: #606266;
    tr {
      td {
        border-left: 1px solid #b4c0da;
        border-bottom: 1px solid #b4c0da;
        padding: 6px 10px;
      }
      &:nth-child(odd) td {
        background-color: #FAFAFA;
      }
      .feedback {
        word-wrap: break-word;
        width: 24%;
      }
      .active a {
        cursor: pointer;
      }
      .active {
        .no-read {
          color: red;
        }
      }
    }
  }

  .table {
    width: 100%;
    margin-bottom: 35px;
    background: #f5f7fa;
  }
  .table-wrap {
    background: #e2e7f1;
  }
</style>
