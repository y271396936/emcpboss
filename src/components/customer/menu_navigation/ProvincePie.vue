<template>
  <div>
    <ms-search :data="search.list" @click="updateConditions"></ms-search>
    <div>
      <h1 class="province-title">搜索引擎</h1>
      <!--饼图整个部分-->
      <div v-for="(value, key) in recombineData" :key="key" class="pie-wrap">
        <h1 v-if='key === "clickMap"' class="pie-title">{{listTitle}}项目精准流量来源</h1>
        <h1 v-if='key === "translationMap"' class="pie-title">{{listTitle}}项目精准信息来源</h1>
        <ve-pie :data="value" :extend="extend1" :settings="chartSettings" :loading="chartLoading" :data-empty="value.empty"></ve-pie>
        <!--查看 总流量 和 TOP 5-->
        <div class="info">
          <div class="info-left">
            <el-tag v-if='key === "clickMap"'>总流量：{{TotalClickMap}}</el-tag>
            <el-tag v-if='key === "translationMap"'>总信息数：{{TotalTranslationMap}}</el-tag>
          </div>
          <div class="info-right">
            <el-dropdown trigger="click">
              <el-button type="primary" size="small">
                查看 TOP 5<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <!--展开显示 TOP 5 的数据-->
              <el-dropdown-menu slot="dropdown">
                <template v-if='key === "clickMap"'>
                  <!--词性流量-->
                  <el-table
                    v-if="!showMore.click"
                    :data="Top5ClickMap"
                    border
                    height="300"
                    :default-sort = "{prop: 'name', order: 'descending'}"
                    style="width: 100%;">
                    <el-table-column
                      prop="date"
                      label="省份"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      sortable
                      label="精准流量"
                      width="180">
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-else
                    :data="value.rows"
                    height='500'
                    border
                    :default-sort = "{prop: 'number', order: 'descending'}"
                    style="width: 100%;">
                    <el-table-column
                      prop="speech"
                      label="省份"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="number"
                      sortable
                      label="精准流量"
                      width="180">
                    </el-table-column>
                  </el-table>
                  <div class="table-more">
                    <el-button v-if="!showMore.click" type="primary" round size="small" @click="showMore.click=!showMore.click">查看更多</el-button>
                    <el-button v-else type="primary" round size="small" @click="showMore.click=!showMore.click">查看 Top 5</el-button>
                  </div>
                </template>
                <template v-if='key === "translationMap"'>
                  <!--词性展现-->
                  <el-table
                    v-if="!showMore.tranlate"
                    :data="Top5TranslationMap"
                    border
                    height="300">
                    <el-table-column
                      prop="date"
                      label="省份"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      sortable
                      label="精准信息"
                      width="180">
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-else
                    :data="value.rows"
                    height='500'
                    border>
                    <el-table-column
                      prop="speech"
                      label="省份"
                      width="180">
                    </el-table-column>
                    <el-table-column
                      prop="number"
                      sortable
                      label="精准流量"
                      width="180">
                    </el-table-column>
                  </el-table>
                  <div class="table-more">
                    <el-button v-if="!showMore.tranlate" type="primary" round size="small" @click="showMore.tranlate=!showMore.tranlate">查看更多</el-button>
                    <el-button v-else type="primary" round size="small" @click="showMore.tranlate=!showMore.tranlate">查看 Top 5</el-button>
                  </div>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import MsSearch from '@/components/customer/Search.vue'
  import Api from '@/api/customer/region-pie'
  import { PROVINCE_CONDITION } from '@/models/customer/region-pie'
  import 'v-charts/lib/style.css'

  export default {
    components: {
      MsSearch
    },
    created () {
      this.chartLoading = true
      this.search.list = PROVINCE_CONDITION
      // 将每个搜索内容的配置信息的value值置为空
      this.search.list.forEach(item => {
        item.value = ''
        if (item.title === '项目') {
          item.config.list = []
        }
      })
      Api.itemTitle(response => {
        let itemTitle = response.data || []
        let title = []
        itemTitle.forEach(value => {
          title.push({value: value.title, label: value.title})
        })
        this.search.list[2].config.list = title
        this.search.list[2].value = this.search.list[2].config.list[0].value
      })
      let date = []
      date[0] = moment().subtract(6, 'days').format('YYYY-MM-DD')
      date[1] = moment().subtract(0, 'days').format('YYYY-MM-DD')
      this.search.condition.startTime = date[0]
      this.search.condition.endTime = date[1]
      this.search.list[0].value = date
      /* 设置搜索条件初始化
      this.search.condition.top = 10
      this.search.list[1].value = '前10'
      */

      this.chartData = {}
      this.requestList()
    },
    data () {
      return {
        extend1: {
          series: {
            label: {
              show: true,
              formatter: '{b}: {d}' + '%'
            }
          }
        },
        showMore: {
          click: false,
          tranlate: false
        },
        Top5ClickMap: [],
        Top5TranslationMap: [],
        TotalClickMap: 0,
        TotalTranslationMap: 0,
        chartSettings: {
          radius: 150,
          legendLimit: 7
        },
        industry: '',
        search: {
          list: [],
          condition: {}
        },
        chartData: {},
        title: '',
        chartLoading: true,
        type: {
          impression: '流量来源',
          click: '信息来源'
        },
        checkedTypes: ['流量来源', '信息来源'],
        show: {
          '流量来源': true,
          '信息来源': true
        }
      }
    },
    computed: {
      listTitle () {
        return this.search.list[2].value
      },
      recombineData () {
        let data = {}
        for (let key in this.chartData) {
          // 下面所有if语句都是过滤并封装数据，continue过滤不需要的数据
          if (key === 'industry') {
            this.industry = this.chartData[key]
            continue
          }
          if (key === 'title') {
//            this.search.list[2].config.list = []
            // 获取项目名称，并传值给项目搜索的配置
//            this.chartData[key].forEach(item => {
//              this.search.list[2].config.list.push({value: item, label: item})
//            })
            continue
          }
          if (key === 'Top5ClickMap') {
            // 封装Top5ClickMap 数据格式
            this.Top5ClickMap = this.topData(this.Top5ClickMap, this.chartData[key])
            continue
          }
          if (key === 'Top5TranslationMap') {
            // 封装Top5TranslationMap 数据格式
            this.Top5TranslationMap = this.topData(this.Top5TranslationMap, this.chartData[key])
            continue
          }
          data[key] = {}
          if (Object.keys(this.chartData[key]).length > 0) {
            // 封装饼图数据
            data[key].empty = false
            data[key] = this.pieData(data[key], this.chartData[key])
          } else {
            data[key].empty = true
            data[key].columns = ['speech', 'number']
            data[key].rows = []
            data[key].rows.push({'speech': '', 'number': 0})
          }
        }
        return data
      }
    },
    methods: {
      requestList () {
        this.chartLoading = true

        const search = Object.assign({}, this.search.condition)
        Api.list({search: search}, response => {
          let status = response.status || 0
          let data = response.data || {}
          if (status === 200 || status === 204) {
            this.chartData = data.map
            // 统计俩饼图各自总流量
            let clickMap = this.chartData.clickMap
            let translationMap = this.chartData.translationMap
            this.TotalClickMap = this.mapSum(this.TotalClickMap, clickMap)
            this.TotalTranslationMap = this.mapSum(this.TotalTranslationMap, translationMap)
          } else {
            this.$message.error(response.data.error || '数据获取失败')
          }
          this.chartLoading = false
        })
      },
      updateConditions (conditions) {
        let startTime = conditions.date[0]
        let endTime = conditions.date[1]
        this.search.condition = Object.assign({}, conditions, {startTime: startTime, endTime: endTime})
        this.requestList()
      },
      handleCheckedTypesChange (value) {
        for (let key in this.show) {
          this.show[key] = false
        }
        value.forEach(item => {
          this.show[item] = true
        })
      },
      mapSum (sum, object) {
        // 计算数据总量
        sum = 0
        for (let key in object) {
          sum += object[key]
        }
        return sum
      },
      topData (object, sources) {
        // 封装Top5数据
        object = []
        for (let key1 in sources) {
          let record = {}
          if (key1 === '其它') {
            record['date'] = '行业词(品牌竞品)'
          } else {
            record['date'] = key1
          }
          record['name'] = sources[key1]
          object.push(record)
        }
        return object
      },
      pieData (object, sources) {
        // 封装饼图数据
        object.columns = ['speech', 'number']
        object.rows = []
        for (let key1 in sources) {
          let record = {}
          record['speech'] = key1
          record['number'] = sources[key1]
          object.rows.push(record)
        }
        return object
      }
    }
  }
</script>

<style scoped lang="scss">
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
  .info {
    display: flex;
    justify-content: center;
    margin-bottom: 90px;
    .info-left {
      margin-right:100px;
    }
  }
  .table-more {
    width:100%;
    text-align: center;
    button {
      margin-top: 10px;
    }
  }
  .pie-wrap {
    float:left;
    width:49%;
    .pie-title {
      text-align: center;
      font-size: 23px;
      letter-spacing: 3px;
    }
  }
  .province-title {
    text-align: center;
    font-size: 23px;
    letter-spacing: 3px;
  }
</style>
