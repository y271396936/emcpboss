<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>行业管理</el-breadcrumb-item>
        <el-breadcrumb-item>行业否定词策略</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增否定词策略</el-button>
        <el-button type="primary" size="small" @click="moreDeleteRow()">批量删除</el-button>

      </el-button-group>
    </el-row>

    <ms-slide title="否定词检验" :width="800" height="600" @close="closeSlideModify()" ref="testSlideRow">
      <div>
        行业<code>{{row.validate.industryTitle}}</code>
        词语<code>{{row.validate.keywordTitle}}</code>
      </div>
      <div>
        <iframe id="modalIframe" :src="url" frameborder="0" allowtransparency="true"
                style="width: 100%; height: 800px;"></iframe>
      </div>
    </ms-slide>

    <ms-slide
      :title="'批量删除否定词'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideMoreDeleteRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="moreDeleteModifyRow">

        <el-form-item
          label="所属行业"
          prop="industryId"
          :rules="[
              {required: true, message: '必须指定一个所属项目'}
            ]">
          <el-select v-model="row.form.industryId">
            <template v-for="industryName in this.table.itemIndustry">
              <el-option :label="industryName.title" :value="industryName.id"
                         :disabled="industryName.status === 0"></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item
          label="所属平台"
          prop="platformId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.platformId" @change="platformChange">
            <el-option
              v-for="platform in platforms" :key="platform.id"
              :label="platform.title"
              :value="platform.id"
              :disabled="platform.status ===0">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="类型"
          prop="genre"
          :rules="[
              {required: true, message: '请选择相应的类型'}
            ]">
          <el-select v-model="row.form.genre">
            <el-option label="否定词" :value="1"></el-option>
            <el-option label="精否词" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="删除类型"
          prop="type"
          :rules="[
              {required: true, message: '请选择相应操作类型'}
            ]">
          <el-select v-model="row.form.type" placeholder="--请选择--">
            <el-option label="删除所选的所有推广词数据" :value="1"></el-option>
            <el-option label="清空所选的所有推广词数据" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitMoreDeleteRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('moreDeleteModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide
      :title="row.edit.enabled ? '编辑否定词策略' : '新增否定词策略'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">

        <el-form-item
          v-if="!row.edit.enabled"
          label="所属行业"
          prop="industryId"
          :rules="[
              {required: true, message: '必须指定一个所属行业'}
            ]">
          <el-select v-model="row.form.industryId">
            <template v-for="industryName in this.table.itemIndustry">
              <el-option :label="industryName.title" :value="industryName.id"
                         :disabled="industryName.status === 0"></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!row.edit.enabled"
          label="所属平台"
          prop="platformId"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-select v-model="row.form.platformId" @change="platformChange">
            <el-option
              v-for="platform in platforms" :key="platform.id"
              :label="platform.title"
              :value="platform.id"
              :disabled="platform.status ===0">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!row.edit.enabled"
          label="类型"
          prop="genre"
          :rules="[
              {required: true, message: '请选择相应的类型'},
            ]">
          <el-select v-model="row.form.genre">
            <el-option label="精否词" :value="2"></el-option>
            <el-option label="否定词" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          v-if="!row.edit.enabled"
          label="词语"
          prop="keywords"
          :rules="[
              {required: true, message: '请填写推广词'},
            ]">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                    v-model="row.form.keywords" placeholder="格式:每行一个否定词,多个以回车分开"></el-input>
        </el-form-item>


        <el-form-item
          v-if="row.edit.enabled"
          label="词语"
          prop="title"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-input v-model="row.form.title" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          v-if="row.edit.enabled"
          label="状态"
          prop="status"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-select v-model="row.form.status">
            <el-option label="已审阅" :value="2"></el-option>
            <el-option label="有效" :value="1"></el-option>
            <el-option label="无效" :value="0"></el-option>
            <el-option label="已删除" :value="-10"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.list.loading"
      size="small" stripe border

      :data="recombineList"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80" fixed></el-table-column>
      <el-table-column prop="industryTitle" label="行业名称" min-width="100" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.industryTitle, index=1)">{{scope.row.industryTitle}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="platformId" label="所属平台" min-width="80">
        <template slot-scope="scope">
          <ms-platform :platform-id="scope.row.platformId"/>
        </template>
      </el-table-column>
      <el-table-column prop="genre" label="词语类型" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.genre === 1" class="ms-info">否定词</span>
          <span v-else-if="scope.row.genre === 2" class="ms-success">精否词</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="词语" min-width="140"></el-table-column>
      <el-table-column prop="operator" label="提交者" min-width="100"></el-table-column>
      <el-table-column prop="createTime" label="提交时间" min-width="140"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">有效</span>
          <span v-else-if="scope.row.status === 0" class="ms-gray">无效</span>
          <span v-else-if="scope.row.status === 2" class="ms-gray">已审阅</span>
          <span v-else-if="scope.row.status === -10" class="ms-gray">已删除</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" min-width="120">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>
          <el-button type="text" size="small" @click.native.prevent="negativeTestRow(scope.$index)"> 检验 </el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除账户<code>{{scope.row.name}}</code>吗？</p>
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
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import Api from '@/api/platform/industry-negative-keyword'
  import ResponseParse from '@/utils/response-parse'
  import ElInput from '../../../../node_modules/element-ui/packages/input/src/input'
  import { FormArgument, SEARCH_CONDITION } from '@/models/platform/industry-negative-keyword'
  import { PLATFORM_LIST } from '@/utils/constants'
  import itemIndusrtyApi from '@/api/platform/item-industry'
  import ChannelApi from '@/api/platform/channel'
  import MsPlatform from '../../common/Platform'
  import { Remote } from '@/models/platform/item-solution'

  export default {
    components: {
      ElInput,
      MsPlatform,
      MsSlide,
      MsSearch,
      MsConfirmButton
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
          form: new FormArgument(),
          validate: {
            industryTitle: '',
            keywordTitle: ''
          }
        },
        url: '',
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
      platforms () {
        return PLATFORM_LIST
      },
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
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
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
        itemIndusrtyApi.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.itemIndustry = body
          } else {
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
        // 获取行业ID
        itemIndusrtyApi.list(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form.id = body.id || ''
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
      // 删除行业扩展词
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
      moreDeleteRow (index) {
        const rows = this.table.list.slice(index, index + 1)
        this.row.form = Object.assign({}, rows[0])

        this.showSlide('slideMoreDeleteRow')
      },
      // 批量删除行业否定词
      submitMoreDeleteRow () {
        this.row.form.type = this.row.form.type1
        Api.deleteNegativeStrategy({id: this.row.form.industryId, form: this.row.form}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            let index = this.row.edit.index
            let data = Object.assign({}, this.table.list[index], body)

            this.table.list.splice(index, 1, data)
            this.$message.success('批量删除失败')
          } else {
            this.$message.error(body.error || '批量删除失败')
          }
          // 关闭
          this.$refs['slideMoreDeleteRow'].close()
        })
      },
      // 检验
      negativeTestRow (index) {
        const dataCollection = this.table.list[index]
        this.row.validate.industryTitle = dataCollection.industryTitle
        this.row.validate.keywordTitle = dataCollection.title
        switch (dataCollection.platformId) {
          case 1:
            this.url = 'https://www.baidu.com/s?ie=UTF-8&wd=' + encodeURI(dataCollection.title)
            break
          case 2:
            this.url = 'https://www.so.com/s?ie=utf-8&q=' + encodeURI(dataCollection.title)
            break
          case 3:
            this.url = 'https://www.sogou.com/web?ie=utf8&query=' + encodeURI(dataCollection.title)
            break
          case 4:
            this.url = 'http://m.sm.cn/s?q=' + encodeURI(dataCollection.title)
            break
          case 5:
          default:
            alert('未知平台')
            return
        }
        this.showSlide('testSlideRow')
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
