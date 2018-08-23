<template>
  <div class="ms-list" ref="msList">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">
          <icon style="color: #0088cc" name="home"></icon>
        </el-breadcrumb-item>
        <el-breadcrumb-item>品牌优化</el-breadcrumb-item>
        <el-breadcrumb-item>案例展示</el-breadcrumb-item>
        <el-breadcrumb-item>案例详情</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <div class="news">
      <!--<div class="scroll" ref="list" :style="listStyle">-->
      <el-scrollbar class="scroll" :style="listStyle">
        <div class="news-wrap" v-show="showList">
        <div class="list">
          <div class="item" v-for="(item, index) in list">
            <div class="img" :style="{backgroundImage: 'url(' + item.thumbnail + ')'}">{{ item.thumbnail ? '' : '暂无略缩图' }}</div>
            <!--<div class="img"></div>-->
            <div class="content">
              <div class="title">{{ item.title }}</div>
              <div class="time-author">
                <div class="time">{{ formatTime(item.publishTime) }}</div>
                作者:
                <div class="author">{{ item.publisher }}</div>
              </div>
              <div class="text" v-html="filter(item.content)"></div>
              <div class="see-detail" @click="seeDetail(index)">查看详情&nbsp;&nbsp;<icon name="angle-double-right" scale="1.2"></icon></div>
            </div>
          </div>
        </div>
          <el-button @click="loadMore()" :disabled="pagination.page >= pagination.totalPage" class="ms-btn">
            {{pagination.page >= pagination.totalPage ? '已无更多...' : '加载更多...'}}
          </el-button>
        </div>

        <ms-detail-show :detail="detail" @closeDetail="closeDetail" v-show="!showList"></ms-detail-show>

      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import Api from '@/api/platform/seo-case-show'
  import MsDetailShow from '@/components/common/DetailShow'
  import ResponseParse from '@/utils/response-parse'

  import moment from 'moment'

  export default {
    components: {
      MsDetailShow
    },
    created () {
      this.list = []
      this.requestList()
    },
    data () {
      return {
        scroll: null,
        detailScroll: null,
        timer: true,
        detail: {
          content: '',
          title: '',
          publishTime: '',
          publisher: ''
        },
        showList: true,
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,
        list: [],
        pagination: {}
      }
    },
    mounted () {
      const _this = this
      window.onresize = () => {
        return (() => {
//          window.screenWidth = document.body.clientWidth
//          _this.screenWidth = window.screenWidth
          _this.screenWidth = document.body.clientWidth
          _this.screenHeight = document.body.clientHeight
        })()
      }
    },
    computed: {
      listStyle () {
        return {
//          width: (this.screenWidth - 300) + 'px',
//          height: (this.screenHeight - 60) + 'px',
          backgroundColor: this.showList ? 'rgb(246, 250, 255)' : 'rgb(246, 250, 255)'
        }
      }
//      detailStyle () {
//        return {
//          width: '800px',
//          height: (this.screenHeight - 70) + 'px'
//        }
//      }
    },
    methods: {
      requestList () {
        let params = Object.assign({}, {page: this.pagination.page, pageSize: this.pagination.pageSize}, this.pagination)
        Api.list({search: params}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status === 200 || status === 204) {
            this.pagination = ResponseParse.pagination(response.headers)
            this.list = this.list.concat(body)
          } else {
          }
        })
      },
      loadMore () {
        this.pagination.page = this.pagination.page + 1
        this.requestList()
      },
      formatTime (value) {
        return moment(value, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD')
      },
      filter (str) {
//        str.replace(/(\w+)\s*, \s*(\w+)/, "$2 $1")
        return str.replace(/<[^>]*>?/g, '')
      },
      closeDetail () {
        this.showList = true
      },
      seeDetail (index) {
        this.detail.content = this.list[index].content
        this.detail.title = this.list[index].title
        this.detail.publishTime = this.list[index].publishTime
        this.detail.publisher = this.list[index].publisher
        this.showList = false
      },
      backDetail () {
        this.showList = true
      }
    },
    watch: {
      screenWidth (val) {
        if (!this.timer) {
          this.screenWidth = val
          this.timer = true
          setTimeout(() => {
            this.timer = false
          }, 400)
        }
      },
      screenHeight (val) {
        if (!this.timer) {
          this.screenHeight = val
          this.timer = true
          setTimeout(() => {
            this.timer = false
          }, 400)
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/styles/env";

  .ms-list {
    .news {
      .scroll {
        overflow: hidden;
        background-color: #CCCCCC;
        box-shadow: #c0c9db 0 0 5px;
        .news-wrap {
          padding-bottom: 30px;
        }
        .ms-btn {
          display: block;
          width: 100px;
          margin: 0 auto;
        }
        .list {
          display: flex;
          flex-wrap: wrap;
          padding: 30px 50px 0;
          justify-content: space-between;
          .item {
            margin-bottom: 40px;
            height: 200px;
            width: 47%;
            border-radius: 28px;
            box-shadow: #a4b7d8 0px 0px 2px;
            display: flex;
            align-items: center;
            .img {
              margin: 0 50px 0 20px;
              height: 160px;
              width: 255px;
              text-align: center;
              line-height: 160px;
              color: #c0c4cc;
              -webkit-border-radius: 10px;
              -moz-border-radius: 10px;
              border-radius: 10px;
              border: 1px solid #efebeb;
              background-image: url(https://y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000);
              background-size: 100% 100%;
            }
            .content {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              flex: 1;
              overflow: hidden;
              height: 160px;
              .title {
                font-size: 25px;
                color: #545454;
                padding: 2px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              .time-author {
                font-size: 15px;
                color: rgb(160, 160, 160);
                display: flex;
                .time {
                  margin-right: 10px;
                }
                .author {
                  margin-left: 10px;
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
              }
              .see-detail {
                color: #ff8686;
                display: flex;
                align-items: center;
                cursor:pointer;
              }
            }
          }
          .item:nth-child(1), .item:nth-child(2) {
            margin-top: 10px;
          }
          .item:nth-child(4n), .item:nth-child(4n+1) {
            background-color: rgb(251, 254, 255);
          }
          .item:nth-child(4n+2), .item:nth-child(4n+3) {
            background-color: rgb(251, 254, 255);
          }
          @media screen and (max-width: 1440px) {
            .item {
              width:93%;
            }
          }
          @media screen and (max-width: 1024px) {
            .item {
              width:696px;
            }
          }
          .item:hover {
            background-color: #fffff6;
          }
        }
        .detail {
          display: flex;
          word-wrap:break-word;
          word-break:break-all;
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
            .icon-bg {
              color: white;
            }
          }
          .detail-scroll {
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            .title {
              line-height: 50px;
              font-size: 32px;
              color: #565656;
            }
            .text {
              width: 1024px;
              padding: 25px 28px;
              .time-author {
                font-size: 15px;
                color: rgb(160, 160, 160);
                display: flex;
                .time {
                  margin-right: 10px;
                }
                .author {
                  margin-left: 10px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
