<template>
  <div class="mindDetail">
    <div class="back" @click="$router.back()"><icon name="angle-left" scale="2" class="icon-bg"></icon></div>
    <div class="detail-scroll">
      <div class="text" :style="{marginTop: 0}">
        <div class="title">{{ mindDetail.title }}</div>
        <div class="time-author">
          <div class="time">{{ formatTime(mindDetail.publishTime) }}</div>
          作者:
          <div class="author">{{ mindDetail.publisher }}</div>
        </div>
        <div class="content" v-html="mindDetail.content"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import Api from '@/api/platform/home'
  import moment from 'moment'
  export default{
    created () {
      this.getMind()
    },
    data () {
      return {
        mindDetail: {
          content: '',
          title: '',
          publishTime: '',
          publisher: ''
        }
      }
    },
    methods: {
      getMind () {
        Api.mind(response => {
          let status = response.status || 0
          let body = response.data || {}
          if (status === 200 || status === 204) {
            this.mind = body
            this.getDetail(this.$route.query.index)
          } else {
            this.mind = []
            this.$message.error(body.error || '数据获取失败')
          }
        })
      },
      getDetail (index) {
        this.mindDetail.content = this.mind[index].content
        this.mindDetail.title = this.mind[index].title
        this.mindDetail.publishTime = this.mind[index].publishTime
        this.mindDetail.publisher = this.mind[index].publisher
        this.isShow = false
      },
      formatTime (value) {
        return moment(value, 'YYYY-MM-DD hh:mm:ss').format('YYYY-MM-DD')
      }
    }
  }
</script>
<style scoped>
  .mindDetail {
    display: flex;
    word-wrap: break-word;
    word-break: break-all;
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
    max-width: 80%;
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
</style>
