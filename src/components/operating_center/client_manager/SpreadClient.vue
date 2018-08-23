<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>推广客户</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">新增推广客户</el-button>
      </el-button-group>
    </el-row>
    <!--@clickH="calculatedHeight"-->
    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <ms-slide
      :title="row.edit.enabled ? '编辑客户' : '新增客户'"
      :width="500"
      @close="closeSlideModify()"
      @show="listSaler"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item
          v-if="row.edit"
          label="所属销售"
          prop="salerId"
          :readonly="true">
          <el-select v-model="row.form.salerId">
            <template v-for="salerName in this.table.salerList">
              <el-option :label="salerName.name" :value="salerName.id" :disabled="salerName.status === 0"></el-option>
            </template>
          </el-select>
        </el-form-item>

        <el-form-item
          label="客户类型"
          prop="genre"
        >
          <el-select v-model="row.form.genre">
            <el-option label="销售客户" :value="1"/>
            <el-option label="渠道客户" :value="2"/>
          </el-select>
        </el-form-item>

        <el-form-item
          label="客户名称"
          prop="title"
          :rules="[
              {required: true, message: '必填'},
            ]">
          <el-input v-model="row.form.title" placeholder="请认真填写"></el-input>
        </el-form-item>

        <el-form-item
          label="联系人"
          prop="contacts">
          <el-input v-model="row.form.contacts" placeholder="不修改联系人请留空"></el-input>
        </el-form-item>

        <el-form-item
          label="手机"
          prop="mobile">
          <el-input v-model="row.form.mobile" placeholder="不修改手机请留空"></el-input>
        </el-form-item>

        <el-form-item
          label="状态"
          prop="status">
          <el-select v-model="row.form.status">
            <el-option label="无效" :value="0"/>
            <el-option label="有效" :value="1"/>
            <el-option label="已下稿" :value="-1"/>
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
      :data="this.table.list"
      :fit="true"
    >
      <el-table-column prop="id" label="ID" min-width="80"></el-table-column>
      <el-table-column prop="title" label="客户名称" min-width="120">
        <template slot-scope="scope">
          <div class="data-update">
            <div class="content">
              <a href="javascript:;" @click="searchCriteria(scope.row.title, index=1)">{{scope.row.title}}</a>
            </div>
            <div class="icon">
              <!-- 服务 -->
              <el-popover
                ref="popover2"
                placement="right"
                width="350"
                trigger="click">
                <template>
                  <div>
                    <el-select v-model="row.serviceId">
                      <el-option label="首联反馈" :value="1"/>
                    </el-select>
                    <el-button type="primary" @click.native.prevent="addService(scope.$index)">添加服务</el-button>
                  </div>
                  <br/>
                  <el-table
                    v-loading="row.service.loading"
                    size="small" stripe border
                    :data="row.service.list"
                    :fit="true">
                    <el-table-column prop="serviceId" label="现有服务" min-width="200">
                      <template slot-scope="scope">
                        <ms-service :service-id="scope.row.serviceId"/>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作" min-width="80">
                      <template slot-scope="scope">
                        <ms-confirm-button title="删除" @confirm="deleteService(scope.$index)">
                          <p>你确定要删除该服务吗？</p>
                        </ms-confirm-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-popover>
              <el-tooltip slot="reference" content="服务">
                <el-button v-popover:popover2 type="text" @click.native.prevent="listService(scope.row.id)">
                  <icon name="registered" class="ms-icon-btn"/>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="genre" label="客户类型" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.genre === 1" class="ms-info">销售客户</span>
          <span v-else-if="scope.row.genre === 2" class="ms-success">渠道客户</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="contacts" label="联系人" min-width="100">
        <template slot-scope="scope">
          <!--查看联系人操作-->
          <el-tooltip v-if="scope.row.contacts.length > 0 && scope.row.contacts==='***' " content="查看联系人">
            <icon name="low-vision" class="ms-icon-btn" @click.native.prevent="showContacts(scope.$index)"/>
          </el-tooltip>
          <el-tooltip v-if="scope.row.contacts.length < 1" content="不存在该联系人" class="ms-danger">
            <icon name="eye-slash"/>
          </el-tooltip>
          <!--联系人内容-->
          <template>
            <span v-if="scope.row.contacts === '***'">
              <icon v-if="scope.row.contactsLoading" name="spinner" pulse/>
            </span>
            <code v-if="scope.row.contacts.length > 0">{{scope.row.contacts}}</code>
            <span v-else="scope.row.contacts === '***'" class="ms-danger"> ***</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机" min-width="140"></el-table-column>
      <el-table-column prop="saler" label="负责人" min-width="100">
        <!--委派-->
        <template slot-scope="scope">
          {{scope.row.saler}}
          <template v-if="scope.row.toolEnabled && scope.row.status === 1">
            <ms-confirm-button
              title="委派"
              type="icon"
              icon="fax"
              :popover-width="320"
              @show="listSaler"
              @confirm="appointRow(scope.$index)">
              <el-form label-position="left" label-width="100px" :model="row">
                <el-form-item
                  label="客户名称"
                  prop="title"
                >
                  <el-input v-model=" scope.row.title" placeholder="20个字符以内" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item
                  label="原销售"
                  prop="salerId">
                  <el-select v-model="scope.row.saler" :disabled="true" :value="table.salerList.name">
                    <template v-for="salerName in table.salerList">
                      <el-option :label="salerName.name" :value="salerName.id"
                                 :disabled="salerName.status === 0"></el-option>
                    </template>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="新客户类型"
                  prop="genre1"
                  :rules="[{required: true, message:'必填'}]">
                  <el-select v-model="row.genre1">
                    <el-option label="销售客户" :value="1"></el-option>
                    <el-option label="渠道客户" :value="2"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="委派新销售"
                  prop="salerId1"
                  :rules="[{required: true, message:'必填'}]">
                  <el-select v-model="row.salerId1">
                    <template v-for="salerName in table.salerList">
                      <el-option :label="salerName.name" :value="salerName.id"
                                 :disabled="salerName.status === 0"></el-option>
                    </template>
                  </el-select>
                </el-form-item>
              </el-form>
            </ms-confirm-button>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="140"></el-table-column>
      <el-table-column prop="status" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" class="ms-success">上稿客户</span>
          <span v-else-if="scope.row.status === 0" class="ms-gray">无效</span>
          <span v-else-if="scope.row.status === -1" class="ms-gray">已下稿</span>
          <span v-else class="ms-gray">未知</span>

          <template>
            <el-tooltip v-if="scope.row.status === 1" content="设置下稿">
              <icon name="arrow-circle-down" class="ms-icon-btn" @click.native.prevent="modifyStatus(scope.$index)"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status === -1" content="设置上稿">
              <icon name="arrow-circle-up" class="ms-icon-btn" @click.native.prevent="modifyStatus(scope.$index)"/>
            </el-tooltip>
            <el-tooltip v-if="scope.row.status === 0" content="无法更改">
              <icon name="arrow-circle-up" class="ms-icon-btn" :disabled="true"/>
            </el-tooltip>
          </template>

        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status ===1">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>
          </span>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>您确定要删除客户名称为<code>{{scope.row.title}}</code>吗？</p>
          </ms-confirm-button>
          <router-link
            :to="{path:'/import-data/client-rebate-rates/',query:{customerTitle:scope.row.title}}">
            返点率
          </router-link>
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

    <!---->
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsService from '@/components/common/Service.vue'
  import FormTokenApi from '@/api/system/form-token'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import Api from '@/api/platform/spread-client'
  import ResponseParse from '@/utils/response-parse'
  import { FormArgument, SEARCH_CONDITION } from '@/models/platform/spread-client'

  export default {
    components: {
      MsSlide,
      MsSearch,
      MsConfirmButton,
      MsService
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.loading = true
      this.table.list = []
      this.table.salerList = []
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
          pagination: {},
          salerList: {}
        },
        row: {
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument(),
          genre1: '',
          salerId1: '',
          option: {
            index: 0,
            id: 0
          },
          service: {
            loading: true,
            list: []
          },
          serviceId: ''
        }
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
//    mounted: function () {
//      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
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
            this.table.list.forEach(item => {
              if (item.hasOwnProperty('contacts')) {
                item['contacts'] = '***'
              }
              item.toolEnabled = true
              if (item.hasOwnProperty('mobile')) {
                if (item.mobile.length === 11) {
                  item.mobile = item.mobile.substring(0, 3) + '* * * *' + item.mobile.substring(8, 11)
                } else if (item.mobile.length > 4) {
                  item.mobile = item.mobile.substring(3)
                }
              }
              return item
            })
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
      // 获取销售人员和媒介人员
      listSaler () {
        Api.salerMediumList(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.salerList = body
          } else {
            this.table.salerList = []
            console.error('list error')
          }
        })
      },
      listService (id) {
        this.row.serviceId = ''
        this.row.service.loading = true
        Api.listService({id: id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.row.service.list = body
          } else {
            this.row.service.list = []
          }
          this.row.service.loading = false
        })
      },
      addService (index) {
        Api.addService({id: this.table.list[index].id, serviceId: this.row.serviceId}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.service.list.unshift(body)
          } else {
            this.$message.error(body.error || '服务添加失败')
          }
        })
      },
      deleteService (index) {
        Api.deleteService({id: this.row.service.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.service.list.splice(index, 1)
            this.$message.success('删除成功')
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
        this.row.form.contacts = ''
        this.row.form.mobile = ''
        this.row.edit.enabled = true
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },
      appointRow (index) {
        // 将新值赋值给rate
        const item = this.table.list[index]
        const params = {id: item.id, genre: this.row.genre1, salerId: this.row.salerId1}
        Api.appointCustomer(params, response => {
          let status = response.status || 0
          let body = response.data || []
          let data = item
          if (status >= 200 && status <= 204) {
            this.$message.success(body.success || '修改成功')
          } else {
            this.$message.error(body.error || '修改失败')
          }
          this.table.list.unshift(body)
          this.row.genre1 = ''
          this.row.salerId1 = ''
          this.table.list[index] = data
        })
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
                  const index = this.table.salerList.findIndex(d => d.id === body.salerId)
                  if (index !== -1) {
                    body.saler = this.table.salerList[index].name
                    body.toolEnabled = true
                  }
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
      showContacts (index) {
        let data = Object.assign({}, {contactsLoading: true}, this.table.list[index])
        this.table.list.splice(index, 1, data)
        Api.lookContacts({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            let rowData = Object.assign({}, this.table.list[index], body)
            this.table.list.splice(index, 1, rowData)
          } else {
            this.$message.error(body.error || '操作失败')
          }
          this.table.list[index].contactsLoading = false
        })
      },
      modifyStatus (index) {
        const row = this.table.list[index]
        let status
        switch (row.status) {
          case 1:
            status = -1
            break
          case -1:
            status = 1
            break
          default:
            this.$message.error('未知的状态，无法操作')
            return
        }
        Api.modifyStatus({id: row.id, status: status}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1, Object.assign({}, row, body))
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .data-update {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .content {
      display: flex;
    }
    .icon {
      height: 23px;
      display: flex;
      align-items: center;
    }
  }
</style>
