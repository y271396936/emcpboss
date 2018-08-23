<template>
  <div class="detail">
    <div class="back" @click="closeDetail()"><icon name="angle-left" scale="2" class="icon-bg"></icon></div>
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
  import moment from 'moment'
  export default{
    props: {
      detail: {
        type: Object,
        required: true
      },
      chartData: {
        type: Object,
        required: true
      },
      ageData: {
        type: Array,
        required: true
      },
      provinceData: {
        type: Array,
        required: true
      }
    },
    data () {
      return {
        showDetail: false,
        chartSettings: {    // 饼图的配置：大小和标签
          radius: 140,
          offsetY: 230
        }
      }
    },
    methods: {
      formatTime (value) {
        return moment(value, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD')
      },
      closeDetail () {
        this.showDetail = false
        this.$emit('closeDetail')
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
