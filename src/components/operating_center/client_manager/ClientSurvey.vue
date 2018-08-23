<template>
    <div class="ms-list">
      <el-row class="operation">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
          <el-breadcrumb-item>客服中心</el-breadcrumb-item>
          <el-breadcrumb-item>客户管理</el-breadcrumb-item>
          <el-breadcrumb-item>客户问卷调查</el-breadcrumb-item>
          <el-breadcrumb-item>列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button-group>
          <el-popover v-model="row.visible" placement="left-start"
            @show="getSurveyToken()" @hide="getSurveyToken()">
            <el-tooltip slot="reference">
              <el-button type="primary" size="small" @click.native.prevent="row.visible = true">生成新的问卷调查</el-button>
            </el-tooltip>

            确认要生成一个新的问卷调查 ?
            <div class="option">
              <el-button type="text" size="mini" @click.native.prevent="row.visible = false">取消</el-button>
              <el-button type="primary" size="mini" :loading="row.loading" @click.native.prevent="generateSurvey()">确定</el-button>
            </div>
          </el-popover>

        </el-button-group>
      </el-row>

      <ms-slide title="问卷调查" :width="800" ref="slideSurvey">
        <el-form class="form" label-width="200px" size="small" :model="row.form" ref="formSurvey">
          <h3>一、企业详情</h3>
          <el-form-item label="推广项目名称" prop="itemName">
            <el-input disabled v-model="row.form.itemName"></el-input>
          </el-form-item>
          <el-form-item label="公司官方网址" prop="webSite">
            <el-input disabled v-model="row.form.webSite">
              <template slot="prepend">Http://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="公司成立时间" prop="regtime">
            <el-input disabled v-model="row.form.regtime" placeholder="如：2010-12-08"></el-input>
          </el-form-item>
          <el-form-item label="公司旗下品牌" prop="brands">
            <el-input disabled v-model="row.form.brands"></el-input>
          </el-form-item>
          <el-form-item label="该项目已推广" prop="popularizeTimeSpan">
            <el-input disabled v-model="row.form.popularizeTimeSpan" placeholder="多长时间"></el-input>
          </el-form-item>
          <el-form-item label="是否有分公司" prop="filiale">
            <el-radio-group disabled v-model="row.form.filiale">
              <el-radio :label="0">没有</el-radio>
              <el-radio :label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分公司所在城市" prop="filialeCitys">
            <el-input disabled v-model="row.form.filialeCitys" placeholder="多个请以逗号隔开"></el-input>
          </el-form-item>
          <el-form-item label="对外宣传" prop="cooperantShop">
            <el-input disabled v-model="row.form.cooperantShop">
              <template slot="prepend">公司目前有</template>
              <template slot="append">家加盟店</template>
            </el-input>
          </el-form-item>
          <el-form-item label="项目招商团队" prop="teamPeople">
            <el-input disabled v-model="row.form.teamPeople">
              <template slot="prepend">有</template>
              <template slot="append">人</template>
            </el-input>
          </el-form-item>
          <el-form-item label="需要我们提供多少资源量" prop="dailyMinResource">
            <el-input disabled v-model="row.form.dailyMinResource"></el-input>
          </el-form-item>
          <el-form-item label="是否有完善的在线客服部门" prop="onlineService">
            <el-radio-group disabled v-model="row.form.onlineService">
              <el-radio :label="0">没有</el-radio>
              <el-radio :label="1">有</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="公司目前的来访百分比大概是" prop="visitingRate">
            <el-input disabled v-model="row.form.visitingRate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="签单百分比大概是" prop="closeRate">
            <el-input disabled v-model="row.form.closeRate">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <h3>二、品牌定位</h3>
          <el-form-item label="项目的定位是什么" prop="productOrientation">
            <el-input disabled v-model="row.form.productOrientation"></el-input>
          </el-form-item>
          <el-form-item label="项目有哪些产品系列？" prop="products">
            <el-input disabled v-model="row.form.products"></el-input>
          </el-form-item>
          <el-form-item label="加盟商的男女比例" prop="genderRation">
            <el-input disabled v-model="row.form.genderRation" placeholder="如：6:4"></el-input>
          </el-form-item>
          <el-form-item label="年龄段主要以" prop="ageSegment">
            <el-input disabled v-model="row.form.ageSegment" placeholder="如：12-20岁，80后，大学生">
              <template slot="append">为主</template>
            </el-input>
          </el-form-item>
          <el-form-item label="核心竞争优势及主要卖点是什么？（比如免加盟费、赠送装修等）" prop="advantage">
            <el-input disabled v-model="row.form.advantage" placeholder="多个请以逗号隔开"></el-input>
          </el-form-item>
          <!--<el-form-item label="正在使用的招商页面地址" prop="joinWebSite">-->
            <!--<el-input disabled v-model="row.form.joinWebSite">-->
              <!--<template slot="prepend">http://</template>-->
            <!--</el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="投资金额" prop="minInvestment">
            <el-input disabled v-model="row.form.minInvestment">
              <template slot="prepend">最低</template>
              <template slot="append">元</template>
            </el-input>
            <el-input disabled v-model="row.form.maxInvestment">
              <template slot="prepend">最高</template>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="更加详细的加盟政策" prop="joinPolicy">
            <el-input disabled v-model="row.form.joinPolicy" type="textarea" rows="5"></el-input>
          </el-form-item>
          <el-form-item label="公司主要的竞争对手有哪些？" prop="competitor">
            <el-input disabled v-model="row.form.competitor" placeholder="多个请以逗号隔开"></el-input>
          </el-form-item>
          <el-form-item label="同行业中，正在使用电视广告或者曾经使用过电视广告的有" prop="tvCompetitor">
            <el-input disabled v-model="row.form.tvCompetitor" placeholder="多个请以逗号隔开"></el-input>
          </el-form-item>
          <br/>
        </el-form>
      </ms-slide>

      <!--<ms-search :data="search.list" @click="updateConditions" @clickH="calculatedHeight"/>-->
      <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

      <el-table
        v-loading="table.loading"
        size="small" stripe border

        :data="table.list"
        :fit="true">
        <el-table-column prop="id" label="ID" min-width="80" fixed></el-table-column>
        <el-table-column prop="key" label="唯一标识" min-width="260" fixed>
          <template slot-scope="scope">
            <a href="javascript:;" @click="searchCriteria(scope.row.key, index=1)">{{scope.row.key}}</a>
          </template>
        </el-table-column>
        <el-table-column label="地址" min-width="90">
          <template slot-scope="scope">
            <el-popover
              placement="top"
              trigger="click">
              <el-tooltip slot="reference" content="问卷调查访问地址">
                <icon name="anchor" class="ms-icon-btn"/>
              </el-tooltip>
              PC端：<a :href="generateUrl(scope.row.key).pc" target="_blank">{{generateUrl(scope.row.key).pc}}</a><br/>
              手机端：<a :href="generateUrl(scope.row.key).mobile" target="_blank">{{generateUrl(scope.row.key).mobile}}</a>
            </el-popover>
            <!--<el-tooltip slot="reference" content="刷新URL过期时间">
              <el-button type="text" @click="refreshUrl(scope.row.key)"><icon name="clock-o" class="ms-icon-btn"/></el-button>
            </el-tooltip>
            <el-tooltip slot="reference" content="关闭URL访问权限">
              <el-button type="text" @click="shutdownUrl(scope.row.key)"><icon name="exclamation-triangle" class="ms-icon-btn"/></el-button>
            </el-tooltip>-->
          </template>
        </el-table-column>
        <el-table-column prop="itemName" label="项目名称" min-width="200">
          <template slot-scope="scope">
            <a href="javascript:;" @click="searchCriteria(scope.row.itemName, index=2)">{{scope.row.itemName}}</a>
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="60">
          <template slot-scope="scope">
            <span v-if="scope.row.flag" class="ms-success">已转移</span>
            <span v-else class="ms-danger">未转移</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.native.prevent="showSurveySlide(scope.$index)">查看</el-button>
            <ms-confirm-button title="同步" @confirm="bindingItem(scope.$index)" @hide="bindingHidden()">
              <template>
                <p>请选择一个项目</p>
              </template>
              <el-select v-model="row.binding.id" filterable remote placeholder="输入关键字进行搜索"
                         :remote-method="libraryLikeness" :loading="row.binding.loading">
                <el-option v-for="item in row.binding.list" :key="item.id"
                           :label="item.title"
                           :value="item.id"></el-option>
              </el-select>
            </ms-confirm-button>
            <ms-confirm-button title="删除" @confirm="deleteSurvey(scope.$index)">
              <p>您确定要删除<code>id = {{scope.row.id}}</code>的问卷调查吗？</p>
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

