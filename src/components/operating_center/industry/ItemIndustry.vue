<template>
  <div class="ms-tree">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>行业管理</el-breadcrumb-item>
        <el-breadcrumb-item>行业分类</el-breadcrumb-item>
        <el-breadcrumb-item>结构</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="addRootNode()">新增行业</el-button>
      </el-button-group>
    </el-row>

    <ms-slide
      :title="node.edit.enabled ? '编辑行业' : '新增行业'"
      :width="500"
      @close="closeSlide()"
      ref="slideModifyNode">
      <el-form class="form" label-width="120px" size="small" :model="node.form" ref="formModifyNode">
        <el-form-item
          v-if="node.form.pid !== 0"
          label="父行业"
          prop="pTitle">
          <el-input v-model="node.form.pTitle" disabled/>
        </el-form-item>
        <el-form-item
          label="行业名称"
          prop="title"
          :rules="[
              {required: true, message: '必填'}
            ]">
          <el-input v-model="node.form.title" placeholder="长度在 20个字符以内"/>
        </el-form-item>
        <el-form-item
          label="行业扩展"
          prop="intro">
          <el-input v-model="node.form.intro" placeholder="可以包含的其他分类"/>
        </el-form-item>
        <el-form-item
          v-if="node.edit.enabled"
          label="状态"
          prop="status">
          <el-select v-model="node.form.status">
            <el-option label="无效" :value="0"/>
            <el-option label="有效" :value="1"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitNode()">提交</el-button>
          <el-button v-if="!node.edit.enabled" @click="resetForm('formModifyNode')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <ms-slide title="竞价标准" :width="800" @close="closeSlide()" ref="slideCriterion">
      <el-table :data="criterion.form" :span-method="objectSpanMethod" size="small" style="width: 100%">
        <el-table-column label="行业" prop="title" min-width="100"></el-table-column>
        <el-table-column label="平台" prop="platformTitle" min-width="75"></el-table-column>
        <el-table-column label="渠道" prop="channelTitle"></el-table-column>
        <el-table-column label="客户端" prop="clientTitle" min-width="60"></el-table-column>
        <el-table-column label="不强制53KF">
          <el-table-column label="有效对话成本标准" min-width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.priceList[0].talkPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="留言均价标准" min-width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.priceList[0].feedbackPrice"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="强制53KF">
          <el-table-column label="有效对话成本标准" min-width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.priceList[1].talkPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="留言均价标准" min-width="100">
            <template slot-scope="scope">
              <el-input v-model="scope.row.priceList[1].feedbackPrice"></el-input>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <div>
        <el-button type="primary" @click="submitCriterion()">提交</el-button>
      </div>
    </ms-slide>

    <el-tree
      lazy
      node-key="id"
      :props="tree.props"
      :load="loadChild"
      :expand-on-click-node="false"
      ref="tree">
      <p class="option" slot-scope="{ node, data }">
        <span>{{node.label}}</span>
        <span>
          <ms-confirm-button
            title="迁移"
            @show="() => migrateRow(node, data)"
            @confirm="() => submitMigrateRow(node, data)">
            <el-select v-model="migrate.form.pid" filterable size="small" placeholder="请选择目标行业">
              <el-option
                v-for="industry in industries" :key="industry.id"
                :label="industry.title"
                :value="industry.id"
                :disabled="industry.status === 0"></el-option>
            </el-select>
          </ms-confirm-button>

          <el-button
            size="mini"
            :type="node.level <= 2 ? 'warning' : 'text'"
            @click.native.prevent="() => deleteRow(node, data)">删除</el-button>
          <el-button
            size="mini"
            :type="node.level <= 2 ? 'primary' : 'text'"
            @click.native.prevent="() => modifyRow(node, data)">编辑</el-button>
          <!--<el-button-->
          <!--v-if="node.level <= 2"-->
          <!--size="mini"-->
          <!--type="primary"-->
          <!--@click.native.prevent="() => migrateRow(node, data)">迁移</el-button>-->

          <el-button
            v-if="node.level <= 2"
            type="primary"
            size="mini"
            @click.native.prevent="() => createChild(node, data)">新子行业</el-button>
          <el-button
            v-else
            size="mini"
            type="text"
            @click.native.prevent="() => showCriterion(node, data)">竞价标准</el-button>
        </span>
      </p>
    </el-tree>
  </div>
</template>

