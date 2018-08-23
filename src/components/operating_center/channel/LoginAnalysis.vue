<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>客服中心</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>登录分析</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="showInfo()">登录概况</el-button>
      </el-button-group>
    </el-row>

    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <ms-slide
      title="登录概况"
      :width="800"
      @close="closeSlide()"
      ref="slideSummary">
      <div class="wrap">
        <div>
          <ve-line :data="data1" :extend="extend" :mark-line="markLine" :loading="chartLoading1"
                   :data-empty="dataEmpty1"></ve-line>
        </div>
        <div>
          <ve-line :data="data2" :extend="extend" :mark-line="markLine" :loading="chartLoading1"
                   :data-empty="dataEmpty1"></ve-line>
        </div>
      </div>
    </ms-slide>

    <div class="wrap">
      <div>
        <ve-line :data="data" :extend="extend" :mark-line="markLine" :loading="chartLoading"
                 :data-empty="dataEmpty"></ve-line>
      </div>
      <div>
        <el-table
          v-loading="table.loading"
          :data="table.list"
          height="400"
          style="width: 100%">
          <el-table-column prop="loginTime" label="登录时间" min-width="140"></el-table-column>
          <el-table-column prop="logoutTime" label="退出时间" min-width="140"></el-table-column>
          <el-table-column prop="onlineTime" label="在线时长" min-width="60"></el-table-column>
          <el-table-column prop="address" label="登录城市" min-width="120"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import MsSlide from '@/components/common/Slide.vue'
  import Api from '@/api/system/customer-user-login-log'
  import CustomerApi from '@/api/platform/customer'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
  import moment from 'moment'

  export default {
    components: {
      MsSearch,
      MsSlide
    },
    created () {
      let date = []
      date[0] = moment().subtract(1, 'months').format('YYYY-MM-DD')
      date[1] = moment().format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]

      this.search.list = [
        {
          name: 'date',
          title: '日期',
          type: CONDITION_TYPE.DATE,
          value: date,
          visible: true,
          config: {
            type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd'
          }
        },
        {
          name: 'customerId',
          title: '客户名称',
          placeholder: '请输入关键字',
          type: CONDITION_TYPE.SELECT,
          value: '',
          visible: true,
          config: {
            list: [],
            remote: {
              enabled: true,
              loading: false,
              method:
                (query) => {
                  const mySearch = this.search.list[1]
                  mySearch.config.remote.loading = true

                  if (query === '' || query.length === 0) {
                    mySearch.config.list = []
                    mySearch.config.remote.loading = false
                    return
                  }
                  CustomerApi.likeness({search: {title: query}}, response => {
                    let status = response.status || 0
                    let body = response.data || []
                    if (status >= 200 && status <= 204) {
                      const list = []
                      body.forEach(item => {
                        list.push({value: item.id, label: item.title})
                      })
                      mySearch.config.list = list
                    }
                    mySearch.config.remote.loading = false
                  })
                }
            }
          }
        }
      ]

      if (this.$route.query.userId !== undefined) {
        this.search.condition.userId = this.$route.query.userId
        this.search.condition.customerId = this.$route.query.customerId
        this.search.condition.customer = this.$route.query.customer
      }
      this.requestList()
    },
    data () {
      return {
        search: {
          list: [],
          condition: {}
        },
        table: {
          loading: false,
          list: []
        },
        data: {
          columns: [],
          rows: []
        },
        extend: {
          series: {
            label: {
              normal: {
                show: true
              }
            }
          }
        },
        chartLoading: false,
        dataEmpty: false,
        markLine: {
          data: [
            {type: 'average', name: '平均值'}
          ]
        },
        data1: {
          columns: [],
          rows: []
        },
        data2: {
          columns: [],
          rows: []
        },
        chartLoading1: false,
        dataEmpty1: false
      }
    },
    methods: {
      requestList () {
        this.table.loading = true
        let search = Object.assign({}, this.search.condition)
        this.data = {columns: [], rows: []}
        Api.getAnalysis({search: search}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.table.list = body

            this.chartLoading = true
            this.dataEmpty = false
            let rows = {}
            body.forEach(item => {
              let temp = item.loginTime.split(' ')[0]
              if (rows[temp] !== undefined) {
                rows[temp] = rows[temp] + item.onlineTime
              } else {
                rows[temp] = item.onlineTime
              }
            })
            this.data.columns = ['日期', '在线时长']
            let day = this.search.condition.startTime
            for (let i = 1; day <= this.search.condition.endTime; i++) {
              this.data.rows.push({'日期': day, '在线时长': rows[day] === undefined ? 0 : rows[day]})
              day = moment(this.search.condition.startTime).add(i, 'days').format('YYYY-MM-DD')
            }
            this.chartLoading = false
          } else {
            this.table.list = []
            this.dataEmpty = true
            this.$message.error(body.error || '获取数据失败')
          }
          this.table.loading = false
        })
      },
      updateConditions (conditions) {
        const date = conditions.date || []
        this.search.condition = Object.assign({}, conditions, {startTime: date[0], endTime: date[1]})
        if (this.search.condition.customerId === undefined) {
          this.$message.warning('请填写客户名称')
        } else {
          this.requestList()
        }
      },
      showInfo () {
        this.chartLoading1 = true
        let search = Object.assign({}, this.search.condition)
        Api.getSummary({search: search}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.dataEmpty1 = false
            let rows = {}
            body.map['平均在线时长分析'].forEach(item => {
              rows[item.day] = item.num
            })
            this.data1.columns = ['日期', '在线时长']
            let day = this.search.condition.startTime
            for (let i = 1; day <= this.search.condition.endTime; i++) {
              let temp = day.replace(/-/g, '')
              this.data1.rows.push({'日期': day, '在线时长': rows[temp] === undefined ? 0 : rows[temp]})
              day = moment(this.search.condition.startTime).add(i, 'days').format('YYYY-MM-DD')
            }
            rows = {}
            body.map['登录人数分析'].forEach(item => {
              rows[item.day] = item.num
            })
            this.data2.columns = ['日期', '登录人数']
            day = this.search.condition.startTime
            for (let i = 1; day <= this.search.condition.endTime; i++) {
              let temp = day.replace(/-/g, '')
              this.data2.rows.push({'日期': day, '登录人数': rows[temp] === undefined ? 0 : rows[temp]})
              day = moment(this.search.condition.startTime).add(i, 'days').format('YYYY-MM-DD')
            }
          } else {
            this.dataEmpty1 = true
            this.$message.error(body.error || '获取数据失败')
          }
        })
        this.chartLoading1 = false
        this.showSlide('slideSummary')
      },
      showSlide (ref) {
        this.$refs[ref].show()
      },
      closeSlide () {
        this.data1 = {columns: [], rows: []}
        this.data2 = {columns: [], rows: []}
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrap {
    min-width: 600px;
    margin-top: 30px;
    margin-left: 5%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    > div {
      width: 90%;
      margin-bottom: 50px;
      border: 1px solid gainsboro;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
    }
  }
</style>

