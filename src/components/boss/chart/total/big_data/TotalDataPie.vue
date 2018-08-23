<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图表中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价+信息流</el-breadcrumb-item>
        <el-breadcrumb-item>总数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>总数据汇总图</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <div>
      <div v-for="(value, key) in dataGroup" class="chart" style="display: inline-block">
        <ve-ring v-if="search.condition.dataType === 1 || search.condition.dataType === 2 ||
          search.condition.dataType === 3 || search.condition.dataType === 6" :extend="extend1"
                 :data="value.data" :title="value.title" :settings="chartSetting" :loading="chartLoading"
                 :data-empty="value.empty" :legend-visible="false"></ve-ring>
        <ve-histogram v-else :data="value.data" :extend="extend" :title="value.title" :loading="chartLoading"
                      :data-empty="value.empty" :legend-visible="false"></ve-histogram>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import MsSearch from '@/components/common/Search.vue'
  import IndustryApi from '@/api/report/industry-consumption'
  import NatureApi from '@/api/report/keyword-nature-consumption'
  import RegionApi from '@/api/report/region-consumption'
  import ProvinceApi from '@/api/report/province-consumption'
  import ItemNatureApi from '@/api/report/item-nature-consumption'
  import ItemRegionApi from '@/api/report/item-region-consumption'
  import { SEARCH_CONDITION } from '@/models/report/total-data'

  export default {
    components: {
      MsSearch
    },
    data () {
      return {
        search: {
          list: [],
          condition: {}
        },
        dataGroup: {
          data1: {
            data: {},
            title: {text: '', left: 'center'},
            empty: false
          },
          data2: {
            data: {},
            title: {text: '', left: 'center'},
            empty: false
          },
          data3: {
            data: {},
            title: {text: '', left: 'center'},
            empty: false
          },
          data4: {
            data: {},
            title: {text: '', left: 'center'},
            empty: false
          },
          data5: {
            data: {},
            title: {text: '', left: 'center'},
            empty: false
          },
          data6: {
            data: {},
            title: {text: '', left: 'center'},
            empty: false
          },
          data7: {
            data: {},
            title: {text: '', left: 'center'},
            empty: false
          }
        },
        chartLoading: true,
        chartSetting: {
          limitShowNum: 0,
          radius: ['40%', '65%']
        },
        dataType: ['', 'impression', 'costCoin', 'click', 'clickRatio', 'clickPrice', 'translation', 'translationCost'],
        extend: {
          series: {
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
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
    created () {
      this.search.list = SEARCH_CONDITION

      let date = moment().subtract(1, 'months').format('YYYY-MM')
      this.search.condition.year = date.split('-')[0]
      this.search.condition.month = date.split('-')[1]
      this.search.list[0].value = date
      this.search.condition.top = 10
      this.search.condition.dataType = 2

      this.chartData = []
      this.requestList()
    },
    methods: {
      requestList () {
        this.chartLoading = true

        const search = Object.assign({}, this.search.condition)
        IndustryApi.getPie({
          search: {
            topNum: search.top,
            year: search.year,
            month: search.month,
            type: search.type
          }
        }, response => {
          let status = response.status || 0
          let data = response.data.map || {}
          if (status === 200 || status === 204) {
            let dataType = this.dataType[this.search.condition.dataType]
            let record = {}
            record.columns = ['title', '数量']
            record.rows = []
            if (Object.keys(data[dataType]).length > 0) {
              this.dataGroup.data1.empty = false
              if (dataType === 'impression' || dataType === 'costCoin' || dataType === 'click' || dataType === 'translation') {
                this.dataGroup.data1.title.top = 'center'
              } else {
                this.dataGroup.data1.title.top = ''
              }
              this.dataGroup.data1.title.text = '行业'
              for (let key in data[dataType]) {
                // 其它的值直接抛弃
                if (key === '其它') {
                  continue
                }
                record.rows.push({'title': key, '数量': data[dataType][key]})
              }
            } else {
              this.dataGroup.data1.title.text = ''
              this.dataGroup.data1.empty = true
              record.rows.push({'title': '', '数量': 0})
            }
            this.dataGroup.data1.data = record
          } else {
            this.$message.error(response.data.error || '行业排行榜获取失败')
          }
        })
        NatureApi.getPie({
          search: {
            topNum: search.top,
            year: search.year,
            month: search.month
          }
        }, response => {
          let status = response.status || 0
          let data = response.data.map || {}
          if (status === 200 || status === 204) {
            let dataType = this.dataType[this.search.condition.dataType]
            let record = {}
            record.columns = ['title', '数量']
            record.rows = []
            if (Object.keys(data[dataType]).length > 0) {
              this.dataGroup.data2.empty = false
              if (dataType === 'impression' || dataType === 'costCoin' || dataType === 'click' || dataType === 'translation') {
                this.dataGroup.data2.title.top = 'center'
              } else {
                this.dataGroup.data2.title.top = ''
              }
              this.dataGroup.data2.title.text = '词性'
              for (let key in data[dataType]) {
                // 其它的值直接抛弃
                if (key === '其它') {
                  continue
                }
                record.rows.push({'title': key, '数量': data[dataType][key]})
              }
            } else {
              this.dataGroup.data2.title.text = ''
              this.dataGroup.data2.empty = true
              record.rows.push({'title': '', '数量': 0})
            }
            this.dataGroup.data2.data = record
          } else {
            this.$message.error(response.data.error || '词性排行榜获取失败')
          }
        })
        ProvinceApi.getPie({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map || {}
          if (status === 200 || status === 204) {
            let dataType = this.dataType[this.search.condition.dataType]
            let record = {}
            record.columns = ['title', '数量']
            record.rows = []
            if (Object.keys(data[dataType]).length > 0) {
              this.dataGroup.data3.empty = false
              if (dataType === 'impression' || dataType === 'costCoin' || dataType === 'click' || dataType === 'translation') {
                this.dataGroup.data3.title.top = 'center'
              } else {
                this.dataGroup.data3.title.top = ''
              }
              this.dataGroup.data3.title.text = '省份'
              for (let key in data[dataType]) {
                // 其它的值直接抛弃
                if (key === '其它') {
                  continue
                }
                record.rows.push({'title': key, '数量': data[dataType][key]})
              }
            } else {
              this.dataGroup.data3.title.text = ''
              this.dataGroup.data3.empty = true
              record.rows.push({'title': '', '数量': 0})
            }
            this.dataGroup.data3.data = record
          } else {
            this.$message.error(response.data.error || '省排行榜获取失败')
          }
        })
        RegionApi.getCityPie({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map.data || {}
          if (status === 200 || status === 204) {
            let dataType = this.dataType[this.search.condition.dataType]
            let record = {}
            record.columns = ['title', '数量']
            record.rows = []
            if (Object.keys(data[dataType]).length > 0) {
              this.dataGroup.data4.empty = false
              for (let key in data[dataType]) {
                // 其它的值直接抛弃
                if (key === '其它') {
                  continue
                }
                record.rows.push({'title': key, '数量': data[dataType][key]})
              }
              if (dataType === 'impression' || dataType === 'costCoin' || dataType === 'click' || dataType === 'translation') {
                this.dataGroup.data4.title.top = 'center'
              } else {
                this.dataGroup.data4.title.top = ''
              }
              this.dataGroup.data4.title.text = response.data.map.title || '直辖市'
            } else {
              this.dataGroup.data4.title.text = ''
              this.dataGroup.data4.empty = true
              record.rows.push({'title': '', '数量': 0})
            }
            this.dataGroup.data4.data = record
          } else {
            this.$message.error(response.data.error || '省市排行榜获取失败')
          }
        })
        ItemNatureApi.getPie({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map.data || {}
          if (status === 200 || status === 204) {
            let dataType = this.dataType[this.search.condition.dataType]
            let record = {}
            record.columns = ['title', '数量']
            record.rows = []
            if (Object.keys(data[dataType]).length > 0) {
              this.dataGroup.data5.empty = false
              for (let key in data[dataType]) {
                // 其它的值直接抛弃
                if (key === '其它') {
                  continue
                }
                record.rows.push({'title': key, '数量': data[dataType][key]})
              }
              if (dataType === 'impression' || dataType === 'costCoin' || dataType === 'click' || dataType === 'translation') {
                this.dataGroup.data5.title.top = 'center'
              } else {
                this.dataGroup.data5.title.top = ''
              }
              this.dataGroup.data5.title.text = response.data.map.title
            } else {
              this.dataGroup.data5.title.text = ''
              this.dataGroup.data5.empty = true
              record.rows.push({'title': '', '数量': 0})
            }
            this.dataGroup.data5.data = record
          } else {
            this.$message.error(response.data.error || '项目词性排行榜获取失败')
          }
        })
        ItemRegionApi.getProvincePie({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map.data || {}
          if (status === 200 || status === 204) {
            let dataType = this.dataType[this.search.condition.dataType]
            let record = {}
            record.columns = ['title', '数量']
            record.rows = []
            if (Object.keys(data[dataType]).length > 0) {
              this.dataGroup.data6.empty = false
              for (let key in data[dataType]) {
                // 其它的值直接抛弃
                if (key === '其它') {
                  continue
                }
                record.rows.push({'title': key, '数量': data[dataType][key]})
              }
              if (dataType === 'impression' || dataType === 'costCoin' || dataType === 'click' || dataType === 'translation') {
                this.dataGroup.data6.title.top = 'center'
              } else {
                this.dataGroup.data6.title.top = ''
              }
              this.dataGroup.data6.title.text = response.data.map.title + '-省'
            } else {
              this.dataGroup.data6.title.text = ''
              this.dataGroup.data6.empty = true
              record.rows.push({'title': '', '数量': 0})
            }
            this.dataGroup.data6.data = record
          } else {
            this.$message.error(response.data.error || '项目省排行榜获取失败')
          }
        })
        ItemRegionApi.getCityPie({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map.data || {}
          if (status === 200 || status === 204) {
            let dataType = this.dataType[this.search.condition.dataType]
            let record = {}
            record.columns = ['title', '数量']
            record.rows = []
            if (Object.keys(data[dataType]).length > 0) {
              this.dataGroup.data7.empty = false
              for (let key in data[dataType]) {
                // 其它的值直接抛弃
                if (key === '其它') {
                  continue
                }
                record.rows.push({'title': key, '数量': data[dataType][key]})
              }
              if (dataType === 'impression' || dataType === 'costCoin' || dataType === 'click' || dataType === 'translation') {
                this.dataGroup.data7.title.top = 'center'
              } else {
                this.dataGroup.data7.title.top = ''
              }
              this.dataGroup.data7.title.text = response.data.map.title + '-市'
            } else {
              this.dataGroup.data7.title.text = ''
              this.dataGroup.data7.empty = true
              record.rows.push({'title': '', '数量': 0})
            }
            this.dataGroup.data7.data = record
          } else {
            this.$message.error(response.data.error || '项目省市排行榜获取失败')
          }
        })

        this.chartLoading = false
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
