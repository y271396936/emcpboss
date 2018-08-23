<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图表中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>行业分析</el-breadcrumb-item>
        <el-breadcrumb-item>词性占比图</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <div class="chart" style="display: inline-block">
      <ve-ring :data="recombineCostCoin" :title="title.costCoin" :settings="chartSetting" :loading="chartLoading"
               :data-empty="recombineCostCoin.empty" :legend-visible="false" :extend="extend1"></ve-ring>
    </div>
    <div class="chart" style="display: inline-block">
      <ve-ring :data="recombineTranslation" :title="title.translation" :settings="chartSetting" :loading="chartLoading"
               :data-empty="recombineTranslation.empty" :legend-visible="false" :extend="extend1"></ve-ring>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/industry-nature-consumption'
  import { PIE_SEARCH_CONDITION } from '@/models/report/industry-nature-consumption'
  import 'v-charts/lib/style.css'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = PIE_SEARCH_CONDITION
      this.search.list.forEach(item => {
        item.value = ''
      })

      let date = moment().subtract(1, 'months').format('YYYY-MM')
      this.search.condition.year = date.split('-')[0]
      this.search.condition.month = date.split('-')[1]
      this.search.list[0].value = date
      this.search.condition.top = 10
      this.search.list[1].value = '前10'

      this.chartData = {}
      this.requestList()
    },
    data () {
      return {
        search: {
          list: [],
          condition: {}
        },
        chartData: {},
        titleData: {},
        title: {
          costCoin: {
            text: '',
            top: 'center',
            left: 'center'
          },
          translation: {
            text: '',
            top: 'center',
            left: 'center'
          }
        },
        chartLoading: true,
        chartSetting: {
          limitShowNum: 0,
          radius: ['40%', '65%']
        },
        extend1: {
          series: {
            label: {
              show: true,
              formatter: '{b}: {c} ({d}%)'
            }
          }
        }
      }
    },
    computed: {
      recombineCostCoin () {
        let data = {}
        if (this.chartData['消费'] !== undefined) {
          data.columns = ['词性', '消费']
          data.rows = []
          if (this.chartData['消费'].length > 0) {
            data.empty = false
            this.title.costCoin.text = this.titleData.costCoin + '-消费'

            this.chartData['消费'].forEach(item => {
              if (item.keywordNatureTitle === '其它') {
                return
              }
              let record = {}
              record['词性'] = item.keywordNatureTitle
              record['消费'] = item.costCoin
              data.rows.push(record)
            })
          } else {
            data.empty = true
            this.title.costCoin.text = ''

            data.rows.push({'词性': '', '消费': 0})
          }
        }

        return data
      },
      recombineTranslation () {
        let data = {}
        if (this.chartData['转化'] !== undefined) {
          data.columns = ['词性', '转化']
          data.rows = []
          if (this.chartData['转化'].length > 0) {
            data.empty = false
            this.title.translation.text = this.titleData.translation + '-转化'

            this.chartData['转化'].forEach(item => {
              if (item.keywordNatureTitle === '其它') {
                return
              }
              let record = {}
              record['词性'] = item.keywordNatureTitle
              record['转化'] = item.translation
              data.rows.push(record)
            })
          } else {
            data.empty = true
            this.title.translation.text = ''

            data.rows.push({'词性': '', '转化': 0})
          }
        }

        return data
      }
    },
    methods: {
      requestList () {
        this.chartLoading = true

        this.chartSetting.limitShowNum = this.search.condition.top

        const search = Object.assign({}, this.search.condition)
        Api.getPie({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map.data || {}
          if (status === 200 || status === 204) {
            this.chartData = data
            this.titleData = response.data.map['titleKeyword']
          } else {
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.chartLoading = false
        })
      },
      updateConditions (conditions) {
        let year = conditions.date.split('-')[0]
        let month = conditions.date.split('-')[1]
        this.search.condition = Object.assign({}, conditions, {year: year, month: month})
        this.requestList()
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 1200px) {
    .chart {
      width: 49%;
    }
  }

  @media screen and (max-width: 1200px) {
    .chart {
      width: 98%;
    }
  }
</style>
