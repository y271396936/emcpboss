<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目消费月报</el-breadcrumb-item>
        <el-breadcrumb-item>图表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <el-button type="primary" size="small" @click="download()">导出数据</el-button>
        <router-link :to="{path:'/finance/item-consumption/month-reports',query:{search: this.search}}">显示表格
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
  import { SEARCH_CONDITION } from '@/models/report/item-month-consumption'

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
          let item = []
          for (let key in this.chartData.item) {
            this.data.columns.push(this.chartData.item[key].title)
            item.push({id: this.chartData.item[key].id, name: this.chartData.item[key].title})
          }
          for (let i = 1; i <= 12; i++) {
            let key = year * 100 + i
            let record = {}
            record['month'] = i
            item.forEach(item => {
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
        this.$router.push({path: '/finance/item-consumption/month-reports', query: {search: this.search}})
      },
      download () {
        let condition = ''
        if (this.search.condition.year !== undefined) {
          let year = 'year=' + this.search.condition.year
          condition = '?' + year
        }
        if (this.search.condition.customerGenre !== undefined) {
          let customerGenre = 'customerGenre=' + this.search.condition.customerGenre
          if (condition === '') {
            condition = '?' + customerGenre
          } else {
            condition = condition + '&' + customerGenre
          }
        }
        if (this.search.condition.customerTitle !== undefined) {
          let customerTitle = 'customerTitle=' + this.search.condition.customerTitle
          if (condition === '') {
            condition = '?' + customerTitle
          } else {
            condition = condition + '&' + customerTitle
          }
        }
        if (this.search.condition.title !== undefined) {
          let title = 'title=' + this.search.condition.title
          if (condition === '') {
            condition = '?' + title
          } else {
            condition = condition + '&' + title
          }
        }
        if (condition === '') {
          window.location.href = '/rest/boss/report/item-consumptions/month/files'
        } else {
          window.location.href = '/rest/boss/report/item-consumptions/month/files' + condition
        }
      }
    }
  }
</script>

<style scoped>

</style>
