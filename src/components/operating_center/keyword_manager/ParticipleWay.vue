<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>关键词管理</el-breadcrumb-item>
        <el-breadcrumb-item>分词策略</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增分词策略</el-button>
      </el-button-group>
    </el-row>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <ms-slide
      :title="row.edit.enabled ? '编辑分词策略' : '新增分词策略'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="所属词库" prop="libraryId" :rules="[{required: true, message: '请选择'}]">
          <el-select v-model="row.form.libraryId">
            <el-option label="通用" :value="0"></el-option>
            <template v-if="row.edit.enabled">
              <el-option v-if="row.form.libraryId !== 0" :label="row.form.libraryTitle"
                         :value="row.form.libraryId"></el-option>
            </template>
            <template v-else v-for="item in library">
              <el-option :label="item.title" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="权重" prop="weight" :rules="[{required: true, message: '请填写'}]">
          <el-input v-model="row.form.weight"></el-input>
        </el-form-item>
        <el-form-item label="分词条件" prop="condition1" :rules="[{required: true, message: '请填写'}]">
          <el-input v-model="row.form.condition1" placeholder="条件一,不能为空"></el-input>
          <el-input v-model="row.form.condition2" placeholder="条件二，留空则不限制"></el-input>
          <el-input v-model="row.form.condition3" placeholder="条件三，留空则不限制"></el-input>
          <el-input v-model="row.form.condition4" placeholder="条件四，留空则不限制"></el-input>
        </el-form-item>
        <el-form-item label="注意">
          <div>1.一个分词策略最多支持四个条件</div>
          <div>2.如果单个添加中需要添加多个同义词，请使用逗号隔开，如：
            <el-tag>赚，挣</el-tag>
          </div>
        </el-form-item>
        <el-form-item v-if="row.edit.enabled" label="状态" prop="status" :rules="[{required: true, message: '请选择'}]">
          <el-select v-model="row.form.status">
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="0"></el-option>
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

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" fixed></el-table-column>
      <el-table-column prop="libraryId" label="所属词库" min-width="100" fixed>
        <template slot-scope="scope">
          <span v-if="scope.row.libraryId === 0">通用</span>
          <span v-else>{{scope.row.libraryTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="权重" min-width="80"></el-table-column>
      <el-table-column label="分词条件" min-width="140">
        <template slot-scope="scope">
          <el-tag><a href="javascript:;" @click="searchCriteria(scope.row.condition1, index=0)">{{scope.row.condition1}}</a></el-tag>
          <span v-if="scope.row.condition2 !== '' && scope.row.condition2 !== undefined">
            <el-tag><a href="javascript:;" @click="searchCriteria(scope.row.condition2, index=1)">{{scope.row.condition2}}</a></el-tag>
            <span v-if="scope.row.condition3 !== '' && scope.row.condition3 !== undefined">
              <el-tag><a href="javascript:;" @click="searchCriteria(scope.row.condition3, index=2)">{{scope.row.condition3}}</a></el-tag>
              <span v-if="scope.row.condition4 !== '' && scope.row.condition4 !== undefined">
                <el-tag><a href="javascript:;" @click="searchCriteria(scope.row.condition4, index=3)">{{scope.row.condition4}}</a></el-tag>
              </span>
            </span>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" min-width="100"></el-table-column>
      <el-table-column prop="publishTime" label="创建时间" min-width="140"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">有效</span>
          <span v-else-if="scope.row.status === 0" class="ms-gray">无效</span>
          <span v-else>未知</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>

          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除<code>id = {{scope.row.id}}</code>分词策略吗？</p>
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
  import MsSlide from '@/components/common/Slide.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/bid-keyword-split-strategy'
  import LibraryApi from '@/api/platform/bid-keyword-library'
  import ResponseParse from '@/utils/response-parse'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import { FormArgument, SEARCH_CONDITION } from '@/models/platform/bid-keyword-split-strategy'

  export default {
    components: {
      MsSlide,
      MsConfirmButton,
      MsSearch
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.loading = true
      this.table.list = []
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
          list: {},
          pagination: {}
        },
        row: {
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument()
        },
        library: []
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () {
//        this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//      })
//    },
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

        LibraryApi.listAll(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.library = body
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
                  // 新数据加到数组开头
                  this.library.forEach(item => {
                    if (item.id === body.libraryId) {
                      body.libraryTitle = item.title
                    }
                  })
                  this.table.list.unshift(body)
                  // 关闭
                  this.$refs['slideModifyRow'].close()
                } else {
                  this.$message.error(body.error || '新增失败')
                }
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
          } else {
            this.$message.error(body.error || '删除失败')
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
