<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图表分析中心</el-breadcrumb-item>
        <el-breadcrumb-item>项目分析</el-breadcrumb-item>
        <el-breadcrumb-item>渠道类型柱状图</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <ve-histogram :data="recombineList" :title="title" :settings="chartSetting" :loading="chartLoading"
                  :data-empty="dataEmpty"></ve-histogram>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/channel-type-effect'
  import { HISTOGRAM_SEARCH_CONDITION } from '@/models/report/channel-type-effect'
  import 'v-charts/lib/style.css'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = HISTOGRAM_SEARCH_CONDITION
      this.search.list.forEach(item => {
        item.value = ''
      })

      this.search.condition.year = new Date().getFullYear()
      this.search.list[0].value = new Date().getFullYear().toString()
      this.search.condition.dataType = 2
      this.search.list[2].value = '消费'

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
        titleData: '',
        title: {},
        chartLoading: true,
        dataEmpty: false,
        chartSetting: {
          stack: {'合计': ['传统搜索', '信息流']}
        }
      }
    },
    computed: {
      recombineList () {
        if (this.titleData !== '') {
          this.dataEmpty = false
          this.title.text = this.search.condition.year + '年-' + this.titleData
        } else {
          this.dataEmpty = true
          this.title.text = ''
        }
        let data = {}
        data.columns = ['月份', '传统搜索', '信息流']
        data.rows = []

        let dataType = this.search.condition.dataType
        let variable
        if (dataType === 'undefined' || dataType === '') {
          variable = 'costCoin'
        } else if (dataType === 1) {
          variable = 'impression'
        } else if (dataType === 2) {
          variable = 'costCoin'
        } else if (dataType === 3) {
          variable = 'click'
        } else if (dataType === 4) {
          variable = 'clickRatio'
        } else if (dataType === 5) {
          variable = 'clickPrice'
        } else if (dataType === 6) {
          variable = 'translation'
        } else if (dataType === 7) {
          variable = 'translationCost'
        }

        for (let i = 1; i < 13; i++) {
          let record = {}
          record['月份'] = i + '月'
          if (this.chartData[i + '-' + 1] !== undefined) {
            record['传统搜索'] = this.chartData[i + '-' + 1][variable]
          } else {
            record['传统搜索'] = 0
          }
          if (this.chartData[i + '-' + 2] !== undefined) {
            record['信息流'] = this.chartData[i + '-' + 2][variable]
          } else {
            record['信息流'] = 0
          }
          data.rows.push(record)
        }
        return data
      }
    },
    methods: {
      requestList () {
        this.chartLoading = true

        const search = Object.assign({}, this.search.condition)
        Api.getBarData({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map || {}
          if (status === 200 || status === 204) {
            this.chartData = data.data
            this.titleData = data.title
          } else {
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.chartLoading = false
        })
      },
      updateConditions (conditions) {
        this.search.condition = conditions
        this.requestList()
      }
    }
  }
</script>

<style scoped>

</style>
