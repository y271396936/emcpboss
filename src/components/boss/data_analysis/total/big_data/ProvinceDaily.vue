<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>数据分析</el-breadcrumb-item>
        <el-breadcrumb-item>竞价+信息流</el-breadcrumb-item>
        <el-breadcrumb-item>大数据汇总</el-breadcrumb-item>
        <el-breadcrumb-item>省份日报</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div ref="msSearch">
      <ms-search :data="search.list" @click="updateConditions"/>
    </div>

    <el-table
      size="small" stripe border
      v-loading="loading"
      :data="recombineList"
      show-summary
      :summary-method="getSummaries"
      :fit="true">
      <el-table-column prop="province" label="省份" min-width="100" fixed="left"></el-table-column>
      <el-table-column v-for="a in lastDay" :key="a" :prop="a.toString()" :label='a+"日"' min-width="80" align="right"
                       header-align="center">
      </el-table-column>
      <el-table-column prop="total" label="合计" min-width="95" align="right" header-align="center"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  import MsSearch from '@/components/common/Search.vue'
  import Api from '@/api/report/province-consumption'
  import { DAILY_SEARCH_CONDITION } from '@/models/report/province-consumption'
  import moment from 'moment'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.search.list = DAILY_SEARCH_CONDITION
      let lastMonth = moment().subtract(1, 'months').format('YYYY-MM')
      this.search.list[0].value = lastMonth
      this.search.condition.date = lastMonth
      this.search.condition.year = lastMonth.split('-')[0]
      this.search.condition.month = lastMonth.split('-')[1]
      this.requestList()
    },
    data () {
      return {
        search: {
          list: [],
          condition: {}
        },
        loading: false,
        dailyData: {},
        lastDay: 0
      }
    },
    computed: {
      recombineList () {
        let dataType = this.search.list[1].value
        let data = []
        if (Object.keys(this.dailyData).length > 0) {
          let attr = ''
          switch (dataType) {
            case '总展现次数':
              attr = 'impression'
              break
            case '总消费点数':
              attr = 'costCoin'
              break
            case '总点击次数':
              attr = 'click'
              break
            case '点击率':
              attr = 'clickRatio'
              break
            case '平均点击价格':
              attr = 'clickPrice'
              break
            case '总转化数':
              attr = 'translation'
              break
            case '转化成本':
              attr = 'translationCost'
              break
          }
          for (let key in this.dailyData) {
            if (Object.keys(this.dailyData[key]).length === 0) {
              continue
            }
            let record = {}
            record.province = key
            let total = 0
            let total1 = 0
            let total2 = 0
            for (let n = 1; n <= this.lastDay; n++) {
              let day = this.search.condition.year * 10000 + this.search.condition.month * 100 + n
              let num
              if (this.dailyData[key][day] === undefined) {
                num = 0
              } else {
                if (attr === 'clickRatio') {
                  total1 += parseFloat(this.dailyData[key][day]['click'])
                  total2 += parseFloat(this.dailyData[key][day]['impression'])
                  num = this.dailyData[key][day][attr].toFixed(2) + '%'
                } else if (attr === 'clickPrice') {
                  total1 += parseFloat(this.dailyData[key][day]['costCoin'])
                  total2 += parseFloat(this.dailyData[key][day]['click'])
                  num = this.dailyData[key][day][attr].toFixed(2)
                } else if (attr === 'translationCost') {
                  total1 += parseFloat(this.dailyData[key][day]['costCoin'])
                  total2 += parseFloat(this.dailyData[key][day]['translation'])
                  num = this.dailyData[key][day][attr].toFixed(2)
                } else {
                  num = this.dailyData[key][day][attr]
                }
              }
              total += parseFloat(num)
              record[n] = num
            }
            if (attr === 'clickRatio') {
              record['total'] = total2 === 0 ? 0 : (total1 * 100 / total2).toFixed(2) + '%'
            } else if (attr === 'clickPrice' || attr === 'translationCost') {
              record['total'] = total2 === 0 ? 0 : (total1 / total2).toFixed(2)
            } else if (attr === 'costCoin') {
              record['total'] = total.toFixed(2)
            } else {
              record['total'] = total
            }
            data.push(record)
          }
        }
        return data
      }
    },
    methods: {
      requestList () {
        this.loading = true
        Api.listDaily({search: this.search.condition}, response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.dailyData = body.map.data || {}
            this.lastDay = body.map.lastDay || 0
          } else {
            this.dailyData = {}
            this.$message.error(body.error || '获取数据失败')
          }
          this.loading = false
        })
      },
      updateConditions (conditions) {
        const date = conditions.date.split('-')
        this.search.condition = Object.assign({}, conditions, {year: date[0], month: date[1]})
        this.requestList()
      },
      getSummaries (param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计'
            return
          }

          const values = data.map(item => Number(item[column.property]))
          if (this.search.list[1].value === '总展现次数' || this.search.list[1].value === '总消费点数' ||
            this.search.list[1].value === '总点击次数' || this.search.list[1].value === '总转化数') {
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr)
                if (!isNaN(value)) {
                  return prev + curr
                } else {
                  return prev
                }
              }, 0)
              if (this.search.list[1].value === '总消费点数') {
                sums[index] = sums[index].toFixed(2)
              }
            } else {
              sums[index] = '-'
            }
          } else {
            sums[index] = '-'
          }
        })
        return sums
      }
    }
  }
</script>

<style lang="scss">

</style>
