<template>
  <div class="detail">
    <div class="back" @click="$router.back()"><icon name="angle-left" scale="2" class="icon-bg"></icon></div>
    <div class="detail-scroll" ref="detail">
      <div class="text" :style="{marginTop: 0}">
        <div class="title">{{ detail.title }}</div>
        <div class="time-author">
          <div class="time">{{ formatTime(detail.publishTime) }}</div>
          作者:
          <div class="author">{{ detail.publisher }}</div>
        </div>
        <!--文章 type=3-->
        <div v-if="detail.type === 3" v-html="detail.content"></div>
        <!--分析 type=2-->
        <div v-if="detail.type === 2">
          <!--省份 1-->
          <div class="wrap" v-if="detail.content.type === 1">
            <template v-for="item in provinceData">
              <div>
                <h5>{{item.title}}</h5>
                <ve-bar :data="item.data" :settings="chartSettings"></ve-bar>
              </div>
              <div>
                <h5>{{item.title}}表格</h5>
                <el-table
                  :data="item.data.rows"
                  height="400"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号">
                  </el-table-column>
                  <el-table-column
                    prop="省份"
                    label="省份">
                  </el-table-column>
                  <el-table-column
                    prop="点击量"
                    sortable
                    label="点击量">
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </div>
          <!--年龄 2-->
          <div class="wrap" v-if="detail.content.type === 2">
            <template v-for="item in ageData">
              <div>
                <h5>{{item.title}}分析</h5>
                <ve-pie :settings="chartSettings" :data="item.data"></ve-pie>
              </div>
              <div>
                <h5>{{item.title}}表格</h5>
                <el-table
                  :data="item.data.rows"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="序号">
                  </el-table-column>
                  <el-table-column
                    prop="年龄范围"
                    label="年龄范围">
                  </el-table-column>
                  <el-table-column
                    prop="点击量"
                    sortable
                    label="点击量">
                  </el-table-column>
                </el-table>
              </div>
            </template>
          </div>
          <!--词性 3-->
          <div class="wrap" v-if="detail.content.type === 3">
            <div>
              <h5>词性饼图分析</h5>
              <ve-pie :settings="chartSettings" :data="chartData"></ve-pie>
            </div>
            <div>
              <h5>词性表格数据</h5>
              <el-table
                :data="chartData.rows"
                height="400"
                style="width: 100%">
                <el-table-column
                  type="index"
                  label="序号">
                </el-table-column>
                <el-table-column
                  prop="词性"
                  label="词性">
                </el-table-column>
                <el-table-column
                  prop="点击量"
                  sortable
                  label="点击量">
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Api from '@/api/platform/home'
  import moment from 'moment'
  export default{
    created () {
      this.industry()
    },
    data () {
      return {
        detail: {},
        pieData: {},  // 词性饼图数据
        ageData: [],   // 年龄分析数据
        provinceData: [], // 省份分析数据
        table: {
          loading: true,
          list: [],
          pagination: {}
        },
        chartSettings: {    // 饼图的配置：大小和标签
          radius: 140,
          offsetY: 230
        }
      }
    },
    methods: {
      industry () {
        Api.marketing(response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.list = body
            let params = this.$route.query
            this.seeDetail(params.index, params.type)
          } else {
            this.table.list = []
          }
        })
      },
      seeDetail (index, type) {
        this.detail.type = type
        if (this.detail.type === 3) { /* 普通文章类类 */
          this.detail = Object.assign({type: type}, this.table.list[index])
        }
        if (this.detail.type === 2) { /* 分析类 */
          this.detail = Object.assign({type: type}, this.table.list[index])
          /* 获取指定图表数据 */
          let str = this.detail.content
          /* content转化成json对象 */
          let pie = JSON.parse(str)
          if (pie.type === 3) { // 封装词性饼图数据
            this.detail.content = {}
            this.detail.content = pie
            this.pieData = this.getPieData(this.pieData, pie.data)
          }
          if (pie.type === 2) { // 封装年龄数据
            this.detail.content = {}
            this.detail.content = pie
            let ageBai = {data: {columns: ['年龄范围', '点击量'], rows: []}, title: ''} // 百度信息流数据
            let ageHeader = {data: {columns: ['年龄范围', '点击量'], rows: []}, title: ''} // 今日头条信息流
            let ageUc = {data: {columns: ['年龄范围', '点击量'], rows: []}, title: ''} // UC信息流
            pie.data.forEach((value, index, arr) => {
              if (value.title === '百度信息流') {  // 封装百度信息流
                ageBai.title = '百度信息流'
                ageBai.data = this.getAgeData(ageBai.data, value.ageRange, value.click)
              }
              if (value.title === '今日头条信息流') {  // 封装今日头条信息流
                ageHeader.title = '今日头条信息流'
                ageHeader.data = this.getAgeData(ageHeader.data, value.ageRange, value.click)
              }
              if (value.title === 'UC信息流') {  // 封装UC信息流
                ageUc.title = 'UC信息流'
                ageUc.data = this.getAgeData(ageUc.data, value.ageRange, value.click)
              }
            })
            if (ageBai.data.rows.length > 0) {
              this.ageData.push(ageBai)
            }
            if (ageHeader.data.rows.length > 0) {
              this.ageData.push(ageHeader)
            }
            if (ageUc.data.rows.length > 0) {
              this.ageData.push(ageUc)
            }
          }
          if (pie.type === 1) { // 封装省份数据
            this.detail.content = {}
            this.detail.content = pie
            let provinceInfo = {data: {columns: ['省份', '点击量'], rows: []}, title: ''} // 搜索或竞价数据
            let provinceSearch = {data: {columns: ['省份', '点击量'], rows: []}, title: ''} // 信息流数据
            provinceInfo.title = '省份信息流分析'
            provinceInfo.data = this.getProvinceData(provinceInfo.data, pie.info)
            provinceSearch.title = '省份搜索引擎分析'
            provinceSearch.data = this.getProvinceData(provinceSearch.data, pie.search)
            if (provinceInfo.data.rows.length > 0) {
              this.provinceData.push(provinceInfo)
            }
            if (provinceSearch.data.rows.length > 0) {
              this.provinceData.push(provinceSearch)
            }
          }
        }
      },
      formatTime (value) {
        return moment(value, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD')
      },
      getProvinceData (object, sources) {
        // 封装饼图数据
        object.columns = ['省份', '点击量']
        object.rows = []
        for (let key1 in sources) {
          let record = {}
          record['省份'] = sources[key1].province
          record['点击量'] = sources[key1].click
          object.rows.push(record)
        }
        return object
      },
      getAgeData (object, ageRange, click) {
        // 封装年龄数据
        let record = {}
        record['年龄范围'] = ageRange
        record['点击量'] = click
        object.rows.push(record)
        return object
      },
      getPieData (object, sources) {
        // 封装饼图数据
        object.columns = ['词性', '点击量']
        object.rows = []
        for (let key1 in sources) {
          let record = {}
          if (sources[key1].keywordNatureTitle === '其它') {
            record['词性'] = '行业词(品牌竞品)'
          } else {
            record['词性'] = sources[key1].keywordNatureTitle
          }
          record['点击量'] = sources[key1].click
          object.rows.push(record)
        }
        return object
      }
    }
  }
