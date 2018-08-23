<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>品牌优化</el-breadcrumb-item>
        <el-breadcrumb-item>SEO优化</el-breadcrumb-item>
        <el-breadcrumb-item>文章发布</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRow()">启动新任务</el-button>
      </el-button-group>
    </el-row>

    <ms-slide title="执行站点" :width="500" @close="closeSlide()" ref="slideHandel">
      <ol>
        <li>
          1.需要重新执行则请点击“提交”按钮
        </li>
        <li>
          2.已执行成功的内容不会重新发布。
        </li>
      </ol>
      <el-button type="primary" @click="submit()">提交</el-button>
      <div>
        <ol>
          <li v-for="(item, index) in handle.list" :key="index"><span v-html="item"></span></li>
        </ol>
      </div>
    </ms-slide>

    <ms-slide title='日志' :width="600" @close="closeSlide()" ref="slideLogRecord">
      <el-tabs>
        <el-tab-pane label="日志">
          <template>
            <el-table size="small" stripe border :data="log.list" :fit="true">
              <el-table-column prop="id" label="ID" min-width="60"></el-table-column>
              <el-table-column prop="siteId" label="发布站点ID" min-width="60"></el-table-column>
              <el-table-column prop="status" label="是否成功">
                <template slot-scope="scope">
                  <span v-if="scope.row.status === -1" class="ms-danger">
                    失败<br>
                    <span class="ms-gray">原因：{{scope.row.status.errorNotice}}</span>
                  </span>
                  <span v-else-if="scope.row.status === 0" class="ms-gray">未执行</span>
                  <span v-else-if="scope.row.status === 1" class="ms-success">成功</span>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="文章标题" min-width="250"></el-table-column>
              <el-table-column label="文章内容" min-width="60">
                <template slot-scope="scope">略</template>
              </el-table-column>
            </el-table>
          </template>
        </el-tab-pane>
      </el-tabs>
    </ms-slide>

    <ms-slide title="编辑文章" :width="500" @close="closeSlide()" ref="slideAddTask">
      <el-steps :active="active" finish-status="success">
        <el-step title="step 1" description="输入标题和内容"></el-step>
        <el-step title="step 2" description="选择发布站点"></el-step>
        <el-step title="step 3" description="设置文章属性"></el-step>
        <el-step title="step 4" description="发布结果"></el-step>
      </el-steps>
      <div v-if="active === 0">
        <h2 style="margin-top: 30px;">输入标题和内容</h2>
        <div style="margin-top: 20px;">
          标题集
          <el-input v-model="row.form.titleText" type="textarea"></el-input>
        </div>
        <div style="margin-top: 20px;">
          内容集
          <ms-editor v-model="row.form.contentText" :toolBar="toolbar"></ms-editor>
        </div>
        <div style="margin-top: 30px;">
          <span>1.<span class="ms-danger">标题集</span>使用行分割，每行一个标题</span>
          <br>
          <span>2.<span class="ms-danger">内容集</span>使用<span class="ms-danger">文章分割符</span>分割每一篇文章</span>
        </div>
      </div>
      <div v-if="active === 1">
        <h2 style="margin-top: 30px;">选择发布站点</h2>
        <div style="margin-top: 20px;">
          发布站点
          <el-checkbox-group v-model="row.form.siteIds">
            <el-checkbox v-for="site in sites" :label="site.id" :key="site.id">{{site.title}}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <div v-if="active === 2">
        <h2 style="margin-top: 30px;">设置文章属性</h2>
        <div style="margin-top: 20px;">
          审核状态
          <el-checkbox checked disabled>已审核</el-checkbox>
        </div>
        <div style="margin-top: 20px;">
          定时发布
          <el-input v-model="row.form.cronTime" placeholder="立即发布请留空（该功能未开发）" disabled></el-input>
        </div>
        <div style="margin-top: 20px;">
          浏览数
          <el-input v-model="row.form.pageViewAmount" placeholder="自动" disabled></el-input>
        </div>
      </div>
      <div v-if="active === 3">
        <h2 style="margin-top: 30px;">发布结果</h2>
        <div v-for="(item, index) in handle.list" :key="index">
          <span v-html="item"></span>
        </div>
      </div>
      <el-button v-if="active < 4" type="primary" size="small" @click="nextStep()">下一步</el-button>
    </ms-slide>

    <el-table
      v-loading="table.loading"
      size="small" stripe border

      :data="recombineList"
      :fit="true">
      <el-table-column prop="id" label="ID" min-width="60" fixed></el-table-column>
      <el-table-column prop="publishTime" label="时间" min-width="140" fixed></el-table-column>
      <el-table-column prop="creator" label="操作者" min-width="80"></el-table-column>
      <el-table-column prop="siteAmount" label="站点总数" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="successAmount" label="成功数" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="failedAmount" label="失败数" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="finishTime" label="完成时间" min-width="140"></el-table-column>
      <el-table-column label="操作" min-width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.native.prevent="showLog(scope.$index)">日志</el-button>
          <el-button type="text" size="small" @click.native.prevent="handleRow(scope.$index)"> 执行 </el-button>
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
  import MsEditor from '../common/Editor.vue'
  import MsSearch from '@/components/common/Search.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/platform/seo-article-task'
  import SiteApi from '@/api/platform/seo-article-site'
  import ResponseParse from '@/utils/response-parse'
  import FormTokenApi from '@/api/system/form-token'

  export default {
    components: {
      MsEditor,
      MsSearch,
      MsSlide,
      MsConfirmButton
    },
    created () {
      this.table.list = []
      this.requestList()
    },
    data () {
      return {
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
        },
        log: {
          list: []
        },
        handle: {
          list: []
        },
        active: 0,
        toolbar: ['fullscreen', 'source', 'forecolor', 'bold', 'italic', 'underline', 'seo-section'],
        sites: [],
        PHeight: document.documentElement.clientHeight - 120,
        tbHeight: 100
      }
    },
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeight) })
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
      requestList () {
        this.table.loading = true
        const search = Object.assign({}, this.table.pagination)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body
            this.table.pagination = ResponseParse.pagination(response.headers)
//            if (this.table.pagination.totalPage === this.table.pagination.page && body.length < 15) {
//              this.tbHeight = ''
//            } else {
//              this.$set(this, 'tbHeight', this.PHeight)
//            }
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
      addRow () {
        this.row.form = {
          siteIds: []
        }
        this.active = 0

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.row.form.token = body.token || ''
          }
        })

        SiteApi.listAll(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.sites = body
          }
        })

        this.showSlide('slideAddTask')
      },
      nextStep () {
        if (this.active === 2) {
          Api.create({form: this.row.form}, response => {
            let status = response.status || 0
            let body = response.data || {}
            if (status >= 200 && status <= 204) {
              // 新数据加到数组开头
              this.table.list.unshift(body.map.task)
              this.handle.list = body.list
              this.active++
            } else {
              this.$message.error(body.error || '操作失败')
            }
          })
        } else {
          if (this.active++ > 3) {
            this.active = 3
          }
        }
      },
      showLog (index) {
        Api.listLog({id: this.table.list[index].id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.log.list = body
          } else {
            this.log.list = []
          }

          this.showSlide('slideLogRecord')
        })
      },
      // 执行处理
      handleRow (index) {
        this.row.form = this.table.list[index]
        this.row.edit.index = index
        this.handle.list = []
        this.showSlide('slideHandel')
      },
      submit () {
        Api.modifyHandle({id: this.row.form.id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.handle.list = response.data.list
            let index = this.row.edit.index
            let data = Object.assign({}, this.table.list[index], body.map.task)

            this.table.list.splice(index, 1, data)
            // 关闭
          } else {
            this.$message.error(body.error || '新增失败')
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
      }
    }
  }
</script>