<script type="text/jsx">
  import MsSlide from '@/components/common/Slide'
  import MsConfirmButton from '@/components/common/ConfirmButton'
  import FormTokenApi from '@/api/system/form-token'
  import Api from '@/api/platform/item-industry'
  import { PLATFORM_LIST } from '@/utils/constants'
  import ChannelApi from '@/api/platform/channel'
  // import ResponseParse from '@/utils/response-parse'

  // class Criterion {
  //   constructor (channelId, clientId, kf53Opened, talkPrice, feedbackPrice) {
  //     this.channelId = channelId
  //     this.clientId = clientId
  //     this.kf53Opened = kf53Opened
  //     this.talkPrice = talkPrice
  //     this.feedbackPrice = feedbackPrice
  //   }
  // }

  export default {
    components: {
      MsSlide,
      MsConfirmButton
    },
    computed: {
      platforms () {
        return PLATFORM_LIST
      }
    },
    data () {
      return {
        // filterText: '',
        channels: [],
        industries: [],
        tree: {
          props: {
            children: 'children',
            label: 'title',
            isLeaf (data, node) {
              return node.level > 2
            }
          },
          list: []
        },
        node: {
          edit: {
            enabled: false,
            index: 0
          },
          form: {
            token: '',
            pid: 0,
            pTitle: '',
            title: '',
            intro: '',
            status: 1
          }
        },
        migrate: {
          form: {
            pid: ''
          }
        },
        criterion: {
          Node: null,
          loading: true,
          form: []
        },
        MergeArray: []
      }
    },
    // watch: {
    //   filterText (val) {
    //     this.$refs['tree'].filter(val)
    //   }
    // },
    created () {
      // 获得渠道列表
      ChannelApi.list({pageSize: 1000}, response => {
        let status = response.status || 0
        let body = response.data || []
        if (status === 200 || status === 204) {
          this.channels = body
        }
      })
    },
    methods: {
      loadChild (node, resolve) {
        this.resolve = resolve

        if (node.level === 0) {
          Api.root(response => {
            let status = response.status || 0
            let body = response.data || []
            if (status === 200 || status === 204) {
              return resolve(body)
            }
          })

          return resolve([])
        } else {
          Api.children({pid: node.data.id}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status === 200 || status === 204) {
              node.data = Object.assign({}, node.data, {children: body})
              return resolve([])
            } else {
              return resolve([])
            }
          })
        }

        return resolve([])
      },
      resolve () {
        // [修复][element-ui 2.2.0][el-tree]
        // 保存 loadChild 中的 resolve 方法，在动态加载节点，需要使用该方法防止 element-ui 无限渲染 bug
      },
      // filterNode (value, data) {
      //   if (!value) {
      //     return true
      //   }
      //
      //   return data.title.indexOf(value) !== -1
      // },
      // renderContent (h, {node, data, store}) {
      //   let extendBtn
      //   if (node.level === 1) {
      //     // 根节点渲染
      //     extendBtn = (
      //       <el-button type="primary" size="mini" on-click={ () => this.createChild(node, data) }>新子行业</el-button>
      //     )
      //   } else {
      //     extendBtn = (
      //       <el-button size="mini" type="text" on-click={ () => this.showCriterion(node, data) }>竞价标准</el-button>
      //     )
      //   }
      //
      //   return (
      //     <p style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
      //       <span>{node.label}</span>
      //       <span>
      //         <el-button size="mini" type={node.level === 1 ? 'warning' : 'text'} on-click={ () => this.delete(node, data) }>删除</el-button>
      //         <el-button size="mini" type={node.level === 1 ? 'primary' : 'text'} on-click={ () => this.modify(node, data) }>编辑</el-button>
      //         {extendBtn}
      //       </span>
      //     </p>)
      // },
      addRootNode () {
        this.node.form = {}
        this.node.form.pid = 0
        this.node.form.pTitle = ''

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.node.form.token = body.token || ''
          }
        })

        this.showSlide('slideModifyNode')
      },
      createChild (node, data) {
        this.node.form = {}
        this.node.form.pid = data.id
        this.node.form.pTitle = data.title

        // 获得 form token
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.node.form.token = body.token || ''
          }
        })

        this.showSlide('slideModifyNode')
      },
      modifyRow (node, data) {
        this.node.form = Object.assign({}, data)
        this.node.edit.enabled = true
        if (data.pid > 0) {
          this.node.form.pTitle = node.parent.label
        }

        this.showSlide('slideModifyNode')
      },
      migrateRow (node, data) {
        Api.list({all: 1, pageSize: 1000}, response => {
          let status = response.status || 0
          let body = response.data || []
          body.unshift({
            id: 0,
            pid: 0,
            title: '顶级行业',
            status: 1
          })
          if (status === 200 || status === 204) {
            this.industries = body
          }

          this.migrate.form.pid = data.pid
        })
      },
      submitMigrateRow (node, data) {
        Api.migrate({id: data.id, pid: this.migrate.form.pid}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status < 300) {
            this.$refs['tree'].remove(data.id)
            this.$refs['tree'].append(data, this.migrate.form.pid)
            this.resolve([])
          } else {
            this.$message.error(body.error || '失败')
          }
        })
      },
      submitNode () {
        this.$refs['formModifyNode'].validate((valid) => {
          if (valid) {
            if (this.node.edit.enabled) {
              Api.modify(this.node.form, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  const node = this.$refs['tree'].getNode(this.node.form.id)
                  node.data = Object.assign({}, node.data, body)
                  this.resolve([])

                  // 关闭
                  this.$refs['slideModifyNode'].close()
                } else {
                  this.$message.error(body.error || '修改失败')
                }
              })
            } else {
              Api.create(this.node.form, response => {
                let status = response.status || 0
                let body = response.data || {}
                if (status >= 200 && status <= 204) {
                  this.$refs['tree'].append(body, this.node.form.pid)
                  this.resolve([])

                  // 关闭
                  this.$refs['slideModifyNode'].close()
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
      deleteRow (node, data) {
        Api.delete({id: data.id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.$refs['tree'].remove(data.id)
            this.resolve([])
          } else {
            this.$message.error(body.error || '操作失败')
          }
        })
      },
      showCriterion (node, data) {
        this.criterion.Node = node
        this.criterion.form = []
        this.criterion.loading = true

        Api.criterion({id: data.id}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.makeCriterionForm(body)
          } else {
            this.makeCriterionForm([])
          }
        })

        this.showSlide('slideCriterion')
      },
      makeCriterionForm (body) {
        let platforms = {}
        PLATFORM_LIST.forEach(platform => {
          platforms[platform.id] = platform.title
        })

        let clients = {
          1: '手机',
          2: 'PC'
        }

        this.criterion.form = []
        this.channels.forEach(item => {
          for (let clientId in clients) {
            // 信息流只有手机
            if (item.title.indexOf('信息流') !== -1 && clientId === '2') {
              continue
            }
            // 神马只有手机
            if (item.title.indexOf('神马') !== -1 && clientId === '2') {
              continue
            }
            // 广点通只有手机
            if (item.title.indexOf('广点通') !== -1 && clientId === '2') {
              continue
            }
            if (item.title.indexOf('信息流') !== -1) {
              item.title = '信息流'
            }
            this.criterion.form.unshift({
              industryId: 0,
              title: this.criterion.Node.data.title,
              platformTitle: platforms[item.platformId],
              channelTitle: item.title,
              clientId: clientId,
              channelId: item.id,
              clientTitle: clients[clientId],
              priceList: [{
                channelId: item.id,
                clientId: clientId,
                kf53Opened: 0,
                talkPrice: '',
                feedbackPrice: ''
              }, {
                channelId: item.id,
                clientId: clientId,
                kf53Opened: 1,
                talkPrice: '',
                feedbackPrice: ''
              }]
            })
          }
        })
        for (let item of this.criterion.form) {
          for (let project of body) {
            if (item.channelId === project.channelId && item.clientId == project.clientId) {
              for (let priceList of item.priceList) {
                if (priceList.kf53Opened === project.kf53Opened) {
                  priceList.feedbackPrice = project.feedbackPrice
                  priceList.talkPrice = project.talkPrice
                }
              }
            }
          }
        }

        // 获取合并数组
        let count = 1
        let item = ''
        var index = -1
        for (let value of this.criterion.form) {
          if (value.platformTitle !== item) {
            item = value.platformTitle
            count = 1
            index++
            this.MergeArray[index] = count
          } else {
            count++
            this.MergeArray[index] = count
          }
        }
      },
      submitCriterion () {
        let list = []
        for (let key in this.criterion.form) {
          list.push(this.criterion.form[key].priceList[0])
          list.push(this.criterion.form[key].priceList[1])
        }
        Api.modifyCriterion({id: this.criterion.Node.data.id, priceList: list}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.$message.success('提交成功')
            // 关闭
            this.$refs['slideCriterion'].close()
          } else {
            this.$message.error(body.error || '失败')
          }
        })
      },
      // 合并 table 中的行
      objectSpanMethod ({row, column, rowIndex, columnIndex}) {
        let rowLength = 0
        if (this.criterion.form !== null && this.criterion.form !== undefined) {
          rowLength = this.criterion.form.length
        }
        let _this = this
        if (columnIndex === 0) {
          if (rowIndex % rowLength === 0) {
            return {
              rowspan: rowLength,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
        if (columnIndex === 1) {
          let sun = 0
          for (let i = 0; i < _this.MergeArray.length; i++) {
            if (i === 0) {
              if (rowIndex === 0) {
                return {
                  rowspan: _this.MergeArray[i],
                  colspan: 1
                }
              }
            } else if (rowIndex !== 0) {
              if (rowIndex === sun) {
                return {
                  rowspan: _this.MergeArray[i],
                  colspan: 1
                }
              }
            }
            sun = _this.MergeArray[i] + sun
          }
          if (sun >= _this.MergeArray.length - 1) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.node.form = {}
        this.node.edit = {}

        this.criterion.Node = null
        this.criterion.form = []
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .option {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>
