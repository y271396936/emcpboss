<template>
  <el-row v-cloak>
    <el-col :span="24" class="weather-wrap">
      <!--背景图-->
      <template v-if="changeType === ''">
        <!--如果没有hover，则用原来的-->
        <!--v-if="new RegExp(types.type).test(currentDate.type)"-->
        <div class="blur-wrap"
             v-if="currentDate.type === types.type"
             v-for="types in backgroundType">
          <img class="blur" :src="types.url" alt="">
        </div>
      </template>
      <template v-else>
        <!--否则，用hover的-->
        <!--v-if="new RegExp(types.type).test(changeType)"-->
        <div class="blur-wrap" v-for="types in backgroundType"
             v-if="changeType === types.type">
          <img class="blur" :src="types.url" alt="">
        </div>
      </template>
      <!--左边的时间-->
      <div class="left">
        <div class="left-top">
          <span>{{currentDate.type}}</span>
        </div>
        <div class="left-bottom">
          <div>
            <strong>{{currentTem}}<span>C</span></strong>
          </div>
          <div class="current-time">
            <!--<div class="top">-->
              <!--当前时间：{{currentTime.hours}}:{{currentTime.minutes}}-->
              <!--<span class="seconds">{{currentTime.seconds}}</span>-->
            <!--</div>-->
            <div>当前城市：{{currentCity}}</div>
          </div>
        </div>
      </div>
      <!--右边的天气-->
      <div class="right">
        <div class="current">
          <div class="top-box">{{currentDate.date}}</div>
          <div>农历{{lunarCalendar}}</div>
          <weather-icon :item="currentDate.type"></weather-icon>
          <div class="record-box">
            <div>{{currentDate.low}}</div>
            <div>{{currentDate.high}}</div>
            <div>风力{{currentDate.fl}}</div>
            <div v-if="currentDate.aqi > 0 && currentDate.aqi <= 50" class="grade excellent">优</div>
            <div v-if="currentDate.aqi > 50 && currentDate.aqi <= 100" class="grade good">良</div>
            <div v-if="currentDate.aqi > 100 && currentDate.aqi <= 150" class="grade light">轻度</div>
            <div v-if="currentDate.aqi > 150 && currentDate.aqi <= 200" class="grade moderate">中度</div>
            <div v-if="currentDate.aqi > 200 && currentDate.aqi <= 300" class="grade severe">重度</div>
          </div>
        </div>
        <!-- 未来天气：-->
        <div class="future" v-for="item in foreDate" @mouseover="changeBackground(item.type)" @mouseout="restBackground">
          <div class="top-box">
            <div>{{item.date}}</div>
          </div>
          <weather-icon :item="item.type"></weather-icon>
          <div class="record-box">
            <div>{{item.low}}</div>
            <div>{{item.high}}</div>
            <div>{{item.type}}</div>
            <div>风力{{item.fl}}</div>
            <div v-if="item.aqi > 0 && item.aqi <= 50" class="grade excellent">优</div>
            <div v-if="item.aqi > 50 && item.aqi <= 100" class="grade good">良</div>
            <div v-if="item.aqi > 100 && item.aqi <= 150" class="grade light">轻度</div>
            <div v-if="item.aqi > 150 && item.aqi <= 200" class="grade moderate">中度</div>
            <div v-if="item.aqi > 200 && item.aqi <= 300" class="grade severe">重度</div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
  import Api from '@/api/customer/weather-calendar'  // api请求数据
  import showlunarcalendar from './lunar-calendar'  // 农历计算
  import BACKGROUNDS from './weather-condition'  // 背景和天气图标
  import WeatherIcon from './WeatherIcon'  // 天气图标组件
  export default {
    components: {
      WeatherIcon
    },
    created () {
      /* 获取天气背景图片类型 */
      this.backgroundType = BACKGROUNDS
      /* 获取农历 */
      this.lunarCalendar = showlunarcalendar()
      Api.list(response => {
        let body = response.data.map.weather
        /* 当前城市 */
        this.currentCity = body.city
        /* 今日温度 */
        this.currentTem = body.data.wendu
        /* 未来天气情况 */
        let data = body.data.forecast
        data.forEach((item, index) => {
          if (index === 0) {
            this.currentDate = item
          } else {
            this.foreDate.push(item)
          }
        })
      })
    },
    data () {
      return {
        currentTem: {}, // 当前温度
        currentCity: {},  // 当前城市
        currentDate: {},  // 当前天气数据
        timeDate: new Date(), // 当前时间
        lunarCalendar: '',  // 农历
        backgroundType: [],  // 天气背景图
        changeType: '',  // 鼠标over时，改变的天气背景类型
        foreDate: []  // 未来天气数据
      }
    },
    computed: {
      currentTime () {
        /* 获取当前时间对象 */
//        setInterval(() => {
//          this.timeDate = new Date()
//        }, 1000)
        /* 定义一个时间容器 */
        let date = {}
        if (this.timeDate.getHours() < 10) {
          date.hours = '0' + this.timeDate.getHours()
        } else {
          date.hours = this.timeDate.getHours()
        }
        if (this.timeDate.getMinutes() < 10) {
          date.minutes = '0' + this.timeDate.getMinutes()
        } else {
          date.minutes = this.timeDate.getMinutes()
        }
        if (this.timeDate.getSeconds() < 10) {
          date.seconds = '0' + this.timeDate.getSeconds()
        } else {
          date.seconds = this.timeDate.getSeconds()
        }
        return date
      }
    },
    methods: {
      changeBackground (item) {
        if (item === '晴') {
          this.changeType = '晴'
        }
        if (item === '多云' || item === '阴') {
          this.changeType = '多云'
        }
        if (item === '雷阵雨' || item === '阵雨') {
          this.changeType = '雷阵雨'
        }
        if (item === '中雨' || item === '小雨') {
          this.changeType = '中雨'
        }
        if (item === '大雨') {
          this.changeType = '大雨'
        }
        if (item === '大到暴雨') {
          this.changeType = '大到暴雨'
        }
      },
      restBackground () {
        this.changeType = ''
      }
    }
  }
