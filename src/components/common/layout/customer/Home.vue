<template>
  <div class="wrap">
    <!--<div class="wrap-top">-->
      <!--<div class="left">-->
        <!--<img src="../../../../assets/cus-info.png" alt="">-->
        <!--<span>渠道无忧最新发布XXXX</span>-->
      <!--</div>-->
      <!--<div class="right">-->
        <!--<icon></icon>-->
        <!--<button>签到领取优币</button>-->
      <!--</div>-->
    <!--</div>-->
    <weather-calendar></weather-calendar>
    <div class="content-box">
      <div class="headlines">
        <div class="headlinesRight">
          <div class="headlinesCenter">
            <el-tabs type="border-card">
              <el-tab-pane label="行业资讯">
                <div class="mind">
                  <div class="mainDeta">
                    <router-link class="deta" v-for="(item, index) in table.list"
                                 :to="{path:'/industry', query:{index:index, type:item.type}}"
                                 :key="index" tag="div">
                      <div class="deta-mind" v-if="item.type === 3">
                        <div class="imgs" :style="{backgroundImage: 'url(' + item.picture + ')'}">{{ item.picture ? '' : '暂无略缩图' }}</div>
                      </div>
                      <div class="deta-scroll">
                        <div class="deta-header">
                          <div class="mindTitle">{{ item.title }}</div>
                          <div class="time-author">
                            <div class="author">作者:{{ item.publishUserName }}</div>
                            <div class="time">{{ formatArticleTime(item.publishTime) }}</div>
                          </div>
                        </div>
                        <div v-if="item.type === 3" class="text" v-html="filter(item.content)"></div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="企业动态">
                <div class="mind">
                  <div ref="deta" class="mainDeta">
                    <router-link class="deta" v-for="(item, index) in mind"
                                 :to="{path:'/entreprise', query:{index:index}}"
                                 :key="index" tag="div">
                      <div class="deta-scroll">
                        <div class="deta-header">
                          <div class="mindTitle">{{ item.title }}</div>
                          <div class="time-author">
                            <div class="author">作者:{{ item.publisher }}</div>
                            <div class="time">{{ formatArticleTime(item.publishTime) }}</div>
                          </div>
                        </div>
                        <div class="text" v-html="filter(item.content)"></div>
                      </div>
                    </router-link>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
        <div class="headlinesLeft">
          <div class="headlineInformation">
            <div class="hot-h3">
              <h3 class="title-for-h4">头条资讯</h3>
              <h3 class="title-for-h4 time-hot">实时热点</h3>
            </div>
            <div class="newsMain">
              <div class="mainConter">
                <div class="newsCenter" v-for="item in newsName">
                  <div class="data_row">
                    <a :href="item.docurl" target="_blank" class="na_pic">
                      <img :src="item.imgurl" :alt="item.title" width="140" height="88" onerror="imgError(this)">
                    </a>
                  </div>
                  <div class="na_detail clearfix">
                    <div class="news_title">
                      <h3><a target="_blank" :href="item.docurl">{{item.title}}</a></h3>
                    </div>
                    <div class="news_tag">
                      <div class="keywords">
                        <a class="barlink" href="https://news.163.com/" target="_blank">新闻</a>
                        <a style="margin-left: 10px" target="_blank" v-for="link in item.keywords" :href="link.akey_link">{{link.keyname}}</a>
                      </div>

                      <span class="time">{{formatTime(item.time)}}</span>
                    </div>
                  </div>
                </div>
              </div>
                <div class="hotNews">
                  <div class="newsWrap">
                      <ul class="newsTitle">
                        <li v-for="item in titleName">
                          <a :href="item.links" target="_blank">{{item.title}}</a>
                        </li>
                      </ul>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div class="operations">
        <div class="videos">
          <h4 class="title-for-h4">开屏魔方操作指引</h4>
          <div class="screen">
            <div class="videoWrap">
              <video id="myVideo" class="video-js" controls width="100%" height="100%">
                <source src="http://emcp.qudao51.com/video/guide.mp4" type='video/mp4'/>
                <a href="http://emcp.qudao51.com/video/guide.mp4"
                  style="display:block;width:100%;height:100%;"
                  id="player">
                </a>
              </video>
            </div>
          </div>
        </div>
        <div class="about">
          <h4 class="title-for-h4">预约服务</h4>
          <ul style="width:100%;height:90%;padding:0 20px 10px 20px;box-sizing: border-box">
            <li class="aboutCenter" v-for="(item, index) in msg">
              <div class="icon-box">
                <input class="choose" type="checkbox" v-model="item.flag"/>
                <span class="chooseCenter">{{ item.title }}</span>
              </div>
              <div class="stars">
                <icon :name="icons" scale="1"/>
              </div>
            </li>
            <li class="aboutTime">
              <el-input class="aboutInput" type="textarea" placeholder="请留言" v-model="message"/>
              <div style="color:white">
                <button class="aboutBtn" @click="submitRow()">提交</button>
              </div>
            </li>
          </ul>
        </div>
        <div class="store"><h3 style="color:#ffc100">敬请期待</h3></div>
        <div class="myService">
          <icon name="user" scale="5"></icon>
          <div class="myTitle">我的客服</div>
          <ul class="myUl">
            <li v-for="item in contactNumber">
              <div>
                <span>姓名 :</span>
                <span style="margin-left: 10px">{{item.name}}</span>
              </div>
              <div>
                <span>手机 :</span>
                <span style="margin-left: 10px">{{item.mobile}}</span>
              </div>
              <div v-if="item.wechat === ''|| undefined"></div>
              <div v-else>
                <span>微信 :</span>
                <span style="margin-left: 10px">{{item.wechat}}</span>
              </div>
              <div v-if="item.qq === ''|| undefined"></div>
              <div v-else>
                <span>Q Q :</span>
                <span style="margin-left: 10px">{{item.qq}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="footer-wrap">
        <span>2016 - {{year}} </span>
        <a href="http://www.qudao51.com/" target="_blank">渠道无忧</a>
        <span>© Copyright 粤ICP备13036846号-8</span>
      </div>
    </div>
  </div>
</template>
<script>
  import MsEditor from '@/components/common/Editor.vue'
  import Api from '@/api/platform/home'
  import MsSlide from '@/components/common/Slide.vue'
  import MsConfirmButton from '@/components/common/ConfirmButton.vue'
  import moment from 'moment'
  import WeatherCalendar from '@/components/weather_component/WeatherCalendar'
  import { FormArgument } from '@/models/platform/customer-home'

  export default {
    components: {
      WeatherCalendar,
      MsConfirmButton,
      MsSlide,
      MsEditor
    },
    created () {
      this.getNews()
      this.getCenter()
      this.hotNews()
      this.getMind()
      this.getContact()
    },
    data () {
      return {
        msg: [
          {
            title: '培训服务',
            flag: false,
            value: 1
          },
          {
            title: '品牌策划',
            flag: false,
            value: 2
          },
          {
            title: '全网营销',
            flag: false,
            value: 3
          },
          {
            title: '提供建议',
            flag: false,
            value: 4
          }
        ],
        year: moment().format('Y'),
        icons: 'star',
        icon: 'user-o',
        contactNumber: [],
        titleName: {},
        newsName: {},
        industry: {},
        category: [],
        mind: [],
        makeService: {},
        message: '',
        form: new FormArgument(),
        table: {
          loading: true,
          list: [],
          pagination: {}
        },
        row: {
          fileList: [],
          edit: {
            enabled: false,
            index: 0
          }
        }
      }
    },
    methods: {
      submitRow () {
        let flag = []
        let type = []
        this.msg.forEach(item => {
          flag.push(item.flag)
          if (item.flag) {
            type.push(item.value)
          }
        })
        if (flag.indexOf(true) !== -1) {
          if (this.message !== '') {
            this.form.type = type
            this.commitFeedback()
          } else if (!flag[3]) {
            this.form.type = type
            this.commitFeedback()
          } else {
            this.$message.error('请输入留言')
          }
        } else {
          this.$message.error('请选择服务')
        }
      },
      commitFeedback () {
        this.form.content = this.message
        Api.makeService({form: this.form}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.$message.success(body.success || '提交成功')
            this.message = ''
            this.msg[0].flag = false
            this.msg[1].flag = false
            this.msg[2].flag = false
            this.msg[3].flag = false
          } else {
            this.$message.error('提交失败')
          }
        })
      },
      formatTime (value) {
        return moment(value, 'MM-DD-YYYY hh:mm:ss').format('MM-DD hh:mm')
      },
      formatArticleTime (value) {
        return moment(value, 'YYYY-MM-DD hh:mm:ss').format('MM-DD hh:mm')
      },
      filter (str) {
        return str.replace(/<[^>]*>?/g, '')
      },
      getNews () {
        Api.list(response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.newsName = JSON.parse(body.map['yaoWen'])
          } else {
            this.$message.error(body.error || '数据获取失败')
          }
        })
      },
      hotNews () {
        Api.newsList(response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.titleName = body.map['hotNews']
          } else {
            this.$message.error(body.error || '数据获取失败')
          }
        })
      },
      getCenter () {
        Api.marketing(response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.table.list = body
          } else {
            this.table.list = []
          }
        })
      },
      getMind () {
        Api.mind(response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.mind = body
          } else {
            this.mind = []
            this.$message.error(body.error || '数据获取失败')
          }
        })
      },
      getContact () {
        Api.contactNumber(response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.contactNumber = body
          } else {
            this.$message.error(body.error || '数据获取失败')
          }
        })
      }
    }
  }
