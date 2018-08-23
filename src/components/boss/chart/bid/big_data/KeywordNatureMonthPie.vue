<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图表中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>总数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>词性月占比图</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"/>

    <div style="text-align: center">
      <el-checkbox-group v-model="checkedTypes" @change="handleCheckedTypesChange">
        <el-checkbox v-for="(value, key) in type" :key="key" :label="value"/>
      </el-checkbox-group>
    </div>

    <div>
      <div v-for="(value, key) in recombineData" :key="key" v-if="show[type[key]]" class="chart"
           style="display: inline-block">
        <ve-ring v-if="key === 'impression' || key === 'costCoin' || key === 'click' || key === 'translation'"
                 :data="value" :extend="extend1" :title="value.title" :settings="chartSetting" :loading="chartLoading"
                 :data-empty="value.empty" :legend-visible="false"></ve-ring>
        <ve-histogram v-else :data="value" :extend="extend" :title="value.title" :loading="chartLoading"
                      :data-empty="value.empty" :legend-visible="false"></ve-histogram>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/keyword-nature-consumption'
  import { PIE_SEARCH_CONDITION } from '@/models/report/nature-consumption'

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
      this.search.condition.topNum = 10
      this.search.list[1].value = '前10'

      this.mapData = {}
      this.requestList()
    },
    data () {
      return {
        search: {
          list: [],
          condition: {}
        },
        mapData: {},
        chartLoading: true,
        chartSetting: {
          limitShowNum: 0,
          radius: ['40%', '65%']
        },
        type: {
          impression: '展现',
          costCoin: '消费',
          click: '点击',
          clickRatio: '点击率',
          clickPrice: '平均点击价格',
          translation: '转化',
          translationCost: '转化成本'
        },
        checkedTypes: ['展现', '点击'],
        show: {
          '展现': true,
          '消费': false,
          '点击': true,
          '点击率': false,
          '平均点击价格': false,
          '转化': false,
          '转化成本': false
        },
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
    computed: {
      recombineData () {
        let data = {}
        for (let key in this.mapData) {
          data[key] = {data: {}, title: {}, empty: false}
          if (Object.keys(this.mapData[key]).length > 0) {
            data[key].empty = false
            if (key === 'clickRatio' || key === 'clickPrice' || key === 'translationCost') {
              data[key].title = {text: this.type[key], left: 'center'}
            } else {
              data[key].title = {text: this.type[key], top: 'center', left: 'center'}
            }
            data[key].columns = ['词性', '数量']
            data[key].rows = []
            for (let key1 in this.mapData[key]) {
              // 其它的值直接抛弃
              if (key1 === '其它') {
                continue
              }
              let record = {}
              record['词性'] = key1
              record['数量'] = this.mapData[key][key1]
              data[key].rows.push(record)
            }
          } else {
            data[key].empty = true
            data[key].columns = ['词性', '数量']
            data[key].rows = []
            data[key].rows.push({'词性': '', '数量': 0})
          }
        }

        return data
      }
    },
    methods: {
      requestList () {
        this.chartLoading = true
        this.chartSetting.limitShowNum = this.search.condition.topNum

        const search = Object.assign({}, this.search.condition)
        Api.getPie({search: search}, response => {
          let status = response.status || 0
          let data = response.data.map || {}
          if (status === 200 || status === 204) {
            this.mapData = data
          } else {
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.chartLoading = false
        })
      },
      updateConditions (conditions) {
        let year = conditions.date.split('-')[0]
        let month = conditions.date.split('-')[1]
        let topNum = conditions.topNum
        this.search.condition = Object.assign({}, conditions, {year, month, topNum})
        this.requestList()
      },
      handleCheckedTypesChange (value) {
        for (let key in this.show) {
          this.show[key] = false
        }
        value.forEach(itemKey => {
          this.show[itemKey] = true
        })
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
