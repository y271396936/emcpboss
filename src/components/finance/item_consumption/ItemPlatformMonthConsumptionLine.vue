<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>财务报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目消费报表</el-breadcrumb-item>
        <el-breadcrumb-item>项目平台消费月报</el-breadcrumb-item>
        <el-breadcrumb-item>图表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button-group>
        <router-link :to="{path:'/finance/item-consumption/platform-month-reports',query:{search: this.search}}">显示表格
        </router-link>
      </el-button-group>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <ve-line :data="data" :mark-line="markLine" :mark-point="markPoint" :title="title"
             :loading="chartLoading" :data-empty="dataEmpty" :settings="chartSetting"></ve-line>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import { PLATFORM_LIST } from '@/utils/constants'
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

        this.title.text = year + '年-项目各平台消费月报'
        if (this.$route.query.data !== undefined) {
          this.chartData = this.$route.query.data

          this.data.columns = ['month']
          let platforms = {}
          PLATFORM_LIST.forEach(item => {
            platforms[item.id] = item.title
          })
          let columns = {}
          for (let i = 1; i <= 12; i++) {
            let key1 = year * 100 + i
            let record = {}
            record['month'] = i
            for (let key in this.chartData.data) {
              let itemId = key.split('_')[0]
              let platformId = key.split('_')[1]
              if (this.chartData.data[key][key1] !== undefined) {
                let column = this.chartData.items[itemId].title + '_' + platforms[platformId]
                columns[key] = column
                record[column] = this.chartData.data[key][key1][this.dataType[dataType]]
              }
            }
            this.data.rows.push(record)
          }
          for (let key in columns) {
            this.data.columns.push(columns[key])
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
        chartSetting: {
          nullAddZero: true
        },
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
          3: 'serviceCoin'
        }
      }
    },
    methods: {
      updateConditions (conditions) {
        this.search.condition = conditions
        this.$router.push({path: '/finance/item-consumption/platform-month-reports', query: {search: this.search}})
      }
    }
  }
</script>

<style scoped>

</style>
