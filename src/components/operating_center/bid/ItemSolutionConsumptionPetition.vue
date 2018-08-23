<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目方案涨预算申请</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-slide title="审批申请" :width="500" @close="closeSlide()" ref="slidePetition">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formPetition">
        <el-form-item label="审批结果" prop="status" :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.status" placeholder="请选择">
            <el-option-group v-if="row.type === 'bid'" label="竞价部审批">
              <el-option label="同意" :value="1"></el-option>
              <el-option label="拒绝，转交销售处理" :value="-1"></el-option>
            </el-option-group>
            <el-option-group v-if="row.type === 'sale'" label="销售部审批">
              <el-option label="拒绝" :value="-1"></el-option>
              <el-option label="与客户洽谈中" :value="1"></el-option>
              <el-option label="同意" :value="2"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="原因" prop="content">
          <el-input v-model="row.form.content" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="resetForm('formPetition')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="审批过程" :width="500" @close="closeSlide()" ref="slideProcess">
      <div class="media-list">
        <el-card :model="petition" class="box-card">
          <div class="pull-left">
            <p class="pull-left-day">
              {{petition.month}}月{{petition.day}}日<br>
              {{petition.year}}年
            </p>
          </div>
          <div class="media-body">
            <p class="explain">
              <span class="blue">@{{petition.operator}}</span> 在 {{petition.publishTime}} 申请<br><br>
              {{petition.reason}}
            </p>
            <div v-if="petition.approval != 0" class="media-content">
              <span class="blue">@{{petition.approver}}</span> 在 {{petition.approvalTime}}
              <span v-if="petition.approval === 1" class="ms-success"> 同意</span>
              <span v-if="petition.approval === -1" class="ms-danger"> 拒绝</span><br>
              <p>{{petition.approvalComment}}</p>
            </div>
            <div v-if="petition.saleApproval != 0" class="media-content">
              <span class="blue">@{{petition.saleApprover}}</span> 在 {{petition.saleApprovalTime}}
              <span v-if="petition.saleApproval === 2" class="ms-success"> 同意</span>
              <span v-if="petition.saleApproval === 1" class="ms-info"> 与客户沟通中</span>
              <span v-if="petition.saleApproval === -1" class="ms-danger"> 拒绝</span><br>
              <p>{{petition.saleComment}}</p>
            </div>
          </div>
        </el-card>
      </div>
    </ms-slide>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table v-loading="table.loading" size="small" stripe border :data="table.list" :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="day" label="日期" min-width="75" fixed></el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="130">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=3)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="channelTitle" label="推广渠道" min-width="80"></el-table-column>
      <el-table-column prop="accountTitle" label="渠道账户" min-width="150">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.accountGenre === 1" content="服务户">
            <icon name="user"/>
          </el-tooltip>
          {{scope.row.accountTitle}}
        </template>
      </el-table-column>
      <el-table-column prop="clientId" label="设备客户端" min-width="85">
        <template slot-scope="scope">
          <ms-device :client-id="scope.row.clientId"/>
        </template>
      </el-table-column>
      <el-table-column prop="beforeBudget" label="原预算" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.beforeBudget.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="budget" label="申请涨预算" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.budget.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="申请人" min-width="80"></el-table-column>
      <el-table-column prop="urgencyDegree" label="紧急程度" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.urgencyDegree === 0">默认</span>
          <span v-else-if="scope.row.urgencyDegree === 1" class="ms-danger">当天回复</span>
          <span v-else>{{scope.row.urgencyDegree}}天内回复</span>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="申请时间" min-width="150">
        <template slot-scope="scope">
          {{scope.row.publishTime}}
          <div v-if="scope.row.approval === -1" class="ms-gray">{{scope.row.approvalTime}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="approval" label="领导审核" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.approval === -1" class="ms-danger">拒绝</span>
          <span v-else-if="scope.row.approval === 0">未审核</span>
          <span v-else-if="scope.row.approval === 1" class="ms-success">同意</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="saleApproval" label="销售审核" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.saleApproval === -1" class="ms-danger">拒绝</span>
          <span v-else-if="scope.row.saleApproval === 0">未审核</span>
          <span v-else-if="scope.row.saleApproval === 1" class="ms-warning">接洽中</span>
          <span v-else-if="scope.row.saleApproval === 2" class="ms-success">同意</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" min-width="200">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="showPetition(scope.$index)">查看</el-button>
          <el-button v-if="scope.row.approval === 0" type="text" size="small"
                     @click.native.prevent="bidPetition(scope.$index)">竞价审批
          </el-button>
          <el-button v-if="scope.row.saleApproval === 0" type="text" size="small"
                     @click.native.prevent="salePetition(scope.$index)">销售审批
          </el-button>
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
  import MsDevice from '@/components/common/Device.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/item-solution-consumption-petition'
  import ResponseParse from '@/utils/response-parse'
  import { SEARCH_CONDITION } from '@/models/platform/item-solution-consumption-petition'

  export default {
    components: {
      MsDevice,
      MsSearch,
      MsSlide
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
          form: {},
          type: '',
          edit: {
            index: 0
          }
        },
        petition: {}
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
        this.table.loading = true

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.table.list = []
            this.$message.error(body.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      showPetition (index) {
        Api.get({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.petition = body
            this.petition.year = body.day.toString().substr(0, 4)
            this.petition.month = body.day.toString().substr(4, 2)
            this.petition.day = body.day.toString().substr(6, 2)
            this.showSlide('slideProcess')
          } else {
            this.petition = {}
            this.$message.error(body.error || '数据获取失败')
          }
        })
      },
      bidPetition (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.form.roleType = 1
        this.row.type = 'bid'
        this.row.edit.index = index
        this.showSlide('slidePetition')
      },
      salePetition (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.form.roleType = 2
        this.row.type = 'sale'
        this.row.edit.index = index
        this.showSlide('slidePetition')
      },
      submit () {
        Api.approve({form: this.row.form}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            let index = this.row.edit.index
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)

            // 关闭
            this.$refs['slidePetition'].close()
          } else {
            this.$message.error(body.error || '审批失败')
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
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        this.requestList()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.row.form = {}
        this.row.edit.index = 0
        this.row.type = ''
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  .blue {
    color: $color-primary-active;
  }

  .blue:hover {
    color: $color-primary;
    text-decoration: underline;
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
          span {
            display: block;
          }
        }
        .media-body {
          margin: -25px -10px -25px 60px;
          padding: 0 0 0px 8px;
          line-height: 10px;
          border-left: 2px solid #DDD;
          .explain {
            padding-bottom: 5px;
            border-bottom: 1px dashed #DDD;
            .ms-orange {
              color: #FFA500;
            }
          }
          .media-content {
            padding-left: 8px;
            border-left: 2px solid #DDD;
          }
        }
      }
    }
  }
</style>
