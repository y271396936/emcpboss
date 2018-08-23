<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>品牌优化</el-breadcrumb-item>
        <el-breadcrumb-item>行业资讯</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group v-show="showList">
        <el-button type="primary" size="small" @click="addRow()">新增行业资讯</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="primary" size="small" @click="addIndustry()">生成创业分析</el-button>
      </el-button-group>
    </el-row>
    <div ref="msSearch" v-show="showList"><ms-search :data="search.list" @click="updateConditions"/></div>

    <!--生成创业资讯-->
    <ms-slide
      title="生成创业分析"
      :width="453"
      @close="closeIndustry()"
      ref="slideIndustry">
      <el-form class="form" label-width="120px" size="small" :model="row.industry" ref="formModifyRow">
        <el-form-item label="分析类别" prop="identifying">
          <el-select v-model="row.industry.identifying" placeholder="请选择您的分析类别">
            <el-option label="省份分析" value="省份"></el-option>
            <el-option label="年龄分析" value="年龄"></el-option>
            <el-option label="词性分析" value="搜索词"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择年份" prop="year">
          <el-date-picker
            v-model="row.industry.year"
            type="year"
            format="yyyy"
            value-format="yyyy"
            placeholder="选择年">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="具体时间">
          <el-radio-group v-model="row.selected" size="mini">
            <el-radio label="month" border>月份</el-radio>
            <el-radio label="quarter" border>季度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="选择月份" prop="month"
                      v-if="row.selected === 'month'">
          <el-select v-model="row.industry.month" placeholder="请选择您的分析时间">
            <el-option v-for="item in 12" :label="item+'月份'" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择季度" prop="quarter"
                      v-if="row.selected === 'quarter'">
          <el-select v-model="row.industry.quarter" placeholder="请选择您的分析时间">
            <el-option v-for="item in 4" :label="item+'季度'" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="row.edit.enabled && row.industry.flag" label="是否撤回" prop="revoke"
                      :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.industry.revoke">
            <el-option label="不撤回" :value="false"/>
            <el-option label="撤回" :value="true"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitIndustry()">提交</el-button>
          <el-button v-if="!row.edit.enabled" @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <!--新增资讯-->
    <ms-slide
      :title="row.edit.enabled ? '编辑资讯' : '新增资讯'"
      :width="800"
      @close="closeSlide()"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="营销资讯" prop="title" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="row.form.title"></el-input>
        </el-form-item>
        <el-form-item label="略缩图" prop="picture">
          <el-input v-model="row.form.picture" disabled></el-input>
          <div class="upload">
            <el-upload
              class="upload-server"
              ref="upload"
              action="/rest/support/editor/kind/files"
              :http-request="userDefinedUpload"
              :file-list="row.fileList"
              :auto-upload="false"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              list-type="picture">
              <el-button slot="trigger" size="small" type="primary">选择图片</el-button>
              <el-button size="small" type="success" @click="submitServer()">上传到服务器</el-button>
              <div v-if="row.form.picture !== ''"></div>
              <div slot="tip">只能上传jpg/png文件，且不超过1M</div>
            </el-upload>
            <img class="upload-img" :src="row.form.picture">
          </div>
        </el-form-item>
        <el-form-item label="资讯内容" prop="content" :rules="[{required: true, message: '必填'}]">
          <ms-editor v-model="row.form.content" width="650px" height="600px"></ms-editor>
        </el-form-item>
        <el-form-item v-if="row.edit.enabled && row.form.flag" label="是否撤回" prop="revoke"
                      :rules="[{required: true, message: '必填'}]">
          <el-select v-model="row.form.revoke">
            <el-option label="不撤回" :value="false"/>
            <el-option label="撤回" :value="true"/>
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
      v-show="showList"
      :data="recombineList"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="title" label="标题" min-width="200" fixed>
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.title, index=0)">{{scope.row.title}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="publishUserName" label="发布人" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.publishUserName, index=1)">{{scope.row.publishUserName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" min-width="140"></el-table-column>
      <el-table-column label="操作" min-width="140">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="editRow(scope.$index)"> 编辑 </el-button>
          <ms-confirm-button title="删除" @confirm="deleteRow(scope.$index)">
            <p>你确定要删除标题<code>{{scope.row.title}}</code>吗？</p>
          </ms-confirm-button>
          <el-button type="text" size="small" @click.native.prevent="seeDetail(scope.$index)"> 查看 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <ms-detail-show :detail="detail" :chartData="pieData" :ageData="ageData" :provinceData="provinceData" @closeDetail="closeDetail" v-show="!showList"></ms-detail-show>
    <el-pagination
      v-show="showList"
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
  import MsEditor from '../common/Editor.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import MsDetailShow from '@/components/more_articles/DetailShow'
  import ResponseParse from '@/utils/response-parse'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/more_articles/industry-information'
  import { FormArgument, IndustryArgument, SEARCH_CONDITION, FileFormArgument } from '@/models/more_articles/industry-information'

  export default {
    components: {
      MsEditor,
      MsSearch,
      MsSlide,
      MsDetailShow,
      MsConfirmButton
    },
    created () {
      this.search.list = SEARCH_CONDITION
      this.table.list = []
      this.requestList()
    },
    data () {
      return {
        showList: true,
        detail: {
          content: '',
          title: '',
          publishTime: '',
          publisher: '',
          type: 0
        },
        pieData: {},  // 词性饼图数据
        ageData: [],   // 年龄分析数据
        provinceData: [], // 省份分析数据
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
          fileList: [],
          edit: {
            enabled: false,
            index: 0
          },
          form: new FormArgument(),
          industry: new IndustryArgument(),
          selected: '',
          fileForm: new FileFormArgument()
        }
      }
    },
    computed: {
      recombineList () {
        let list = []
        this.table.list.forEach(item => {
          let channel = item
          list.push(channel)
        })
        return list
      }
    },
    methods: {
      getProvinceData (object, sources) {
        // 封装饼图数据
        object.columns = ['省份', '点击量']
        object.rows = []
        for (let key1 in sources) {
          let record = {}
          record['省份'] = sources[key1].province
          record['点击量'] = sources[key1].click
          object.rows.push(record)
        }
        return object
      },
      getAgeData (object, ageRange, click) {
        // 封装年龄数据
        let record = {}
        record['年龄范围'] = ageRange
        record['点击量'] = click
        object.rows.push(record)
        return object
      },
      getPieData (object, sources) {
        // 封装饼图数据
        object.columns = ['词性', '点击量']
        object.rows = []
        for (let key1 in sources) {
          let record = {}
          if (sources[key1].keywordNatureTitle === '其它') {
            record['词性'] = '行业词(品牌竞品)'
          } else {
            record['词性'] = sources[key1].keywordNatureTitle
          }
          record['点击量'] = sources[key1].click
          object.rows.push(record)
        }
        return object
      },
      closeDetail () {
        this.showList = true
      },
      seeDetail (index) {
        this.detail.type = this.table.list[index].type
        if (this.detail.type === 3) { /* 普通文章类类 */
          this.detail.content = this.table.list[index].content
        }
        if (this.detail.type === 2) { /* 分析类 */
          /* 获取指定图表数据 */
          let str = this.table.list[index].content
          /* content转化成json对象 */
          let pie = JSON.parse(str)
          if (pie.type === 3) { // 封装词性饼图数据
            this.detail.content = {}
            this.detail.content = pie
            this.pieData = this.getPieData(this.pieData, pie.data)
          }
          if (pie.type === 2) { // 封装年龄数据
            this.detail.content = {}
            this.detail.content = pie
            let ageBai = {data: {columns: ['年龄范围', '点击量'], rows: []}, title: ''} // 百度信息流数据
            let ageHeader = {data: {columns: ['年龄范围', '点击量'], rows: []}, title: ''} // 今日头条信息流
            let ageUc = {data: {columns: ['年龄范围', '点击量'], rows: []}, title: ''} // UC信息流
            pie.data.forEach((value, index, arr) => {
              if (value.title === '百度信息流') {  // 封装百度信息流
                ageBai.title = '百度信息流'
                ageBai.data = this.getAgeData(ageBai.data, value.ageRange, value.click)
              }
              if (value.title === '今日头条信息流') {  // 封装今日头条信息流
                ageHeader.title = '今日头条信息流'
                ageHeader.data = this.getAgeData(ageHeader.data, value.ageRange, value.click)
              }
              if (value.title === 'UC信息流') {  // 封装UC信息流
                ageUc.title = 'UC信息流'
                ageUc.data = this.getAgeData(ageUc.data, value.ageRange, value.click)
              }
            })
            if (ageBai.data.rows.length > 0) {
              this.ageData.push(ageBai)
            }
            if (ageHeader.data.rows.length > 0) {
              this.ageData.push(ageHeader)
            }
            if (ageUc.data.rows.length > 0) {
              this.ageData.push(ageUc)
            }
          }
          if (pie.type === 1) { // 封装省份数据
            this.detail.content = {}
            this.detail.content = pie
            let provinceInfo = {data: {columns: ['省份', '点击量'], rows: []}, title: ''} // 搜索或竞价数据
            let provinceSearch = {data: {columns: ['省份', '点击量'], rows: []}, title: ''} // 信息流数据
            provinceInfo.title = '省份信息流分析'
            provinceInfo.data = this.getProvinceData(provinceInfo.data, pie.info)
            provinceSearch.title = '省份搜索引擎分析'
            provinceSearch.data = this.getProvinceData(provinceSearch.data, pie.search)
            if (provinceInfo.data.rows.length > 0) {
              this.provinceData.push(provinceInfo)
            }
            if (provinceSearch.data.rows.length > 0) {
              this.provinceData.push(provinceSearch)
            }
          }
        }
        this.detail.title = this.table.list[index].title
        this.detail.publishTime = this.table.list[index].publishTime
        this.detail.publisher = this.table.list[index].publishUserName
        this.showList = false
      },
      searchCriteria (val, index) {
        this.$set(this.search.list[index], 'value', val)
      },
      requestList () {
        this.table.loading = true
        const search = Object.assign({}, this.table.pagination, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
          } else {
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
        this.showSlide('slideModifyRow')
      },
      addIndustry () {
        this.showIndustry('slideIndustry')
      },
      editRow (index) {
        this.row.form = Object.assign({}, this.table.list[index])
        this.row.edit.enabled = true
        this.row.edit.index = index

        this.showSlide('slideModifyRow')
      },
      deleteRow (index) {
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
      },
      beforeAvatarUpload (file) {
        let format = ['gif', 'jpg', 'jpeg', 'png', 'bmp']
        let index = format.findIndex(suffix => 'image/' + suffix === file.type)
        if (index === -1) {
          this.$message.error('上传头像图片的格式必须为: gif, jpg, jpeg, png, bmp')
          return false
        }
        const isLt2M = file.size / 1024 / 1024 < 1

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 1MB!')
          return false
        }
        return true
      },
      userDefinedUpload (item) {
        this.row.fileForm.imgFile = item.file
        Api.thumbnailUpload({form: this.row.fileForm}, response => {
          if (response !== undefined) {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              if (body.error === 0) {
                this.$set(this.row.form, 'picture', body.url)
                this.$message.success('略缩图上传成功')
              } else {
                this.$message.error(body.message || '略缩图上传失败')
              }
            } else {
              this.$message.error(body.message || '略缩图上传失败')
            }
          }
        })
      },
      submitServer () {
        this.$refs.upload.submit()
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            let form = Object.assign({}, this.row.form, {type: 3})
            if (this.row.edit.enabled) {
              Api.modify({id: this.row.form.id, form: form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  let index = this.row.edit.index
                  let data = Object.assign({}, this.table.list[index], body)

                  this.table.list.splice(index, 1, data)
                  this.$message.success('修改成功')
                } else {
                  this.$message.error(body.error || '修改失败')
                }
                // 关闭
                this.$refs['slideModifyRow'].close()
              })
            } else {
              Api.create({form: form}, response => {
                let status = response.status || 0
                let body = response.data || []
                if (status >= 200 && status <= 204) {
                  // 新数据加到数组开头
                  this.table.list.unshift(body)
                  this.$message.success('新增成功')
                } else {
                  this.$message.error(body.error || '新增失败')
                }
                // 关闭
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
      submitIndustry () {
        Api.getIndustry({form: this.row.industry}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            // 新数据加到数组开头
            this.table.list.unshift(body)
            this.$message.success('新增成功')
          } else {
            this.$message.error(body.error || '新增失败')
          }
          // 关闭
          this.$refs['slideIndustry'].close()
        })
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.row.form = {}
        this.row.edit.enabled = false
        this.row.edit.index = 0
      },
      showIndustry (ref) {
        this.$refs[ref].show()
      },
      closeIndustry () {
        this.row.form = {}
      }
    }
  }
</script>

<style lang="scss" scoped="">
  .ms-list {
    .upload {
      display: flex;
      .upload-server {
        width: 300px;
      }
      .upload-img {
        max-height: 167px;
        min-height: 167px;
      }
    }
  }
</style>