</script>
<style>
  .el-tabs--border-card {
    box-shadow: none !important;
  }
  .el-tabs--border-card>.el-tabs__content {
    padding:0 !important;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active {
    color: #ffffff !important;
    background-color: #fa8564 !important;
  }
  .el-tabs__item {
    font-size: 17px;
    font-weight: 600;
  }
</style>
<style scoped="scoped" lang="scss">
  .video-flesh {
    font-size: 37px;
    text-align: center;
    background: black;
    height: 282px;
    color: white;
    line-height: 282px;
    letter-spacing: 14px;
  }
  .title-for-h4 {
    width: 100%;
    border-bottom: 1px solid #e7e7e7;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    font-size: 17px;
    font-weight: 600;
    padding: 7px 0 7px 20px;
    color: #909399;
    margin: 0;
    background: #f5f7fa;
  }
  .time-hot{
    padding-left: 25%;
    box-sizing: border-box;
  }
  .wrap{
    box-sizing: border-box;
    background: #f1f1f1;
    &-top {
      display: flex;
      justify-content: space-between;
      background: white;
      margin-bottom: 10px;
      padding-right: 15px;
      height: 56px;
      overflow: hidden;
      .left {
        img, span{
          vertical-align: middle;
        }
        span {
          padding-left: 10px;
        }
        img {
          padding: 10px 15px;
          border-right: 1px solid #cccccc;
        }
      }
      .right {
        line-height: 58px;
        color: white;
        button {
          background: #f86b4f;
          vertical-align: middle;
          border: 0;
          color: white;
          padding: 9px 12px;
        }
      }
    }
  }
  .content-box {
    padding:0 10px;
  }
  #details{
    width:100%;
    height:100%;
    border:none;
    background: white;
    border-radius: 10px;
  }
  .headlines{
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .headlinesLeft{
    width:52.5%;
    height:390px;
    background: white;
    padding:10px;
    box-sizing: border-box;
  }
  .hot-h3 {
    display: flex;
    justify-content: space-around;
  }
  .headlineInformation{
    width:99.5%;
    height:367px;
    border: 1px solid #e7e7e7;
    overflow: hidden;
  }
  .newsWrap {
    height:328px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .newsWrap::-webkit-scrollbar {
    width: 8px;
    height: 4px;
  }
  .newsWrap::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .newsWrap::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .newsMain{
    display: flex;
    flex-direction: row;
  }
  .mainConter{
    width:67%;
    height:328px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .mainConter::-webkit-scrollbar {
    width: 8px;
    height: 4px;
  }
  .mainConter::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .mainConter::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .newsCenter{
    width:100%;
    height:110px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    flex-direction: row;
    padding: 10px;
    box-sizing: border-box;
    font-size: 14px;
  }
  .newsCenter:hover{
    background: #f1f1f1;
  }
  .na_detail{
    margin-left: 13px;
  }
  .na_detail a{
    color: #696464;
  }
  .na_detail .news_title h3{
     width:100%;
     margin-top: 10px;
    a {
      width:97%;
      display: block;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
   }
  .na_detail .news_title h3 a:hover{
    color:red;
  }
  .news_tag{
    display: flex;
    flex-direction: row;
    margin-top: 25px;
  }
  .barlink{
    color:#2e9ad0;
    font-weight: bold;
  }
  .barlink:hover{
    color:red;
  }
  .keywords {
    /*margin-left: 20px;*/
  }
  .keywords>a:hover{
    color:red;
  }
  .time{
    /*width:150px;*/
    height:20px;
    line-height: 20px;
    padding-left: 20px;
    margin-left: 30px;
    /*border-left: 1px solid #000;*/
    color:#9f9f9f;
    padding-top: 2px;
    position: relative;
    &:before {
      content: '';
      width: 1px;
      height: 13px;
      background: #e2e2e2;
      position: absolute;
      left: 0;
      top: 58%;
      transform: translateY(-50%);
    }
  }
  .hotNews{
    width:33%;
    height:328px;
    overflow: hidden;
    h4 {
      margin: 20px 0 10px 22px;
      font-size: 16px;
      color: #696464;
    }
  }
  .hotNews::-webkit-scrollbar {
    width: 8px;
    height: 4px;
  }
  .hotNews::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .hotNews::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .newsTitle{
    width:85%;
    list-style: none;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: 0;
    margin: 10px auto;
    font-size: 14px;
  }
  .newsTitle li{
    width:100%;
    height:38px;
  }
  .hotNews>.newsWrap>.newsTitle>li>a{
    display: block;
    font-size: 13px;
    color: #353333;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .hotNews>.newsWrap>.newsTitle>li>a:hover{
    color: red;
  }
  .headlinesRight{
    width:47%;
    height:390px;
    background: white;
    padding: 10px;
    box-sizing: border-box;
    margin-right: 10px;
  }
  .headlinesCenter{
    width:100%;
    height:367px;
  }
  .mind{
    width:100%;
    height:353px;
    overflow: hidden;
    margin-top: -25px;
  }
  .mainDeta{
    height:326px;
    margin-top: 25px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .mainDeta::-webkit-scrollbar {
    width: 8px;
    height: 4px;
  }
  .mainDeta::-webkit-scrollbar-thumb {
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .mainDeta::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
  .deta {
    display: flex;
    padding: 14px 16px;
    box-sizing: border-box;
    flex-direction: row;
    border-bottom: 1px solid #e7e7e7;
    cursor: pointer;
    &:hover {
      background: #f3f3f3;
    }
    &-mind {
      margin-right:10px;
    }
    .deta-scroll {
      .deta-header {
        .time-author {
          width: 148px;
        }
      }
    }
  }
  .imgs {
    height: 75px;
    width: 105px;
    text-align: center;
    line-height: 75px;
    color: #c0c4cc;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
    border: 1px solid #efebeb;
    background-image: url(https://y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000);
    background-size: 100% 100%;
  }
  .deta-scroll {
    width:100%;
    /*height:80px;*/
    box-sizing: border-box;
    .deta-header {
      display: flex;
      justify-content: space-between;
      margin-top:6px;
      .mindTitle{
        width:60%;
        height: 30px;
        font-weight: bold;
        font-size: 16px;
        color: #696464;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .time-author {
        width:25%;
        display: flex;
        font-size:13px;
        .author {
          width: 50%;
        }
        .time {
          width:auto;
           padding-left: 0px;
           margin-left: 0px;
          &:before {
            content: '';
            width: 0;
          }
        }
      }
    }
    .text {
      overflow : hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      height: 47px;
      color: #5a5a59;
      font-size: 15px;
    }
  }
  .mindText{
    float: right;
    margin: 20px 0 0 50px
  }
  .mindText:hover{
    cursor: pointer;
  }
  .operations{
    width:100%;
    min-height:390px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  .videos{
    width:510px;
    height:380px;
    background: white;
    margin-right: 10px;
    .screen {
      padding-left: 24px;
      box-sizing: border-box;
      padding-top: 10px;
      margin-top:20px;
    }
  }
  .videoWrap{
    width:460px;
    height:320px;
    border-radius: 10px;
    background: #666;
    padding: 20px;
    box-sizing: border-box;
    margin-top: -20px;
  }
  #myVideo{
    width:420px;
    height: 280px;
  }
  .about{
    width:500px;
    height:380px;
    background: white;
    margin-right: 10px;
  }
  .aboutCenter{
    display: flex;
    justify-content: space-between;
    width:100%;
    height:50px;
    line-height: 50px;
    margin-top: 10px;
    background: #f1f1f1;
    padding: 0 20px;
    box-sizing: border-box;
    border-radius: 10px;
    cursor: pointer;
    .icon-box {
      display: flex;
      .choose{
        display: inline-block;
        border-radius: 6px;
        margin-top: 12px;
        margin-right: 30px;
        vertical-align: middle;
      }
      .chooseCenter {
        vertical-align: middle;
        color: #656262;
      }
    }
    &:hover{
      background: #1fbba6;
    }
    &:hover .choose{
      border-color: white;
    }
    .stars{
      color:#777;
    }
    &:hover .chooseCenter, &:hover .stars {
      color: white;
    }
  }
  .aboutTime{
    display: flex;
    justify-content: space-between;
    width:100%;
    height:50px;
    margin-top: 10px;
  }
  .aboutInput{
    width:275px;
    border-radius: 5px;
    text-indent: 10px;
    outline: none;
    min-height: 40px;
    line-height: 1.2em;
  }
  .aboutBtn{
    width:175px;
    height:50px;
    outline: none;
    border:none;
    background: #1fbba6;
    color:white;
    border-radius: 5px;
  }
  .aboutBtn:hover{
    cursor: pointer;
  }
  .store{
    width:330px;
    height:380px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border: 2px solid #ffc100;
    background: rgba(88, 69, 23, .4);
    text-align: center;
    line-height: 350px;
    margin-right: 10px;
  }
  .myService{
    width:19%;
    height:380px;
    background: #fa8564;
    color: #741a00;
    padding-top: 100px;
    box-sizing: border-box;
    /*border: 2px solid #ffc100;*/
    overflow: hidden;
    text-align: center;
  }
  .myTitle{
    width: 100%;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .myUl{
    width: 100%;
    list-style: none;
    font-size: 16px;
    text-align: center;
    padding: 0;
  }
  .footer{
    .footer-wrap {
      padding-top:10px;
    }
    width:100%;
    text-align: center;
    line-height: 26px;
    background: white;
    font-weight: 500;
    color: #8a8787;
    font-size: 14px;
    letter-spacing: 1px;
    a {
      display: inline;
      color: #666666;
    }
  }
</style>
<style type="text/css" scoped>
  input[type=checkbox] {
    position: relative;
    width: 10px;
    height: 1px;
  }
  input[type=checkbox]::before{
    content:'';
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    line-height:20px;
    text-align: center;
    color:white;
    font-size:16px;
    background-color:#fff;
    border-radius: 6px;
    border: 2px solid #1fbba6;
  }
  input[type=checkbox]:checked::before {
    color:white;
    background-color:#1fbba6;
    content: '✔';
  }
  .aboutCenter:hover input[type=checkbox]::before{
    border: 2px solid #fff;
  }
</style>