<script type="text/ecmascript-6">
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'

  import {
    FormArgument, SEARCH_CONDITION
  } from '@/models/platform/survey'

  import Api from '@/api/platform/survey'
  import ItemApi from '@/api/platform/item'
  import FormTokenApi from '@/api/system/form-token'

  import ResponseParse from '@/utils/response-parse'

  export default {
    components: {
      MsSlide,
      MsSearch,
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
          visible: false,
          loading: false,
          form: new FormArgument(),
          binding: {
            loading: false,
            id: '',
            list: []
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
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      updateConditions (conditions) {
        this.table.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      handleSizeChange (val) {
        this.table.pagination.pageSize = val
        this.requestList()
      },
      handleCurrentChange (val) {
        this.table.pagination.page = val
        this.requestList()
      },
      generateSurvey () {
        this.row.loading = true
        Api.create({form: this.row.form}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list.unshift(body)
            this.row.form.token = ''
            this.$message.success('生成新的问卷调查成功, ID为: ' + body.id)
          } else {
            this.$message.error(response.data.error || '生成新的问卷调查失败')
          }
          this.row.loading = false
          this.row.visible = false
        })
      },
      getSurveyToken () {
        if (this.row.form.token === '') {
          // 获得 form token
          FormTokenApi.create(response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.row.form.token = body.token || ''
            }
          })
        }
      },
      generateUrl (key) {
        let domainHost = window.location.host
        let pc = 'http://' + domainHost + '/static/boss/platform/survey/survey.html?key=' + key
        let mobile = 'http://' + domainHost + '/static/boss/platform/survey/survey-mobile.html?key=' + key
        return {pc: pc, mobile: mobile}
      },
      /* refreshUrl (key) {
        Api.refresh({key}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.$message.success('刷新成功, url将可以正常访问')
          } else {
            this.$message.error(body.error || '刷新失败, 请重试')
          }
        })
      },
      shutdownUrl (key) {
        Api.shutdown({key}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.$message.success('已关闭访问权限, url将无法访问')
          } else {
            this.$message.error(body.error || '关闭失败, 请重试')
          }
        })
      }, */
      showSurveySlide (index) {
        this.row.form = this.table.list[index]
        this.$refs['slideSurvey'].show()
      },
      libraryLikeness (query) {
        if (query === '' || query.length === 0) {
          return
        }

        this.row.binding.loading = true
        ItemApi.likeness({title: query}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.row.binding.list = body
          }
          this.row.binding.loading = false
        })
      },
      bindingHidden () {
        this.row.binding.id = ''
        this.row.binding.list = []
      },
      bindingItem (index) {
        if (this.row.binding.id === '') {
          this.$message.error('请先选择一个项目')
          return
        }

        Api.binding({
          id: this.table.list[index].id,
          itemId: this.row.binding.id
        }, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status >= 200 && status <= 204) {
            this.table.list[index].flag = 1
            this.$message.success('同步信息成功')
          } else {
            this.$message.error(body.error || '同步信息成功')
          }
        })
      },
      deleteSurvey (index) {
        Api.delete({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.table.list.splice(index, 1)
            this.$message.success('删除成功')
          } else {
            this.$message.error(body.error || '删除失败')
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .option {
    text-align: right;
  }
</style>
