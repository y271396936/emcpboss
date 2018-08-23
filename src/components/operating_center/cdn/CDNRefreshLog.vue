<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>CDN刷新管理</el-breadcrumb-item>
        <el-breadcrumb-item>CDN刷新日志</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()" icon="el-icon-refresh">刷新CDN缓存</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      title="刷新CDN缓存"
      :width="500"
      ref="slideModifyRow">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formModifyRow">
        <el-form-item label="地址" prop="pageUrlAll"
                      :rules="[{required: true, message: '请填写地址'}, {validator: validateUrl}]">
          <el-input v-model="row.form.pageUrlAll" placeholder="请稍微规范下，程序会自动修正" @blur="urlBlur"></el-input>
        </el-form-item>
        <el-form-item label="刷新方式" prop="refreshGenre" :rules="[
          {required: true, message: '必选'},
          {validator: validateGenre}
        ]">
          <el-select v-model="row.form.refreshGenre" @change="genreChange">
            <el-option label="当前URL" :value="1"/>
            <el-option label="整个目录" :value="2"/>
          </el-select>
        </el-form-item>
        <template>
          <el-card class="box-card">
            <ol>
              <li>地址随便填，系统会自动修正。<span class="ms-info">发送给客户预览时，请使用以上自动修正后的地址！</span></li>
              <li>因 CDN 节点过多，大约在成功提交后五分钟内全部生效</li>
              <li>
                <strong>注意：</strong><code>http://www.xxx.com</code>和<code>http://www.xxx.com/</code>是两个不同的访问地址
              </li>
            </ol>
          </el-card>
          <br/>
        </template>
        <el-form-item>
          <el-button type="primary" @click="submitRow()">提交</el-button>
          <el-button @click="resetForm('formModifyRow')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <!--<ms-search :data="search" @click="updateConditions"></ms-search>-->
    <div ref="msSearch"><ms-search :data="search" @click="updateConditions"/></div>

    <el-table
      v-loading="loading"
      class="element-table"
      size="small" stripe border
      :data="list"
      :highlight-current-row="true"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="refreshType" label="刷新类型" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.refreshType === 1">URL</span>
          <span v-else-if="scope.row.refreshType === 2">目录</span>
          <span v-else class="ms-gray">未定义</span>
        </template>
      </el-table-column>
      <el-table-column prop="pageUrl" label="刷新页面" min-width="200">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.pageUrl, index=0)">{{scope.row.pageUrl}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="result" label="状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.result === 1" class="ms-success">成功</span>
          <span v-else-if="scope.row.result === 0" class="ms-warning">正在刷新</span>
          <span v-else-if="scope.row.result === -1" class="ms-danger">失败</span>
          <span v-else class="ms-gray">未知</span>
        </template>
      </el-table-column>
      <el-table-column prop="operator" label="操作者" min-width="80">
        <template slot-scope="scope">
          <a href="javascript:;" @click="searchCriteria(scope.row.operator, index=1)">{{scope.row.operator}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="刷新时间" min-width="140"></el-table-column>
    </el-table>

    <el-pagination
      class="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :current-page.sync="pagination.page"
      :total="pagination.totalRow"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/cdn-refresh-log'
  import UserApi from '@/api/system/system-user'
  import ResponseParse from '@/utils/response-parse'
  import { CONDITION_TYPE } from '@/utils/constants'

  export default {
    components: {
      MsSlide,
      MsSearch
    },
    created () {
      this.search = [
        {
          name: 'pageUrl',
          title: '刷新地址',
          placeholder: '刷新地址，可主域名查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'operator',
          title: '操作者',
          placeholder: '请输入关键词',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [],
            remote: {
              enabled: true,
              loading: false,
              method: (query) => {
                const myself = this.search[1]
                myself.config.remote.loading = true

                if (query === '' || query === undefined) {
                  myself.config.list = []
                  myself.config.remote.loading = false
                }
                UserApi.userLikeness({name: query}, response => {
                  let status = response.status || 0
                  let body = response.data.list || []
                  if (status >= 200 && status <= 204) {
                    let list = []
                    body.forEach(item => {
                      list.push({value: item, label: item})
                    })
                    myself.config.list = list
                  }
                  myself.config.remote.loading = false
                })
              }
            }
          }
        },
        {
          name: 'result',
          title: '状态',
          placeholder: '--状态--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [
              {value: '1', label: '成功'},
              {value: '0', label: '正在执行'},
              {value: '-1', label: '失败'}
            ]
          }
        }
      ]
      this.list = []
      this.requestList()
    },
    data () {
      return {
        search: [],
        list: [],
        loading: true,
        row: {
          form: {
            token: '',
            pageUrl: [],
            refreshType: 0,
            refreshGenre: 0
          }
        },
        pagination: {}
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
    },
    methods: {
      searchCriteria (val, index) {
        this.$set(this.search[index], 'value', val)
      },
//      calculatedHeight () {
//        this.$nextTick(function () {
//          this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//        })
//      },
      requestList () {
        this.loading = true
        let params = Object.assign({}, {page: this.pagination.page, pageSize: this.pagination.pageSize},
          this.search.condition)
        Api.list(params, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.list = body
            this.pagination = ResponseParse.pagination(response.headers)
//            if (this.pagination.totalPage === this.pagination.page && body.length <= 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight)
//            }
          } else {
//            this.tbHeight = ''
            this.list = []
            this.$message.error(body.error || '获取数据失败')
          }
          this.loading = false
        })
      },
      handleSizeChange (val) {
        this.pagination.pageSize = val
        this.requestList()
      },
      handleCurrentChange (val) {
        this.pagination.page = val
        this.requestList()
      },
      updateConditions (conditions) {
        this.pagination.page = 1
        this.search.condition = conditions
        this.requestList()
      },
      addRow () {
        this.row.form = {pageUrl: []}
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
      validateUrl (rule, value, callback) {
        this.row.form.pageUrl = []
        const tempUrl = value.split('http')
        tempUrl.forEach(item => {
          if (item === '') {
            return
          }
          item = 'http' + item
          const protocols = item.replace(/\s?/g, '').match(/^(.*):\/\/.*/)
          const protocol = Array.isArray(protocols) && protocols.length >= 2 ? protocols[1] : 'http'
          if (protocol !== 'http' && protocol !== 'https') {
            callback(new Error('不支持的通信协议 [' + protocol + ']，或者地址输入错误'))
          } else if (!(/^https?:\/\/.*/.test(value))) {
            callback(new Error('地址输入错误'))
          } else {
            this.row.form.pageUrl.push(item)
            callback()
          }
        })
      },
      urlBlur (e) {
        let urlList = []
        this.row.form.pageUrl.forEach(item => {
          // 先去掉输入中的所有空白字符、查询参数、头尾所有 /
          let url = item.replace(/\s+/g, '').replace(/\?.*$/g, '').replace(/(^\/*)|(\/*$)/g, '')

          if (url.length > 0) {
            // 根据判断最后段是否为文件
            const items = url.split('/')
            if (items.length > 1 && items[items.length - 1].indexOf('.') !== -1) {
              // 文件URL
              this.row.form.refreshType = 3
            } else {
              // 目录URL
              this.row.form.refreshType = 1
              url = url + '/'
            }

            // 重组 url
            urlList.push(url)
          }
        })
        this.row.form.pageUrl = urlList
      },
      genreChange (value) {
        if (value === 2) {
          this.row.form.refreshType = 2
        }
      },
      validateGenre (rule, value, callback) {
        this.row.form.pageUrl.forEach(item => {
          const items = item.split('/')
          if (items.length > 1 && items[items.length - 1].indexOf('.') !== -1) {
            callback(new Error('地址列表中包含文件地址！无法刷新整个目录'))
          } else {
            callback()
          }
        })
      },
      submitRow () {
        this.$refs['formModifyRow'].validate((valid) => {
          if (valid) {
            Api.create(this.row.form, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                // 新数据加到数组开头
                body.list.forEach(item => {
                  this.list.unshift(item)
                })

                if (body.map.error.length > 0) {
                  let msg = ''
                  body.map.error.forEach(item => {
                    msg = msg + item + '<br/>'
                  })
                  this.$message.error({
                    dangerouslyUseHTMLString: true,
                    message: msg
                  })
                } else {
                  this.$message.success('刷新成功')
                }
              } else {
                this.$message.error(body.error || '刷新失败')
              }
              // 关闭
              this.$refs['slideModifyRow'].close()
            })
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .element-table th {
    height: 48px;
  }

  .element-table td {
    height: 37px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }

  .box-card {
    width: 372px;
    position: relative;
    top: auto;
    left: 119px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
