<template>
  <div class="ms-list">
    <div class="person editor-box">
      <span>对象人</span>
      <input v-if="editContents.id" v-model="editContents.atUserName" :disabled="true" style="width: 200px; height: 23px;" placeholder="请输入内容">
      <input v-else v-model="person" style="width: 200px; height: 23px;" placeholder="请输入内容">
    </div>
    <div v-for="item in contentList" class="editor-box">
      <span><i>*</i>{{item.title}}</span>
      <textarea v-if="item.name == 'work'" v-model="editContents.work" :id="item.id" rows="10" cols="80"></textarea>
      <textarea v-else-if="item.name == 'mindset'" v-model="editContents.mindset" :id="item.id" rows="10" cols="80"></textarea>
      <textarea v-else-if="item.name == 'proposal'" v-model="editContents.proposal" :id="item.id" rows="10" cols="80"></textarea>
      <textarea v-else v-model="item.text" :id="item.id" rows="10" cols="80"></textarea>
    </div>
    <div class="person editor-box">
      <span>
        <i>*</i>备注
      </span>
      <input v-if="editContents.id" v-model="editContents.remark" style="width: 200px; height: 23px;" placeholder="请输入内容">
      <input v-else v-model="remark" style="width: 200px; height: 23px;" placeholder="请输入内容">
    </div>
    <p>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </p>
  </div>
</template>

<script>
  import KindEditor from 'KindEditor'

  export default {
    props: {
      editContents: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data () {
      return {
        person: '',
        remark: '',
        contentList: [{
          title: '工作',
          text: '',
          id: 'editorOne',
          name: 'work'
        }, {
          title: '心态',
          text: '',
          id: 'editorTwo',
          name: 'mindset'
        }, {
          title: '建议',
          text: '',
          id: 'editorThree',
          name: 'proposal'
        }]
      }
    },
    computed: {
    },
    mounted () {
      for (let item in this.contentList) {
        this.contentList[item].id = KindEditor.create('textarea#' + this.contentList[item].id, {
          resizeType: 1,
          allowPreviewEmoticons: false,
          items: ['source', '|', 'forecolor', 'bold', 'italic', 'underline', '|', 'image'],
          uploadJson: '/rest/support/editor/kind/files',
          allowImageUpload: true,
          // allowFlashUpload: false,
          // allowMediaUpload: false,
          // allowFileUpload: false,
          // allowFileManager: false,
          extraFileUploadParams: {
            // 上传子目录
            category: 'test'
          }
        })
      }
    },
    methods: {
      submit () {
        if (!this.editContents.id) {
          if (this.person === '') {
            this.$message.error('请输入对象人')
          } else {
            this.editContents.atUserName = this.person
            for (let item in this.contentList) {
              this.index = item
              if (this.index === '0') {
                if (this.contentList[this.index].id.html() === '') {
                  this.$message.error('请输入' + this.contentList[this.index].title + '内容')
                  return
                } else {
                  this.editContents[this.contentList[this.index].name] = this.contentList[this.index].id.html()
                }
              } else {
                this.editContents[this.contentList[this.index].name] = this.contentList[this.index].id.html()
              }
            }
            this.editContents.remark = this.remark
            this.$emit('click', this.editContents)
          }
        } else {
          for (let item in this.contentList) {
            this.editContents[this.contentList[item].name] = this.contentList[item].id.html()
          }
          this.$emit('click', this.editContents)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ms-list {
    span {
      font-size: 12px;
      font-weight: bold;
    }
    .person {
      span {
        line-height: 28px;
      }
    }
    .editor-box {
      position: relative;
      margin: 0 0 15px 45px;
      span {
        position: absolute;
        left: -43px;
        i {
          padding-right: 5px;
          font-style: normal;
          font-weight: bolder;
          font-size: 14px;
          color: #f00;
        }
      }
    }
    p {
      button {
        width: 62px;
        height: 29px;
        margin: 0 0 0 15px;
        border-style: none;
        border-radius: 0;
      }
    }
  }
</style>
