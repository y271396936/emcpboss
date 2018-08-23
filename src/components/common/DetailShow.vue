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
        <div class="content" v-html="detail.content"></div>
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
      }
    },
    data () {
      return {
        showDetail: false
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
<style scoped>
  .detail {
    display: flex;
    word-wrap: break-word;
    word-break: break-all;
    border:2px solid #c0c9db;
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
  }
  .icon-bg {
    color: white;
  }

  .detail-scroll {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    max-width: 80%;
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