</script>
<style>
  .el-table td {
    padding: 6px 0;
  }
  .el-table th {
    padding: 1px 0;
  }
</style>
<style scoped lang="scss">
  .detail {
    display: flex;
    word-wrap: break-word;
    word-break: break-all;
    border:1px solid #c0c9db;
  }
  .back {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 30px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #409eff;
    position: fixed;
    cursor: pointer;
  }
  .icon-bg {
    color: white;
  }

  .detail-scroll {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    min-width: 94%;
    margin-left: 100px;
  }
  .title {
    line-height: 50px;
    font-size: 32px;
    color: #565656;
  }
  .text {
    width: 100%;
    padding: 25px 84px;
    box-sizing: border-box;
    padding-left: 0;
  }
  .time-author {
    font-size: 15px;
    color: rgb(160, 160, 160);
    display: flex;
  }
  .time {
    margin-right: 10px;
  }
  .author {
    margin-left: 10px;
  }
  .wrap {
    min-width: 500px;
    margin: 0 auto;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    >div {
      width:48%;
      margin-bottom: 50px;
      border: 1px solid gainsboro;
      -webkit-border-radius: 10px;
      -moz-border-radius: 10px;
      border-radius: 10px;
      h5 {
        font-size: 20px;
        margin: 12px 0;
        margin-bottom: 0;
        font-weight: 500;
        padding-bottom: 13px;
        border-bottom: 1px solid gainsboro;
        text-align: center;
      }
    }
  }
</style>
