<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>运营中心</el-breadcrumb-item>
        <el-breadcrumb-item>运营报告</el-breadcrumb-item>
        <el-breadcrumb-item>渠道消费达标日报</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">数据导出</el-button>
      </el-button-group>
    </el-row>

    <ms-slide title="数据导出" :width="500" @close="closeSlide()" ref="slideDownload">
      <el-form class="form" label-width="120px" size="small" :model="row.form" ref="formDownload">
        <el-form-item label="导出年月" prop="date" :rules="[{required: true, message: '请选择年月'}]">
          <el-date-picker v-model="row.form.date" type="month" placeholder="请选择年月"
                          value-format="yyyy-MM"></el-date-picker>
        </el-form-item>
        <el-form-item label="导出内容" prop="type" :rules="[{required: true, message: '请选择导出内容'}]">
          <el-select v-model="row.form.type">
            <el-option label="全部数据" :value="0"></el-option>
            <el-option label="部门数据" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="row.form.type == 1" label="竞价部门" prop="regulatorDepartmentId"
                      :rules="[{required: true, message: '必须指定一个部门'}]">
          <el-select v-model="row.form.regulatorDepartmentId">
            <template v-for="item in bidDepartments">
              <el-option :label="item.title" :value="item.id"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="导出格式" prop="fileGenre" :rules="[{required: true, message: '请选择导出格式'}]">
          <el-select v-model="row.form.fileGenre">
            <el-option label="Excel" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="resetForm('formDownload')">重置</el-button>
        </el-form-item>
      </el-form>
    </ms-slide>

    <div ref="msSearch"><ms-search :data="search.list" @click="updateConditions"/></div>

    <el-table
      v-loading="table.loading"
      size="small" stripe border
      :summary-method="getSummaries"
      show-summary
      :data="recombineList"
      :fit="true">
      <el-table-column prop="day" label="日期" min-width="75" fixed></el-table-column>
      <el-table-column :v-if="channelClient.length > 0" v-for="channel in channelClient" :key="channel['id']"
                       :label="channel['channelTitle']+channel['clientTitle']">
        <el-table-column :prop="channel['channelId']+'-'+channel['clientId']+'-1'" label="预算" align="right"
                         header-align="center"></el-table-column>
        <el-table-column :prop="channel['channelId']+'-'+channel['clientId']+'-2'" label="消费" align="right"
                         header-align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="合计">
        <el-table-column prop="target" label="目标" min-width="40"></el-table-column>
        <el-table-column prop="budgetAmount" label="预算" min-width="80" align="right"
                         header-align="center"></el-table-column>
        <el-table-column prop="costCoinAmount" label="消费" min-width="80" align="right"
                         header-align="center"></el-table-column>
        <el-table-column prop="diff" label="差额" min-width="80" align="right" header-align="center"></el-table-column>
        <el-table-column prop="rate" label="预算达成率" min-width="80" align="right" header-align="center"></el-table-column>
      </el-table-column>
      <el-table-column prop="visitorCount" label="所带客户" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="qualifiedCount" label="效果达标数" min-width="80" align="right"
                       header-align="center"></el-table-column>
      <el-table-column prop="qualifiedRate" label="效果达标率" min-width="80" align="right"
                       header-align="center"></el-table-column>
    </el-table>

  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/report/channel-consumption-daily'
  import UserApi from '@/api/system/system-user'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
  import moment from 'moment'

  const year = new Date().getFullYear()
  const lastMonth = moment().subtract(1, 'months').format('MM')
  export default {
    components: {
      MsSearch,
      MsSlide
    },
    mounted: function () {
      this.$nextTick(function () { this.$set(this, 'tbHeight', this.PHeigh - this.$refs.msSearch.clientHeight) })
    },
    created () {
      this.search.list = [
        {
          name: 'date',
          title: '日期',
          type: CONDITION_TYPE.DATE,
          value: year + '-' + lastMonth,
          visible: true,
          config: {
            type: DATE_PICKER_SHOW_TYPE.MONTH,
            format: 'yyyy-MM',
            valueFormat: 'yyyy-MM'
          }
        },
        {
          name: 'regulatorDepartmentId',
          title: '运营小组',
          placeholder: '--请选择运营小组--',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: []
          }
        },
        {
          name: 'regulator',
          title: '运营专员',
          placeholder: '请输入关键词',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: false,
          config: {
            list: [],
            remote: {
              enabled: true,
              loading: false,
              method: (query) => {
                const myself = this.search.list[2]
                myself.config.remote.loading = true

                if (query === '' || query === undefined) {
                  myself.config.list = []
                  myself.config.remote.loading = false
                }
                UserApi.operatorLikeness({name: query}, response => {
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
        }
      ]

      this.search.condition.date = year + '-' + lastMonth
      this.table.list = {}
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
          list: {}
        },
        bidDepartments: [],
        channelClient: [],
        channelClientAmount: [],
        row: {
          form: {
            date: '',
            type: 0,
            regulatorDepartmentId: 0,
            fileGenre: 0
          }
        }
//        PHeigh: document.documentElement.clientHeight - 120,
//        tbHeight: 100
      }
    },
    computed: {
      recombineList () {
        // 获得运营小组
        let bidDepartment = []
        this.bidDepartments.forEach(item => {
          bidDepartment.push({
            value: item.id, label: item.title
          })
        })
        this.search.list[1].config.list = bidDepartment

        let list = []

        if (this.table.list['days'] !== undefined) {
          this.table.list['days'].forEach(item => {
            let data = {}
            data.day = item.substr(4, 2) + '-' + item.substr(6, 2)

            // 初始化预算和消费
            this.channelClient.forEach(item => {
              let key = item.channelId + '-' + item.clientId
              data[key + '-1'] = 0
              data[key + '-2'] = 0
            })

            let budgetAmount = 0
            let costCoinAmount = 0

            if (this.table.list['resultMap'][item] !== undefined) {
              for (let key in this.table.list['resultMap'][item]) {
                this.channelClient.forEach(item1 => {
                  let key1 = item1.channelId + '-' + item1.clientId
                  if (key === key1) {
                    data[key + '-1'] = this.table.list['resultMap'][item][key].budget
                    data[key + '-2'] = this.table.list['resultMap'][item][key].costCoin
                    budgetAmount += data[key + '-1']
                    costCoinAmount += data[key + '-2']
                  }
                })
              }
            }
            data.budgetAmount = budgetAmount.toFixed(2)
            data.costCoinAmount = costCoinAmount.toFixed(2)
            data.diff = (budgetAmount - costCoinAmount).toFixed(2)
            data.rate = budgetAmount === 0 ? '∞' : (costCoinAmount / budgetAmount * 100).toFixed(2) + '%'

            if (this.table.list['qualifiedMap'][item] !== undefined) {
              data.visitorCount = this.table.list['qualifiedMap'][item].visitorCount
              data.qualifiedCount = this.table.list['qualifiedMap'][item].qualifiedCount
              data.qualifiedRate = data.visitorCount === 0 ? '∞' : (data.qualifiedCount / data.visitorCount * 100).toFixed(2) + '%'
            } else {
              data.visitorCount = 0
              data.qualifiedCount = 0
              data.qualifiedRate = '∞'
            }
            list.push(data)
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

        let params = Object.assign({}, {}, this.search.condition)
        Api.list(params, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.list = body.map
            this.bidDepartments = response.data.map.bidDepartments
            this.channelClient = response.data.map.channelClient
            this.channelClientAmount = response.data.map.channelClientAmount
          } else {
            this.table.list = {}
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.table.loading = false
        })
      },
      updateConditions (conditions) {
        this.search.condition = conditions
        this.requestList()
      },
      getSummaries (param) {
        let {columns, data} = param
        let sums = []

        if (data.length === 0) {
          return sums
        }

        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          }

          let values = data.map(item => Number(item[column.property]))
          if (column.property === 'target' || column.property === 'budgetAmount' ||
            column.property === 'costCoinAmount' || column.property === 'visitorCount' ||
            column.property === 'qualifiedCount') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
            }
          }
          this.channelClient.forEach(item => {
            let key = item.channelId + '-' + item.clientId
            if (column.property === (key + '-1')) {
              sums[index] = this.channelClientAmount[key].budget
            }
            if (column.property === (key + '-2')) {
              sums[index] = this.channelClientAmount[key].costCoin
            }
          })
          if (column.property === 'diff') {
            sums[index] = (sums[index - 2] - sums[index - 1]).toFixed(2)
          }
          if (column.property === 'rate') {
            sums[index] = sums[index - 3] === 0 ? '∞' : (sums[index - 2] / sums[index - 3] * 100).toFixed(2) + '%'
            sums[index - 2] = sums[index - 2].toFixed(2)
            sums[index - 3] = sums[index - 3].toFixed(2)
          }
          if (column.property === 'qualifiedRate') {
            sums[index] = sums[index - 2] === 0 ? '∞' : (sums[index - 1] / sums[index - 2] * 100).toFixed(2) + '%'
          }
        })

        return sums
      },
      download () {
        this.row.form = {}
        this.showSlide('slideDownload')
      },
      submit () {
        this.$refs['formDownload'].validate((valid) => {
          if (valid) {
            Api.download(this.row.form, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                window.location.href = '/rest/boss/report/effect-reports/files/' + body.map.sessionId
                // 关闭
                this.$refs['slideDownload'].close()
              } else {
                this.$message.error(body.error || '导出失败')
              }
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
      },
      closeSlide () {
        this.row.form = {}
      },
      dataFormat (row, column) {
        const data = row[column.property] + ''
        if (data === '' || data === undefined) {
          return ''
        } else if (data.length === 8) {
          let _data = data.substring(0, 4) + '-' + data.substring(4, 6) + '-' + data.substring(6, 8)
          return _data
        }
      }
    }
  }
</script>

<style scoped>

</style>
