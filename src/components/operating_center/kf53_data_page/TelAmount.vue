<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>53数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>要电话量列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-slide
      :title="'修改留言数'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyRows">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="FormModifyFeedBack">

        <el-form-item
          label="日期"
          prop="day" >
          <el-input v-model="row.form.day" placeholder="" :disabled="true"/>
        </el-form-item>

        <el-form-item
          label="项目名称"
          prop="itemTitle">
          <el-input v-model="row.form.itemTitle" placeholder="" :disabled="true"/>
        </el-form-item>

        <el-form-item
          label="推广平台"
          prop="platformId"
        >
          <el-select v-model="row.form.platformId" :disabled="true" @change="platformChange">
            <el-option
              v-for="platform in platforms" :key="platform.id"
              :label="platform.title"
              :value="platform.id"
              :disabled="platform.status === 0"/>
          </el-select>
        </el-form-item>

        <el-form-item
          label="账号"
          prop="accountTitle"
        >
          <el-input v-model="row.form.accountTitle" :disabled="true" placeholder=""/>
        </el-form-item>

        <el-form-item
          label="设备"
          prop="clientId">
          <el-select v-model="row.form.clientId" :disabled="true" >
            <el-option label="PC端" :value="1"></el-option>
            <el-option label="手机端" :value="2"></el-option>
            <el-option label="APP端" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="留言数"
          prop="feedback"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.feedback" placeholder=""/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modifyFeedBack()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('FormModifyFeedBack')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide
      :title="'修正'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">

        <el-form-item
          label="日期"
          prop="day" >
          <el-input v-model="row.form.day" placeholder="" :disabled="true"/>
        </el-form-item>

        <el-form-item
          label="项目名称"
          prop="itemTitle"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.itemTitle" placeholder="" :disabled="true"/>
        </el-form-item>

        <el-form-item
          label="推广平台"
          prop="platformId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.platformId" :disabled="true" @change="platformChange">
            <el-option
              v-for="platform in platforms" :key="platform.id"
              :label="platform.title"
              :value="platform.id"
              :disabled="platform.status === 0"/>
          </el-select>
        </el-form-item>

        <el-form-item
          label="账号"
          prop="accountTitle"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.accountTitle" :disabled="true" placeholder=""/>
        </el-form-item>

        <el-form-item
          label="设备"
          prop="clientId">
          <el-select v-model="row.form.clientId" :disabled="true" >
            <el-option label="PC端" :value="1"></el-option>
            <el-option label="手机端" :value="2"></el-option>
            <el-option label="APP端" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="访客数"
          prop="visitor"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="row.form.visitor" placeholder=""/>
        </el-form-item>

        <el-form-item
          label="有效对话量"
          prop="talk"
          :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.talk" placeholder=""/>
        </el-form-item>

        <el-form-item
          label="要电话量"
          prop="phone"
          :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.phone" placeholder="20个字符以内"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" />
      <el-table-column prop="day" label="日期" min-width="100" />
      <el-table-column prop="itemTitle" label="项目名称" min-width="150" >
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=1)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="推广平台" min-width="80">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="accountTitle" label="账号" min-width="150">
      </el-table-column>
      <el-table-column prop="clientId" label="客户端" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.clientId === 1">PC端</span>
          <span v-else-if="scope.row.clientId === 2">手机端</span>
          <span v-else-if="scope.row.clientId === 3">APP端</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="pv" label="页面PV数" min-width="90">
      </el-table-column>
      <el-table-column prop="uv" label="页面UV数" min-width="90">
      </el-table-column>
      <el-table-column prop="ip" label="页面IP数" min-width="90">
      </el-table-column>
      <el-table-column prop="feedback" label="留言数" min-width="80">
      </el-table-column>
      <el-table-column prop="visitor" label="访客数" min-width="80">
      </el-table-column>
      <el-table-column prop="talk" label="有效对话量" min-width="80">
      </el-table-column>
      <el-table-column prop="phone" label="要电话量" min-width="80">
      </el-table-column>


      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">修正</el-button>
          <el-button type="text" size="small" @click.native.prevent="modifyListWordRow(scope.$index)">改留言</el-button>
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
  import moment from 'moment'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsPlatform from '@/components/common/Platform.vue'
  import Api from '@/api/platform/item-solution-page-report'
  import ResponseParse from '@/utils/response-parse'
  import { PLATFORM_LIST } from '@/utils/constants'
  import ChannelApi from '@/api/platform/channel'
  import {
    FormArgument,
    SEARCH_CONDITION
  } from '@/models/platform/item-solution-page-report'

  export default {
    components: {
      MsSearch,
      MsSlide,
      MsConfirmButton,
      MsPlatform
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
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument()
        }
      }
    },
    created () {
      let date = []
      date[0] = moment().format('YYYY-MM-01')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.list = SEARCH_CONDITION
      this.table.loading = true
      this.table.list = []
      this.requestList()
    },
    computed: {
      platforms () {
        return PLATFORM_LIST
      }
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true

        // 获得 platform mapping
        const platforms = {}
        PLATFORM_LIST.forEach(item => {
          platforms[item.id] = item.title
        })

        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
          } else {
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
        let date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]
        }, {startRollbackTime: date[0], endRollbackTime: date[1]})
        this.requestList()
      },
      platformChange (id) {
        if (id > 0) {
          // 获得渠道列表
          this.remote.channel.loading = true
          this.row.form.channelId = ''
          ChannelApi.list({platformId: id, pageSize: 100}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.remote.channel.list = body
            }
            this.remote.channel.loading = false
          })
        }
      },
      editRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.enabled = true
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },

      modifyListWordRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.index = index
        this.showSlide('slideModifyRows')
      },
      // 修改留言
      modifyFeedBack (index) {
        Api.modifyFeedback({id: this.row.form.id, form: this.row.form}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            let index = this.row.edit.index
            let data = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, data)

            // 关闭
            this.$refs['slideModifyRows'].close()
          } else {
            this.$message.error(body.error || '修改失败')
          }
        })
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
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
            return false
          }
        })
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
