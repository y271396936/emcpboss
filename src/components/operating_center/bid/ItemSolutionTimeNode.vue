<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价管理</el-breadcrumb-item>
        <el-breadcrumb-item>节点数据管理</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-slide title="编辑节点数据" :width="500" @close="closeSlide()" ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="项目名称" prop="itemTitle">
          <el-input v-model="row.form.itemTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="平台" prop="platformId">
          <el-select v-model="row.form.platformId" :disabled="true">
            <el-option v-for="platform in platforms" :label="platform.title" :value="platform.id"
                       :key="platform.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户" prop="accountTitle">
          <el-input v-model="row.form.accountTitle" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="时间节点" prop="timeNode">
          <el-input v-model="row.form.timeNode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="消费点数" prop="costCoin" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.costCoin" type="number"></el-input>
        </el-form-item>
        <el-form-item label="对话数" prop="talk" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.talk" type="number"></el-input>
        </el-form-item>
        <el-form-item label="要电话数" prop="phone" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.phone" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table v-loading="table.loading" size="small" stripe border :data="table.list" :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="day" label="日期" min-width="75" fixed></el-table-column>
      <el-table-column prop="timeNode" label="时间节点" min-width="70"></el-table-column>
      <el-table-column prop="platformId" label="平台" min-width="80">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="accountTitle" label="渠道账户" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.accountTitle, index=3)">{{scope.row.accountTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="itemTitle" label="项目名称" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.itemTitle, index=5)">{{scope.row.itemTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="itemIndustry" label="行业" min-width="80"></el-table-column>
      <el-table-column prop="costCoin" label="消费点数" min-width="80" align="right" header-align="center">
        <template slot-scope="scope">
          {{scope.row.costCoin}}点
        </template>
      </el-table-column>
      <el-table-column prop="talk" label="有效对话量" min-width="85" align="right" header-align="center"></el-table-column>
      <el-table-column prop="talkPrice" label="有效对成本" min-width="85" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.talk === 0" class="ms-info">&infin;</span>
          <span v-else>{{(scope.row.costCoin / scope.row.talk).toFixed(2)}}点</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="要电话数" min-width="85" align="right" header-align="center"></el-table-column>
      <el-table-column prop="phonePrice" label="要电话成本" min-width="85" align="right" header-align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.phone === 0" class="ms-info">&infin;</span>
          <span v-else>{{(scope.row.costCoin / scope.row.phone).toFixed(2)}}点</span>
        </template>
      </el-table-column>
      <el-table-column prop="saler" label="销售" min-width="80"></el-table-column>
      <el-table-column prop="server" label="客服" min-width="80"></el-table-column>
      <el-table-column prop="regulator" label="运营人员" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.regulator, index=7)">{{scope.row.regulator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="提交者" min-width="80"></el-table-column>
      <el-table-column prop="publishTime" label="时间" min-width="140"></el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除<code>id = {{scope.row.id}}</code>的节点数据吗？</p>
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
      @current-change="handleCurrentChange"/>

  </div>
</template>

<script>
  import MsPlatform from '../../common/Platform.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import ResponseParse from '@/utils/response-parse'
  import Api from '@/api/report/item-solution-time-node'
  import { PLATFORM_LIST } from '@/utils/constants'
  import { SEARCH_CONDITION } from '@/models/report/item-solution-time-node'

  export default {
    components: {
      MsPlatform,
      MsSearch,
      MsSlide,
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
          form: {},
          edit: {
            index: 0
          }
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
    computed: {
      platforms () {
        return PLATFORM_LIST
      }
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
            this.table.list = body.list
            this.table.pagination = ResponseParse.singlepage(response.data.map.page)
//            if (this.table.pagination.totalPage === this.table.pagination.page && this.table.list.length < 20) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
            // 运营小组
            let group = []
            response.data.map.bidDepartments.forEach(item => {
              group.push({value: item.id, label: item.title})
            })
            this.search.list[6].config.list = group
          } else {
//            this.tbHeight = ''
            this.table.list = []
            this.$message.error(body.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      editRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },
      submit () {
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
      deleteRow (index) {
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
          } else {
            this.$message.error(body.error || '删除失败')
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
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