</script>

<style scoped lang="scss">
  [v-cloak] {
    display: none !important;
  }
  .blur-wrap{
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    .blur {
      -webkit-filter: blur(117px); /* Chrome, Opera */
      -moz-filter: blur(117px);
      -ms-filter: blur(117px);
      filter: blur(117px);
      filter: progid:DXImageTransform.Microsoft.Blur(PixelRadius=10, MakeShadow=false); /* IE6~IE9 */
      width: 100%;
    }
  }
  .weather-wrap{
    height:235px;
    overflow: hidden;
    background: #9c9898;
    display: flex;
    justify-content: space-between;
    >div{
      color: white;
      font-size:14px;
      line-height: 21px;
    }
    .left{
      min-width:19%;
      margin-left:6%;
      display: flex;
      z-index: 10;
      .left-top{
        text-align: left;
        margin-top:84px;
        span{
          font-size: 25px;
          padding-right:10px;
        }
      }
      .left-bottom{
        font-size: 21px;
        text-align: left;
        margin-top: 71px;
        strong{
          font-size: 67px;
          span{
            padding-left:10px;
            position: relative;
            &:after{
              content: 'o';
              position: absolute;
              font-size: 22px;
              left:1px;
              top:2px;
            }
          }
        }
        .current-time {
          margin-top: 30px;
        }
        .top{
          margin-bottom:10px;
          .seconds{
            font-size:12px;
            opacity:0.8;
            padding-left:1px;
          }
        }
      }
    }
    .right{
      min-width:19%;
      margin-right:1%;
      text-align: right;
      display: flex;
      z-index: 10;
      text-align: center;
      .top-box{
        /*margin-top:8px;*/
      }
      .record-box{
        >div{
          /*padding:1px 0;*/
        }
        .grade{
          background-color: #6ec76e;
          margin-top:3px;
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          border-radius: 10px;
        }
        .excellent{
          background-color: #6ec76e;
        }
        .good{
          background-color: #b2c76e;
        }
        .light{
          background-color: #fe8800;
        }
        .moderate{
          background-color: #fe0000;
        }
        .severe{
          background-color: #62001e;
        }
      }
      .current{
        padding:0 20px;
        margin-top:9px;
        /*min-width: 35%;*/
        .grade{
          width: 62%;
          margin: 0 auto;
          margin-top: 6px;
          padding:1px;
        }
        img{
          width:60px;
        }
        strong{
          font-size: 40px;
        }
      }
      .future{
        height:91%;
        min-width: 12%;
        border-left:1px solid white;
        padding:0 15px;
        margin-top:10px;
        &:hover{
          cursor: pointer;
          background-color: rgba(232, 232, 224, 0.09);
        }
        img{
          width:50px;
        }
        .grade{
          width: 73%;
          margin: 0 auto;
          margin-top: 5px;
        }
      }
    }
  }
</style>
