<template>
  <div class="chat">
    <ul class="chat-user">
      <li
        v-for="(target, index) in recombineTargets" :key="index"
        :class="[chat.targetId === target.id && chat.targetGenre === target.genre ? 'active' : '']"
        @click="chooseTarget(index)">{{target.name}}</li>
    </ul>
    <div class="chat-conversation">
      <ul>
        <li
          v-for="(chatItem, index) in currentChats" :key="index"
          :class="chatItem.className">
          <template v-if="chat.targetGenre === 'system' || chatItem.className !== 'system'">
            <div class="chat-avatar" v-show="avatarVisible">
              <img :src="chat.avatar">
            </div>
            <div class="chat-text">
              <div class="chat-text-wrap">
                <i>{{chatItem.publishTimeView}}</i>
                <p>{{chatItem.message}}</p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="chat-text-wrap">{{chatItem.message}}</div>
          </template>
        </li>
      </ul>
      <div v-if="chat.replyEnabled" class="chat-send">
        <el-input v-model="chat.message" class="chat-send-input" size="small" placeholder="请输入内容"/>
        <el-button
          size="small"
          type="primary"
          :disabled="chat.replyEnabled && chat.message.length <= 0"
          @click.native.prevent="send()">发送</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  const SYSTEM_TARGET = {
    id: 0,
    genre: 'system',
    name: '系统消息',
    avatar: '/static/images/chat-user-thumb.png',
    replyEnabled: false,
    unread: 1,
    input: '',
    history: [
      {
        level: 1,
        needReceipt: false,
        publishTile: '',
        message: '这是一个系统通知'
      }
    ]
  }

  export default {
    name: 'ms-chat',
    data () {
      return {
        avatarVisible: true,
        chat: {
          targetId: 1,
          targetGenre: 'user',
          unread: 0,
          avatar: '/static/images/chat-user-thumb.png',
          replyEnabled: true,
          message: ''
        },
        targets: [
          {
            id: 1,
            genre: 'user',
            name: '某伊某',
            avatar: '/static/images/chat-user-thumb.png',
            replyEnabled: true,
            unread: 0,
            input: '',
            history: [
              {
                fromId: 1,
                fromGenre: 'user',
                publishTime: '2017-12-12 10:12:12',
                message: '(｡･∀･)ﾉﾞ嗨，彩蛋，给~~'
              },
              {
                fromId: 0,
                fromGenre: 'system',
                publishTime: '2017-12-12 10:12:12',
                message: '这是一条系统提示'
              },
              {
                fromId: 0,
                fromGenre: 'system',
                publishTime: '2017-12-12 10:12:12',
                message: '这是一条系统错误提示'
              },
              {
                targetId: 1,
                targetGenre: 'user',
                publishTime: '2017-12-12 11:24:29',
                message: 'emmm....不要在意这些细节!这个彩蛋并没有什么鬼用。'
              },
              {
                targetId: 1,
                targetGenre: 'user',
                publishTime: '2017-12-12 11:25:32',
                message: 'HI,惊喜么?刺激么?聚齐七个彩蛋就可以召唤神龙唷，少年郎（严肃脸'
              }
            ]
          },
          {
            id: 2,
            genre: 'user',
            name: '某尔某',
            avatar: '/static/images/chat-user-thumb.png',
            replyEnabled: true,
            unread: 0,
            input: '',
            history: []
          },
          {
            id: 3,
            genre: 'user',
            name: '某山某',
            avatar: '/static/images/chat-user-thumb.png',
            replyEnabled: true,
            unread: 1,
            input: '',
            history: []
          }
        ]
      }
    },
    created () {
      // 默认显示系统消息
      this.chooseTarget(0)

      // todo 获取当日的通知和消息记录

      // 获得用户信息
      const userInfo = this.$store.state.user.info || {}

      // web socket
      this.$stompClient.connect({}, frame => {
        // 订阅系统通知
        this.$stompClient.subscribe('/system/notifications', message => {
          const msg = JSON.parse(message.body || '{}')

          this.$store.dispatch('receiveSystemNotice')
          this.$notify.info({
            title: '系统消息',
            message: msg.message || '暂无消息内容'
          })
        })

        // 订阅用户通知
        this.$stompClient.subscribe(`/user/b${userInfo.id}/notifications`, message => {
          const msg = JSON.parse(message.body || '{}')
          this.$store.dispatch('receiveSystemNotice')
          this.$notify.info({
            title: '系统消息',
            message: msg.message || '暂无消息内容'
          })
        })

        // 订阅用户消息
        this.$stompClient.subscribe(`/user/b${userInfo.id}/chat`, message => {
          // const msg = JSON.parse(message.body || '{}')
          this.$store.dispatch('receiveUserMessage')
        })

        // todo 订阅客户消息
      })
    },
    computed: {
      recombineTargets () {
        this.targets.unshift(SYSTEM_TARGET)

        return this.targets
      },
      currentChats () {
        const index = this.targets.findIndex(d => d.id === this.chat.targetId && d.genre === this.chat.targetGenre)
        return this.targets[index].history.map(item => {
          item.publishTimeView = moment(item.publishTime).format('HH:mm:ss')

          let className = 'target'
          if (this.chat.targetGenre !== 'system') {
            if (item.fromId === 0) {
              className = 'system'
            } else if (item.targetId === this.chat.targetId) {
              className = 'myself'
            }
          }
          item.className = className

          return item
        })
      }
    },
    methods: {
      chooseTarget (index) {
        const target = this.recombineTargets[index]

        this.chat.targetId = target.id
        this.chat.targetGenre = target.genre
        this.chat.unread = target.unread
        this.chat.avatar = target.avatar
        this.chat.replyEnabled = target.replyEnabled
        this.chat.message = target.input
      },
      send () {
        // todo
        const destination = '/app/example.other'
        const userInfo = this.$store.state.user.info || {}
        const message = {targetGenre: 'boss', targetId: userInfo.id, message: this.chat.input}
        this.$stompClient.send(destination, {}, JSON.stringify(message))
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  $width-right-aside: 320px;

  ul, li, dl, dd, dt {
    @extend %no-crack;
    list-style: none;
  }

  .chat {
    height: 100%;
    font-size: 12px;
    &-user {
      width: 58px;
      height: 100%;
      float: left;
      color: $color-white-tint;
      background-color: $color-secondary;
      padding: 4px;
      font-size: $size-small;
      text-align: center;
      li {
        height: 28px;
        line-height: 28px;
        margin: 5px 0;
        border-radius: 5px;
        cursor: pointer;
        &:hover {
          background-color: rgba(199, 231, 247, 0.42);
        }
        &:active {
          background-color: $color-primary-tint;
        }
      }
      li.active {
        background-color: rgba(199, 231, 247, 0.42);
      }
    }
    &-conversation {
      width: $width-right-aside - 58px - 20px;
      height: 100%;
      padding: 5px;
      overflow: hidden;
      float: left;
      display: flex;
      flex: 1 1 auto;
      flex-flow: column nowrap;
      align-items: center;
      ul {
        width: 100%;
        flex-grow: 1;
        li {
          overflow: hidden;
          margin-bottom: 8px;
          .chat-avatar {
            width: 40px;
            display: inline-block;
            text-align: center;
            float: left;
          }
          .chat-text {
            display: inline-block;
            float: left;
            margin-left: 6px;
            width: 70%;
            &-wrap {
              padding: 5px;
              background: $color-white-tint;
              border-radius: 3px;
              position: relative;
              display: inline-block;
              i {
                color: $color-gray;
                display: block;
                font-style: normal;
                font-weight: bold;
                position: relative;
                font-size: 12px;
              }
              p {
                margin: 0;
                padding-top: 3px;
              }
            }
          }
        }
        li.myself {
          .chat-avatar {
            float: right;
          }
          .chat-text {
            margin-right: 6px;
            float: right;
            &-wrap i {
              text-align: right;
            }
          }
        }
        li.target {
          .chat-text-wrap {
            background: $color-primary-tint;
          }
        }
        li.system {
          text-align: center;
        }
        li.error {
          color: $color-caution;
        }
      }
      .chat-send {
        padding-bottom: 8px;
        &-input {
          width: 75%;
          input {
            padding: 0 5px;
          }
        }
      }
    }
  }

</style>
