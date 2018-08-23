<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <!--<el-breadcrumb-item>运营中心</el-breadcrumb-item>-->
        <el-breadcrumb-item>留言列表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small"
      stripe border

      :data="table.list"
      :fit="true">
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
          <el-tooltip v-if="scope.row.status === -2" effect="dark" content="测试留言！客户无法看到该留言" placement="top">
            <icon name="bug"/>
          </el-tooltip>
          <el-tooltip v-else-if="scope.row.status === -1" effect="dark" content="已删除的留言，信息已销毁" placement="top">
            <icon name="trash"/>
          </el-tooltip>

          <template>{{scope.row.id}}</template>
        </template>
      </el-table-column>
      <el-table-column label="项目" prop="itemTitle">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.customerTitle" placement="top">
            <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=2)">{{scope.row.itemTitle}}</a>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="客户端" prop="clientId" min-width="50">
        <template slot-scope="scope">
          <!--<el-tooltip class="item" effect="dark" placement="top">-->
          <!--<div slot="content">-->
          <!--投放端：<ms-device :client-id="scope.row.clientId" type="text" /><br/>-->
          <!--展示端：<ms-device :client-id="scope.row.clientId" type="text" />-->
          <!--</div>-->
          <!--</el-tooltip>-->
          <ms-device :client-id="scope.row.clientId"/>
        </template>
      </el-table-column>
      <el-table-column label="来自" prop="genreTitle" min-width="80">
        <template slot-scope="scope">
          <el-tooltip effect="dark" :content="scope.row.templateStyleTitle" placement="top">
            <span>{{scope.row.genreTitle}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="时间" prop="publishTime" min-width="150"/>
      <el-table-column label="搜索词" prop="searchWord" min-width="150">
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
          <template v-if="scope.row.status > -1">
            <ms-confirm-button v-if="scope.row.status > -1" title="删除" @confirm="deleteRow(scope.$index)">
              <p>您确定要删除<code>id = {{scope.row.id}}</code>的数据吗？</p>
            </ms-confirm-button>
            <ms-confirm-button v-else title="恢复" @confirm="recoverRow(scope.$index)">
              <p>您确定要恢复<code>id = {{scope.row.id}}</code>的数据吗？</p>
            </ms-confirm-button>
          </template>

          <ms-confirm-button title="销毁" @confirm="destroyRow(scope.$index)">
            <p>您确定要销毁<code>id = {{scope.row.id}}</code>的数据吗？</p>
          </ms-confirm-button>
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
  import MsSearch from '@/components/common/Search.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsDevice from '@/components/common/Device.vue'
  import Api from '@/api/feedback/feedback'
  import ResponseParse from '@/utils/response-parse'
  import {
    GENRES, SEARCH_CONDITION, SEARCH_ENGINES,
    TEMPLATE_STYLES
  } from '../../models/feedback/feedback'

  export default {
    components: {
      MsSearch,
      MsConfirmButton,
      MsDevice
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
          questionnaire: []
        }
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    created () {
      this.search.list = SEARCH_CONDITION

      this.table.loading = true
      this.table.list = []
      this.requestList()
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
//      calculatedHeight () {
//        this.$nextTick(function () {
//          this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//        })
//      },
      requestList () {
        let params = Object.assign({}, {page: this.table.pagination.page, pageSize: this.table.pagination.pageSize},
          this.search.condition)

        this.table.loading = true
        Api.list({search: params}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body.map(item => {
              item.genreTitle = item.genreId > 0 && GENRES.hasOwnProperty(item.genreId) ? GENRES[item.genreId] : '其他'
              item.templateStyleTitle = TEMPLATE_STYLES[item.templateStyle] || '自定义模板'

              item.searchTitle = SEARCH_ENGINES[item.searchDomain]
              item.referrerUrlView = item.referrerUrl && item.referrerUrl.length > 100
                ? item.referrerUrl.substr(0, 50) + '...' + item.referrerUrl.substr(-30, 30) : item.referrerUrl

              return item
            })
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && this.table.list.length < 20) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
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
        })
      },
      recoverRow (index) {
        const item = this.table.list[index]
        Api.recover({id: item.id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1, Object.assign({}, item, {status: 1}))
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      destroyRow (index) {
        const item = this.table.list[index]
        Api.destroy({id: item.id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import "../../assets/styles/env";
  .check-btn {
    padding: 4px 10px;
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
</style>
