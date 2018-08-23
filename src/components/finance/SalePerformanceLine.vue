<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>销售业绩日报</el-breadcrumb-item>
        <el-breadcrumb-item>图表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">导出数据</el-button>
        <router-link :to="{path:'/finance/saleman-performance',query:{search: this.search}}">显示表格</router-link>
      </el-button-group>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <ve-line :data="data" :mark-line="markLine" :mark-point="markPoint" :title="title"
             :loading="chartLoading" :data-empty="dataEmpty"></ve-line>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import { SALER_SEARCH_CONDITION } from '@/models/report/item-daily-consumption'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.chartLoading = true
      if (this.$route.query.search !== undefined) {
        this.search.list = this.$route.query.search.list
        this.search.condition = this.$route.query.search.condition
        let year = this.search.condition.year
        let month = this.search.condition.month
        let dataType = this.search.condition.dataType || 1

        this.title.text = year + '年-' + month + '月-销售业绩日报'
        if (this.$route.query.data !== undefined) {
          this.chartData = this.$route.query.data

          this.data.columns = ['day']
          let user = []
          for (let key in this.chartData.users) {
            this.data.columns.push(this.chartData.users[key].name)
            user.push({id: this.chartData.users[key].id, name: this.chartData.users[key].name})
          }
          for (let i = 1; i <= this.chartData.lastDay; i++) {
            let key = year * 10000 + month * 100 + i
            let record = {}
            record['day'] = i
            user.forEach(item => {
              if (this.chartData.data[item.id][key] !== undefined) {
                record[item.name] = this.chartData.data[item.id][key][this.dataType[dataType]]
              } else {
                record[item.name] = 0
              }
            })
            this.data.rows.push(record)
          }
        } else {
          this.dataEmpty = true
        }
      } else {
        this.search.list = SALER_SEARCH_CONDITION
        this.dataEmpty = true
        this.title.text = ''
      }
      this.chartLoading = false
    },
    data () {
      return {
        search: {
          list: [],
          condition: {}
        },
        data: {
          columns: [],
          rows: []
        },
        chartData: {},
        title: {},
        chartLoading: true,
        dataEmpty: false,
        markLine: {
          data: [
            {type: 'average', name: '平均值'}
          ]
        },
        markPoint: {
          data: [
            {type: 'max', name: '最大值'},
            {type: 'min', name: '最小值'}
          ]
        },
        dataType: {
          1: 'costCoin',
          2: 'costMoney',
          3: 'serviceCoin',
          4: 'cpCostCoin',
          5: 'cpCostMoney',
          6: 'jpCostCoin',
          7: 'jpCostMoney'
        }
      }
    },
    methods: {
      updateConditions (conditions) {
        this.search.condition = conditions
        this.$router.push({path: '/finance/saleman-performance', query: {search: this.search}})
      },
      download () {
        let condition = ''
        let year = ''
        let month = ''
        let other = ''
        if (this.search.condition.year !== undefined) {
          year = 'year=' + this.search.condition.year
          condition = '?' + year
        }
        if (this.search.condition.month !== undefined) {
          month = 'month=' + this.search.condition.month
          if (condition === '') {
            condition = '?' + month
          } else {
            condition = condition + '&' + month
          }
        }
        if (this.search.condition.other !== undefined) {
          other = 'other=' + this.search.condition.other
          if (condition === '') {
            condition = '?' + other
          } else {
            condition = condition + '&' + other
          }
        }
        if (condition === '') {
          window.location.href = '/rest/boss/report/sales-consumptions/daily/files'
        } else {
          window.location.href = '/rest/boss/report/sales-consumptions/daily/files' + condition
        }
      }
    }
  }
</script>

<style scoped>

</style>
