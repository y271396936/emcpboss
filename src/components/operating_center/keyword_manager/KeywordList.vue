<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>关键词管理</el-breadcrumb-item>
        <el-breadcrumb-item>关键词列表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <!--<el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增关键词</el-button>
      </el-button-group>-->
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <ms-slide
      :title="row.edit.enabled ? '编辑关键词' : '新增关键词'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">

        <el-form-item
          label="所属词库"
          prop="libraryId"
          :rules="[
              {required: true, message: '必须指定一个所属词库'}
            ]">
          <el-select v-model="row.form.libraryId">
            <template v-for="libraryName in this.table.libraryList">
              <el-option :label="libraryName.title" :value="libraryName.id"
                         :disabled="libraryName.status === 0"></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!row.edit.enabled"
          label="词语"
          prop="keywords"
          :rules="[
              {required: true, message: '请填写关键词'},
            ]">
          <el-input type="textarea" height="200" v-model="row.form.keywords" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="词语"
          prop="word"
          :rules="[
              {required: true, message: '请填写关键词'},
            ]">
          <el-input type="text" v-model="row.form.word" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="唯一码"
          prop="tag"
          :rules="[
              {required: true, message: '只为兼容手动做透视表'},
            ]">
          <el-input type="text" height="200" v-model="row.form.tag" placeholder="请输入内容"></el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="状态"
          prop="status">
          <el-select v-model="row.form.status">
            <el-option label="已下稿" :value="-1"/>
            <el-option label="无效" :value="0"/>
            <el-option label="有效" :value="1"/>
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

      :data="recombineList"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" fixed></el-table-column>
      <el-table-column prop="industry" label="所属行业" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=1)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="libraryTitle" label="品类" min-width="100">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.libraryTitle, index=2)">{{scope.row.libraryTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="word" label="关键词" min-width="150">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.word, index=3)">{{scope.row.word}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="wordAttribute" label="关键词属性" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.wordAttribute === 1" class="ms-success">新加词</span>
          <span v-else-if="scope.row.wordAttribute === 2" class="ms-warning">搜索词</span>
          <span v-else-if="scope.row.wordAttribute === 3" style="color: #f56c6c;">大流量词</span>
          <span v-else-if="scope.row.wordAttribute === 0"></span>
          <span v-else class="ms-gray">未知属性</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="关键词添加者" min-width="95"></el-table-column>
      <el-table-column prop="creator" label="提交者" min-width="95"></el-table-column>
      <el-table-column prop="createDate" label="关键词添加时间" min-width="100"></el-table-column>
      <el-table-column prop="publishTime" label="提交时间" min-width="120"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">有效</span>
          <span v-else-if="scope.row.status === 0" class="ms-gray">无效</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>
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
  import MsSlide from '@/components/common/Slide.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/bid-keyword'
  import ResponseParse from '@/utils/response-parse'
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input'
  import { FormArgument, SEARCH_CONDITION } from '@/models/platform/bid-keyword'
  import LibraryApi from '@/api/platform/bid-keyword-library'

  export default {
    components: {
      ElInput,
      MsSlide,
      MsSearch
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.loading = true

      LibraryApi.listAll(response => {
        let status = response.status || 0
        let body = response.data || []
        if (status === 200 || status === 204) {
          this.table.libraryList = body
        } else {
          this.$message.error('获取词库列表失败')
        }
        this.table.loading = false
      })

      this.table.list = []
      if (this.$route.query.libraryId !== undefined) {
        this.search.condition.libraryId = this.$route.query.libraryId
        this.search.list[0].value = this.$route.query.libraryId
      }
      this.requestList()
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
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () {
//        this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//      })
//    },
    computed: {
      recombineList () {
        let statusTexts = {
          1: '有效',
          0: '无效'
        }
        let list = []
        this.table.list.forEach(item => {
          let channel = item
          if (item.hasOwnProperty('status')) {
            channel.statusText = statusTexts[item.status] || '未知'
          }
          list.push(channel)
        })

        return list
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
          if (status === 200 || status === 204) {
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
            console.error('list error')
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
        const rows = this.table.list.slice(index, index + 1)

        this.row.form = Object.assign({}, rows[0])
        this.row.edit.enabled = true
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
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

                  // 关闭
                  this.$refs['slideModifyRow'].close()
                } else {
                  this.$message.error(body.error || '修改失败')
                }
              })
            } else {
              Api.create({form: this.row.form}, response => {
                let status = response.status || 0
                let body = response.data || []

                if (status >= 200 && status <= 204) {
                  this.table.libraryList.forEach(item => {
                    if (item.id === body.id) {
                      body.libraryTitle = item.title
                      body.word = this.row.form.keywords
                    }
                  })
                  this.table.list.unshift(body)
                  // 关闭
                  this.$message.success(body.success || '新增成功')
                } else {
                  this.$message.error(body.error || '新增失败')
                }
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
      closeSlideModify () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      }
    }
  }
</script>

<style scoped>
</style>
