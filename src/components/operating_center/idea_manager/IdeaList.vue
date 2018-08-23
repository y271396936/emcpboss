<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>关键词管理</el-breadcrumb-item>
        <el-breadcrumb-item>创意列表</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">
          <icon name="book" scale="0.8"/>
          新增创意
        </el-button>
      </el-button-group>

      <el-button-group>
        <el-button type="primary" size="small" @click="download()">
          <icon name="cloud-download" scale="0.8"/>
          创意下载
        </el-button>
      </el-button-group>
    </el-row>

    <div ref="msSearch">
      <!--@clickH="calculatedHeight"-->
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <ms-slide
      :title="row.edit.enabled ? '编辑创意' : '新增创意'"
      :width="500"
      @close="closeSlideModify()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="平台" prop="flatId" :rules="[{required: true, message:'请选择平台'}]">
          <el-select v-model="row.form.flatId" :disabled="row.edit.enabled">
            <el-option label="竞价" :value="1"/>
            <el-option label="百度信息流" :value="2"/>
            <el-option label="360信息流" :value="3"/>
            <el-option label="今日头条信息流" :value="4"/>
            <el-option label="UC信息流" :value="5"/>
            <el-option label="一点资讯信息流" :value="6"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="row.form.flatId === 2 || row.form.flatId === 5" label="创意类型" prop="ideaType"
                      :rules="[{required: true, message:'请选择创意类型'}]">
          <el-select v-model="row.form.ideaType" :disabled="row.edit.enabled">
            <el-option v-if="row.form.flatId === 2" label="组图" :value="1"/>
            <el-option v-if="row.form.flatId === 5" label="三图" :value="2"/>
            <el-option v-if="row.form.flatId === 5" label="小图" :value="3"/>
            <el-option v-if="row.form.flatId === 2" label="其他" :value="4"/>
          </el-select>
        </el-form-item>
        <el-form-item label="创意" prop="idea" :rules="[{required: true, message:'必填'}]">
          <el-input v-model="row.form.idea" placeholder="请认真填写"></el-input>
        </el-form-item>
        <el-form-item v-if="row.form.flatId === 1" label="创意描述1" prop="idea1"
                      :rules="[{required: true, message:'请填写创意描述1'}]">
          <el-input v-model="row.form.idea1" placeholder="请认真填写"></el-input>
        </el-form-item>
        <el-form-item v-if="row.form.flatId === 1" label="创意描述2" prop="idea2"
                      :rules="[{required: true, message:'请填写创意描述2'}]">
          <el-input v-model="row.form.idea2" placeholder="请认真填写"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="项目方案列表" :width="600" ref="slideOrientation">
      <el-tabs v-model="row.itemSolution.activeName" @tab-click="tabChange">
        <el-tab-pane label="绑定项目方案" name="upItemSolution">
          <template>
            <el-form class="form" label-width="120px" size="small" :model="row.itemSolution.form"
                     ref="formModifyItemRow">
              <el-form-item label="客户端" prop="clientId" :rules="[{required: true, message: '必填'},]">
                <el-select v-model="row.itemSolution.form.clientId">
                  <el-option label="综合" :value="0" disabled/>
                  <el-option label="PC端" :value="1"/>
                  <el-option label="手机" :value="2"/>
                  <el-option label="APP" :value="3" disabled/>
                </el-select>
              </el-form-item>
              <el-form-item label="推广渠道" prop="channelId" :rules="[{required: true, message: '必填'}]">
                <el-select v-model="row.itemSolution.form.channelId" :disabled="row.edit.enabled">
                  <template v-for="channel in channels">
                    <el-option :label="channel.title" :value="channel.id"></el-option>
                  </template>
                </el-select>
              </el-form-item>
              <el-form-item label="推广账户" prop="channelId" :rules="[{required: true, message: '必填'}]">
                <el-select v-model="row.itemSolution.form.accountId" filterable remote placeholder="请输入关键字"
                           :remote-method="accountLikeness" :loading="remote.account.loading">
                  <el-option
                    v-for="account in remote.account.list" :key="account.id"
                    :label="account.name"
                    :value="account.id"
                    :disabled="account.status === 0"/>
                </el-select>
              </el-form-item>
              <el-form-item label="项目名称" prop="itemId" :rules="[{required: true, message: '必填'}]">
                <el-select v-model="row.itemSolution.form.itemId" filterable remote placeholder="请输入关键字"
                           :remote-method="itemLikeness" :loading="remote.item.loading">
                  <el-option
                    v-for="item in remote.item.list" :key="item.id"
                    :label="item.title"
                    :value="item.id"
                    :disabled="item.status === 0"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="addItemSolution()">提交</el-button>
                <el-button @click="resetForm('formModifyItemRow')">重置</el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-tab-pane>
        <el-tab-pane label="项目方案列表" name="ItemSolutionList">
          <template>
            <el-table size="small" stripe border :data="row.itemSolution.list" :fit="true">
              <el-table-column prop="industry" label="行业名"></el-table-column>
              <el-table-column prop="itemTitle" label="项目名"></el-table-column>
              <el-table-column prop="channelTitle" label="渠道名"></el-table-column>
              <el-table-column prop="accountTitle" label="账户"></el-table-column>
              <el-table-column prop="clientId" label="设备">
                <template slot-scope="scope">
                  <span v-if="scope.row.clientId ===0">综合</span>
                  <span v-if="scope.row.clientId ===1">PC</span>
                  <span v-if="scope.row.clientId ===2">手机</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="140">
                <template slot-scope="scope">
                  <ms-confirm-button title="删除" @confirm="deleteItemSolution(scope.$index)">
                    <p>您确定要解除该创意与项目方案的联系吗？</p>
                  </ms-confirm-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              class="pagination"
              layout="total, sizes, prev, pager, next, jumper"
              :current-page.sync="row.itemSolution.pagination.page"
              :total="row.itemSolution.pagination.totalRow"
              :page-size="row.itemSolution.pagination.pageSize"
              :page-sizes="row.itemSolution.pagination.pageSizes"
              @size-change="handleItemSolutionSizeChange"
              @current-change="handleItemSolutionCurrentChange"/>
          </template>
        </el-tab-pane>
      </el-tabs>
    </ms-slide>

    <el-table
      v-loading="table.loading"
      size="small" stripe border

      :data="table.list"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="80"></el-table-column>
      <el-table-column prop="flatId" label="平台" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.flatId ===1">竞价</span>
          <span v-if="scope.row.flatId ===2">百度信息流</span>
          <span v-if="scope.row.flatId ===3">360信息流</span>
          <span v-if="scope.row.flatId ===4">今日头条信息流</span>
          <span v-if="scope.row.flatId ===5">UC信息流</span>
          <span v-if="scope.row.flatId ===6">一点资讯信息流</span>
        </template>
      </el-table-column>
      <el-table-column prop="ideaType" label="创意类型" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ideaType ===1">组图</span>
          <span v-if="scope.row.ideaType ===2">三图</span>
          <span v-if="scope.row.ideaType ===3">小图</span>
          <span v-if="scope.row.ideaType ===4">其他</span>
        </template>
      </el-table-column>
      <el-table-column prop="idea" label="创意" min-width="200"></el-table-column>
      <el-table-column prop="idea1" label="创意描述1" min-width="200"></el-table-column>
      <el-table-column prop="idea2" label="创意描述2" min-width="200"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="60">
        <template slot-scope="scope">
          <span v-if="scope.row.status ===0" class="ms-danger">未使用</span>
          <span v-if="scope.row.status ===1" class="ms-success">已使用</span>
        </template>
      </el-table-column>
      <el-table-column prop="creator" label="创建人" min-width="60"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="140"></el-table-column>
      <el-table-column label="操作" min-width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)">编辑</el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除创意名称为<code>{{scope.row.idea}}</code>吗？</p>
          </ms-confirm-button>
          <el-button type="text" size="small" @click.native.prevent="itemSolutionRow(scope.$index)">项目方案列表</el-button>
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
  import Api from '@/api/platform/idea'
  import ResponseParse from '@/utils/response-parse'
  import FormTokenApi from '@/api/system/form-token'
  import ItemApi from '@/api/platform/item'
  import ChannelAccountApi from '@/api/platform/channel-account'
  import ChannelApi from '@/api/platform/channel'
  import { FormArgument, SEARCH_CONDITION } from '@/models/platform/idea'

  export default {
    components: {
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
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument(),
          itemSolution: {
            form: {},
            list: [],
            pagination: {},
            search: {
              id: ''
            },
            activeName: 'upItemSolution'
          }
        },
        remote: {
          account: {
            loading: false,
            list: []
          },
          item: {
            loading: false,
            list: []
          }
        },
        channels: []
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
//    },
    created () {
      this.search.list = SEARCH_CONDITION
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
      // 添加创意
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
                  this.$message.success('修改成功')
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
      // 项目方案列表
      itemSolutionRow (index) {
        this.row.itemSolution.form = {}
        this.row.itemSolution.form.ideaId = this.table.list[index].id

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.itemSolution.form.token = body.token || ''
          }
        })

        this.channels = []
        ChannelApi.list({}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.channels = body
          } else {
            this.channels = []
          }
        })

        this.row.itemSolution.activeName = 'upItemSolution'

        this.showSlide('slideOrientation')
      },
      addItemSolution () {
        this.$refs['formModifyItemRow'].validate((valid) => {
          if (valid) {
            Api.addItemSolution({id: this.row.itemSolution.form.ideaId, form: this.row.itemSolution.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                this.$message.success('添加成功')
              } else {
                this.$message.error(body.error || '添加失败')
              }
              // 再次获取token
              FormTokenApi.create(response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  this.row.itemSolution.form.token = body.token || ''
                }
              })
            })
          }
        })
      },
      tabChange (tab) {
        if (tab.name === 'ItemSolutionList') {
          this.row.itemSolution.list = []
          // 清空分页
          this.row.itemSolution.pagination = []
          this.getItemSolutionList()
        }
      },
      getItemSolutionList () {
        const search = Object.assign({}, this.row.itemSolution.pagination)
        Api.itemSolutionList({id: this.row.itemSolution.form.ideaId, search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.row.itemSolution.list = body
            this.row.itemSolution.pagination = ResponseParse.pagination(response.headers)
          } else {
            this.row.itemSolution.list = []
          }
        })
      },
      deleteRow (index) {
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
            this.$message.success(body.error || '删除成功')
          } else {
            this.$message.error(body.error || '删除失败')
          }
        })
      },
      itemLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.item.list = []
          return
        }

        this.remote.item.loading = true
        ItemApi.likeness({title: query, pageSize: 100}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.item.list = body
          }
          this.remote.item.loading = false
        })
      },
      accountLikeness (query) {
        if (query === '' || query.length === 0) {
          this.remote.account.list = []
          return
        }

        let platformId = 0
        this.channels.forEach(item => {
          if (item.id === this.row.itemSolution.form.channelId) {
            platformId = item.platformId
          }
        })
        const search = {name: query, platformId: platformId, pageSize: 100}
        this.remote.account.loading = true
        ChannelAccountApi.likeness({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.remote.account.list = body
          }
          this.remote.account.loading = false
        })
      },
      // 删除推广词
      deleteItemSolution (index) {
        Api.deleteItemSolution({id: this.row.itemSolution.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.itemSolution.list.splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlideModify () {
        this.row.edit.enabled = false
        this.row.edit.index = 0
      },
      handleSizeChange (val) {
        this.table.pagination.pageSize = val
        this.requestList()
      },
      handleCurrentChange (val) {
        this.table.pagination.page = val
        this.requestList()
      },
      handleItemSolutionSizeChange (val) {
        this.row.itemSolution.pagination.pageSize = val
        this.getItemSolutionList()
      },
      handleItemSolutionCurrentChange (val) {
        this.row.itemSolution.pagination.pageSize = val
        this.getItemSolutionList()
      },
      updateConditions (conditions) {
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      download () {
        let condition = ''
        if (this.search.condition.flatId !== undefined) {
          let flatId = 'flatId=' + this.search.condition.flatId
          if (condition === '') {
            condition = '?' + flatId
          } else {
            condition = condition + '&' + flatId
          }
        }
        if (this.search.condition.idea !== undefined) {
          let idea = 'idea=' + this.search.condition.idea
          if (condition === '') {
            condition = '?' + idea
          } else {
            condition = condition + '&' + idea
          }
        }
        if (this.search.condition.status !== undefined) {
          let status = 'status=' + this.search.condition.status
          if (condition === '') {
            condition = '?' + status
          } else {
            condition = condition + '&' + status
          }
        }
        if (condition === '') {
          window.location.href = '/rest/boss/platform/ideas/files'
        } else {
          window.location.href = '/rest/boss/platform/ideas/files' + condition
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cell-box {
    .el-button {
      padding: 0;
    }
  }
</style>
