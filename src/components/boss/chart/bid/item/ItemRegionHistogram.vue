<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图表中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>项目分析</el-breadcrumb-item>
        <el-breadcrumb-item>地域柱状图</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <ve-histogram :data="recombineList" :title="title" :loading="chartLoading" :extend="extend"
                  :data-empty="dataEmpty"></ve-histogram>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/item-region-consumption'
  import { HISTOGRAM_SEARCH_CONDITION } from '@/models/report/item-region-consumption'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = HISTOGRAM_SEARCH_CONDITION
      this.search.list.forEach(item => {
        item.value = ''
      })

      let year = new Date().getFullYear()
      this.search.condition.year = year
      this.search.list[0].value = year.toString()
      this.search.condition.dataGroup = 1
      this.search.list[1].value = '根据省'
      this.search.condition.type = 1
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
        title: {},
        chartLoading: true,
        dataEmpty: false,
        extend: {
          series: {
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
        }
      }
    },
    computed: {
      recombineList () {
        if (Object.keys(this.chartData).length > 0) {
          this.dataEmpty = false
          this.title.text = this.search.condition.year + '年-'
        } else {
          this.dataEmpty = true
          this.title.text = ''
        }

        let data = {}
        data.columns = ['月份', '消费', '转化']
        data.rows = []
        let title = ''

        for (let i = 1; i < 13; i++) {
          let record = {}
          if (this.chartData[i] !== undefined) {
            title = this.chartData[i].itemTitle + '-' + this.chartData[i].province
            if (this.search.condition.dataGroup === 2) {
              title = title + '-' + this.chartData[i].city
            }
            record['月份'] = i + '月'
            record['消费'] = this.chartData[i].costCoin
            record['转化'] = this.chartData[i].translation
          } else {
            record['月份'] = i + '月'
            record['消费'] = 0
            record['转化'] = 0
          }
          data.rows.push(record)
        }
        this.title.text = this.title.text + title

        return data
      }
    },
    methods: {
      requestList () {
        this.chartLoading = true
        this.search.condition.type = 1
        const search = Object.assign({}, this.search.condition)
        Api.getHistogram({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map || {}
          if (status === 200 || status === 204) {
            this.chartData = data
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
