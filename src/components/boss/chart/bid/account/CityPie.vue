<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>图表中心</el-breadcrumb-item>
        <el-breadcrumb-item>竞价</el-breadcrumb-item>
        <el-breadcrumb-item>账户分析</el-breadcrumb-item>
        <el-breadcrumb-item>城市月占比图</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <ms-search :data="search.list" @click="updateConditions"></ms-search>

    <div style="text-align: center">
      <el-checkbox-group v-model="checkedTypes" @change="handleCheckedTypesChange">
        <el-checkbox v-for="(value, key) in type" :label="value" :key="key"></el-checkbox>
      </el-checkbox-group>
    </div>

    <h1 style="text-align: center;">{{title}}</h1>

    <div>
      <div v-for="(value, key) in recombineData" v-if="show[type[key]]" class="chart"
           style="display: inline-block">
        <ve-ring v-if="key === 'impression' || key === 'costCoin' || key === 'click' || key === 'translation'"
                 :data="value" :title="value.title" :settings="chartSetting" :loading="chartLoading" :extend="extend1"
                 :data-empty="value.empty" :legend-visible="false"></ve-ring>
        <ve-histogram :extend="extend" v-else :data="value" :title="value.title" :loading="chartLoading"
                      :data-empty="value.empty" :legend-visible="false"></ve-histogram>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/item-region-consumption'
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '@/utils/constants'

  export default {
    components: {
      MsSearch
    },
    created () {
      const platforms = []
      PLATFORM_LIST.forEach(item => {
        platforms.push({
          value: item.id, label: item.title
        })
      })
      let date = []
      date[0] = moment().subtract(7, 'days').format('YYYY-MM-DD')
      date[1] = moment().subtract(0, 'days').format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]

      this.search.list = [
        {
          name: 'time',
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
          name: 'top',
          title: '排名',
          placeholder: '--请选择排名--',
          type: CONDITION_TYPE.SELECT,
          value: '前10',
          visible: true,
          config: {
            list: [
              {value: 5, label: '前5'},
              {value: 10, label: '前10'},
              {value: 15, label: '前15'},
              {value: 20, label: '前20'}
            ]
          }
        },
        {
          name: 'itemTitle',
          title: '项目',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'province',
          title: '省份',
          placeholder: '支持模糊查询',
          type: CONDITION_TYPE.TEXT,
          value: '',
          visible: true
        },
        {
          name: 'platformId',
          title: '所属平台',
          placeholder: '--请选择所属平台--',
          type: CONDITION_TYPE.SELECT,
          value: platforms[0].label,
          visible: true,
          config: {
            list: platforms
          }
        }
      ]
      this.search.condition.top = 10
      this.search.condition.type = 1
      this.search.condition.platformId = 1

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
        title: '',
        chartLoading: true,
        chartSetting: {
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
        for (let key in this.chartData) {
          data[key] = {data: {}, title: {}, empty: false}
          if (Object.keys(this.chartData[key]).length > 0) {
            data[key].empty = false
            if (key === 'clickRatio' || key === 'clickPrice' || key === 'translationCost') {
              data[key].title = {text: this.type[key], left: 'center'}
            } else {
              data[key].title = {text: this.type[key], top: 'center', left: 'center'}
            }
            data[key].columns = ['城市', '数量']
            data[key].rows = []
            for (let key1 in this.chartData[key]) {
              // 其它的值直接抛弃
              if (key1 === '其它') {
                continue
              }
              let record = {}
              record['城市'] = key1
              if (key === 'clickRatio' || key === 'clickPrice' || key === 'translationCost') {
                record['数量'] = this.chartData[key][key1].toFixed(2)
              } else {
                record['数量'] = this.chartData[key][key1]
              }
              data[key].rows.push(record)
            }
          } else {
            data[key].empty = true
            data[key].columns = ['城市', '数量']
            data[key].rows = []
            data[key].rows.push({'城市': '', '数量': 0})
          }
        }
        return data
      }
    },
    methods: {
      requestList () {
        this.chartLoading = true

        const search = Object.assign({}, this.search.condition)
        Api.getPlatformCityPie({search: search}, response => {
          let status = response.status || 0
          let data = response.data || {}
          if (status === 200 || status === 204) {
            this.chartData = data.map.data
            this.title = data.map.title
          } else {
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.chartLoading = false
        })
      },
      updateConditions (conditions) {
        const time = conditions.time || []
        this.search.condition = Object.assign({}, conditions, {startTime: time[0], endTime: time[1]})
        this.search.condition.type = 1
        this.requestList()
      },
      handleCheckedTypesChange (value) {
        for (let key in this.show) {
          this.show[key] = false
        }
        value.forEach(item => {
          this.show[item] = true
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
