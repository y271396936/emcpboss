<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>关键词管理</el-breadcrumb-item>
        <el-breadcrumb-item>词库列表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增词库</el-button>
      </el-button-group>
    </el-row>

    <div ref="msSearch">
      <!--@clickH="calculatedHeight"-->
      <ms-search :data="search.list" @click="updateConditions"></ms-search>
    </div>

    <ms-slide
      :title="row.edit.enabled ? '编辑词库' : '新增词库'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">

        <el-form-item
          label="行业"
          prop="industry"
          :rules="[{required: true, message: '请选择行业'}]">
          <el-select v-model="row.form.industry" filterable remote clearable placeholder="请输入关键字"
                     :remote-method="industryLikeness" :loading="remote.industry.loading" :disabled="row.enabled">
            <el-option-group v-for="(value, key) in remote.industry.data" :key="key" :label="key">
              <el-option v-for="industry in value" :key="industry.id" :label="industry.title"
                         :value="industry.title + '-' + industry.id"></el-option>
            </el-option-group>
          </el-select>
        </el-form-item>

        <el-form-item
          label="品类"
          prop="title"
          :rules="[
              {required: true, message: '必填'},
              {min: 2, max: 20, message: '长度在 20个字符以内', trigger: 'blur'}
            ]">
          <el-input v-model="row.form.title" placeholder="20个字符以内" :disabled="row.enabled"></el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="状态"
          prop="status">
          <el-select v-model="row.form.status">
            <el-option label="无效" :value="0"></el-option>
            <el-option label="有效" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="文件" v-if="row.enabled">
          <input type="file" id="file" name="file" @change="onFileChange"/>
        </el-form-item>

        <el-form-item>
          <el-button v-if="row.enabled" type="primary" @click="submitFile()">提交</el-button>
          <el-button v-if="!row.enabled" type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <el-table
      size="small" stripe border
      :data="recombineList"

      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" fixed></el-table-column>
      <el-table-column prop="industry" label="行业" min-width="100" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industry, index=0)">{{scope.row.industry}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="品类" min-width="100" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.title, index=1)">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="total" label="词量" min-width="80"></el-table-column>
      <el-table-column prop="creator" label="创建人" min-width="100"></el-table-column>
      <el-table-column prop="publishTime" label="创建时间" min-width="140"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">有效</span>
          <span v-else-if="scope.row.status === 0" class="ms-gray">无效</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>

          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除词库<code>{{scope.row.title}}</code>吗？</p>
          </ms-confirm-button>
          <router-link class="keyword-link" :to="{path:'/operating-center/keyword-list',query:{libraryId:scope.row.id}}"
                       target="_blank">关键词列表
          </router-link>

          <el-button type="text" size="small" @click.native.prevent="importKeyWord(scope.$index)">导入关键词</el-button>
          <el-button type="text" size="small" @click="download(scope.$index)">下载关键词</el-button>
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
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/bid-keyword-library'
  import IndustryApi from '@/api/platform/item-industry'
  import ResponseParse from '@/utils/response-parse'
  import { FormArgument, SEARCH_CONDITION, Remote } from '@/models/platform/bid-keyword-library'

  export default {
    components: {
      MsSlide,
      MsConfirmButton,
      MsSearch
    },
    created () {
      this.search.list = SEARCH_CONDITION

      IndustryApi.getAllIndustry(response => {
        let status = response.status || 0
        let body = response.data || []
        if (status === 200 || status === 204) {
          body.forEach(item => {
            if (item.pid === 0) {
              this.row.options[0].opt.push(item)
            } else {
              this.row.options[1].opt.push(item)
            }
          })
        }
      })

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
          form: new FormArgument(),
          enabled: false
        },
        remote: new Remote()
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
        if (Object.keys(this.table.list).length > 0) {
          this.table.list.forEach(item => {
            let channel = item
            if (item.hasOwnProperty('status')) {
              channel.statusText = statusTexts[item.status] || '未知'
            }
            list.push(channel)
          })
        }

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
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 20) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
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
        this.row.enabled = false
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
        this.row.enabled = false
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            if (this.row.edit.enabled) {
              this.row.form.industry = this.row.form.industry + '-' + this.row.form.industryId
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
      importKeyWord (index) {
        this.row.enabled = true
        const rows = this.table.list.slice(index, index + 1)

        this.row.form = Object.assign({}, rows[0])

        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form.token = body.token || ''
          }
        })
        this.showSlide('slideModifyRow')
      },
      submitFile () {
        Api.importKeyWord({form: this.row.form}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form = body
            this.$refs['slideModifyRow'].close()
            this.$message.success('导入成功')
          } else {
            this.$message.error(body.error || '导入失败')
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
            this.$message.error(body.error || '操作失败')
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
      },
      onFileChange (e) {
        this.row.form.file = e.target.files[0]
      },
      download (index) {
        const item = this.table.list[index]
        let title = item.title + '&id='
        let id = item.id
        window.location.href = '/rest/boss/platform/bid-keyword-libraries/download?title=' + title + id
      },
      industryLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.industry.data = {}
          return
        }

        this.remote.industry.loading = true
        IndustryApi.likeness({title: query}, response => {
          let status = response.status || 0
          let body = response.data.map || {}
          if (status >= 200 && status <= 204) {
            this.remote.industry.data = body
          }
          this.remote.industry.loading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  a:link, a:visited, a:hover, a:active {
    color: $color-info;
    text-decoration: none;
  }
</style>
