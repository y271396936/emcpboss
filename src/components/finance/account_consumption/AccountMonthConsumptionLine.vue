<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>账户消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>账户消费月报表</el-breadcrumb-item>
        <el-breadcrumb-item>图表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">导出数据</el-button>
        <router-link :to="{path:'/finance/account-consumption/month-reports',query:{search: this.search}}">显示表格
        </router-link>
      </el-button-group>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <ve-line :data="data" :mark-line="markLine" :mark-point="markPoint" :title="title"
             :loading="chartLoading" :data-empty="dataEmpty"></ve-line>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import { SEARCH_CONDITION } from '@/models/report/channel-account-month-consumption'

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
        let dataType = this.search.condition.dataType || 1

        this.title.text = year + '年-账户消费月报'
        if (this.$route.query.data !== undefined) {
          this.chartData = this.$route.query.data

          this.data.columns = ['month']
          let account = []
          for (let key in this.chartData.accounts) {
            this.data.columns.push(this.chartData.accounts[key].name)
            account.push({id: this.chartData.accounts[key].id, name: this.chartData.accounts[key].name})
          }
          for (let i = 1; i <= 12; i++) {
            let key = year * 100 + i
            let record = {}
            record['month'] = i
            account.forEach(item => {
              if (this.chartData.resultMap[item.id][key] !== undefined) {
                record[item.name] = this.chartData.resultMap[item.id][key][this.dataType[dataType]]
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
        this.search.list = SEARCH_CONDITION
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
          2: 'costMoney'
        }
      }
    },
    methods: {
      updateConditions (conditions) {
        this.search.condition = conditions
        this.$router.push({path: '/finance/account-consumption/month-reports', query: {search: this.search}})
      },
      download () {
        let condition = ''
        if (this.search.condition.year !== undefined) {
          let year = 'year=' + this.search.condition.year
          condition = '?' + year
        }
        if (this.search.condition.platformId !== undefined) {
          let platformId = 'platformId=' + this.search.condition.platformId
          if (condition === '') {
            condition = '?' + platformId
          } else {
            condition = condition + '&' + platformId
          }
        }
        if (this.search.condition.accountGenre !== undefined) {
          let accountGenre = 'accountGenre=' + this.search.condition.accountGenre
          if (condition === '') {
            condition = '?' + accountGenre
          } else {
            condition = condition + '&' + accountGenre
          }
        }
        if (this.search.condition.accountTitle !== undefined) {
          let accountTitle = 'accountTitle=' + this.search.condition.accountTitle
          if (condition === '') {
            condition = '?' + accountTitle
          } else {
            condition = condition + '&' + accountTitle
          }
        }
        if (condition === '') {
          window.location.href = '/rest/boss/report/channel-account-consumptions/month/files'
        } else {
          window.location.href = '/rest/boss/report/channel-account-consumptions/month/files' + condition
        }
      }
    }
  }
</script>

<style scoped>

</style>
