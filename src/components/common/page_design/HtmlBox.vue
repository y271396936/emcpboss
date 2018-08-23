<template>
  <div
    :class="[
      'ms-html-box',
      hover && !isEditing ? 'hover' : '',
      deleteHover ? 'delete-hover' : '',
      active && isEditing ? 'editing' : '',
      active ? 'active' : ''
    ]"
    @mouseover="hover = true"
    @mouseout="hover = false">
    <!-- 单图片组建 -->
    <div v-if="genre === 'IMAGE'" class="image">
      <template v-if="active">
        <el-upload
          accept="image/jpeg,image/jpg,image/png"
          :action="url.imageUpload"
          :data="{fileType: 'image'}"
          :show-file-list="false"
          :drag="true"
          :on-success="handleImageSuccess">
          <img v-if="newData.image.response.url" :src="newData.image.response.url">
          <template v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <p>将图片拖到此处，或<em>点击上传</em></p>
              <div slot="tip" class="el-upload__tip">
                <ol>
                  <li>只能上传 jpg/png 文件，不能超过 3M</li>
                  <li>超长图片上传后，系统部署时，会自动裁切成高 300~600px 的小图</li>
                  <li>图片中不要含其他组件和功能按钮</li>
                </ol>
              </div>
            </div>
          </template>
        </el-upload>
        <div v-show="editing" class="option">
          <el-button size="small" type="success" @click="finish()">完成</el-button>
        </div>
      </template>
      <template v-else>
        <img v-if="content.length > 0" :src="content"/>
        <p v-else class="no-content">插入图片</p>
      </template>
    </div>
    <!-- 快捷按钮 -->
    <div v-else-if="genre === 'QUICK_BUTTON'" class="quick-button">
      <template v-if="active">
        <div class="prev-option">
          按钮类型：<el-select v-model="newData.quick_button.id" @change="quickButtonChange">
            <el-option
              v-for="(item, index) in quickButtons" :key="index"
              :label="item.title"
              :value="item.id"/>
          </el-select>
        </div>
        <el-upload
          accept="image/jpeg,image/jpg,image/png,image/gif"
          :disabled="!newData.quick_button.id || newData.quick_button.id <= 0"
          :action="url.imageUpload"
          :data="{fileType: 'image'}"
          :show-file-list="false"
          :drag="true"
          :on-success="handleQuickButtonSuccess">
          <img v-if="newData.quick_button.thumbUrl" :src="newData.quick_button.thumbUrl">
          <template v-else>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <p v-if="!newData.quick_button.id || newData.quick_button.id <= 0"><em>请先选择按钮类型</em></p>
              <p v-else>将图片拖到此处，或<em>点击上传</em></p>
              <div slot="tip" class="el-upload__tip">
                <ol>
                  <li>请先选择按钮类型</li>
                  <li>如果需要替换默认的按钮样式，请上传新的样式图片</li>
                  <li>上传的图片支持 jpg/png/gif 文件，不能超过 500k，支持动态图</li>
                </ol>
              </div>
            </div>
          </template>
        </el-upload>
        <div v-show="editing" class="option">
          <el-button size="small" type="success" @click="finish()">完成</el-button>
        </div>
      </template>
      <template v-else>
        <img v-if="newData.quick_button.thumbUrl.length > 0" :src="newData.quick_button.thumbUrl"/>
        <p v-else class="no-content">选择按钮类型</p>
      </template>
    </div>
    <!-- 轮播图 -->
    <div v-else-if="genre === 'CAROUSEL'" class="carousel">
      <!-- 在激活且编辑状态下，显示图片墙 -->
      <template v-if="active && editing">
        <el-upload
          accept="image/jpeg,image/jpg,image/png"
          list-type="picture-card"
          :action="url.imageUpload"
          :data="{fileType: 'image'}"
          :on-preview="handleCarouselPreview"
          :on-remove="handleCarouselRemove"
          :on-success="handleCarouselSuccess"
          :file-list="carousels">
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">
            <ol>
              <li>只能上传 jpg/png 文件，且不超过500kb</li>
            </ol>
          </div>
        </el-upload>
        <div class="option">
          <el-button size="small" type="success" @click="finish()">完成</el-button>
        </div>
      </template>
      <template v-else-if="content.length > 0">
        <el-carousel>
          <el-carousel-item v-for="(item, index) in content" :key="index">
            <img :src="item"/>
          </el-carousel-item>
        </el-carousel>
      </template>
      <p v-else class="no-content">插入轮播图</p>
    </div>
    <!-- 留言板 -->
    <div v-else-if="genre === 'FEEDBACK'" class="feedback">
      <template v-if="active && editing">
        <div class="feedback-form-box">
          <div class="feedback-form">
            <el-select v-model="newData.feedback.style" placeholder="请选择留言板样式" @change="feedbackStyleChange">
              <el-option-group v-for="group in feedbackStyle" :key="group.label" :label="group.label">
                <el-option
                  v-for="item in group.list" :key="item.value"
                  :label="item.title"
                  :value="item.value"
                  :disabled="item.status === 0"/>
              </el-option-group>
            </el-select>
          </div>
          <img class="feedback-thumb" :src="newData.feedback.styleThumb"/>
        </div>
        <div class="option">
          <el-button size="small" type="success" @click="finish()">完成</el-button>
        </div>
      </template>
      <template v-else-if="newData.feedback.style > 0">
        <img class="feedback-preview" :src="newData.feedback.styleThumb"/>
      </template>
      <p v-else class="no-content">选择留言板样式</p>
    </div>

    <div v-show="hover && !isEditing && !deleteHover" class="mask" @click="edit()">
      <el-button size="small" type="info">编辑</el-button>
    </div>

    <div
      v-show="hover"
      class="delete"
      @click="trash()"
      @mouseover="deleteHover = true"
      @mouseout="deleteHover = false">
      <icon name="trash" scale="1.5"/>
    </div>

    <el-dialog :visible.sync="dialog.preview.visible">
      <img width="100%" :src="dialog.preview.url"/>
    </el-dialog>

  </div>
</template>

<script>
  import { FEEDBACK_STYLE } from '@/models/platform/item-solution'

  const imageUploadUrl = '/rest/support/editor/page-design/files'

  const QUICK_BUTTONS = [
    {
      id: 1,
      title: '加盟资料下载',
      thumbUrl: '/static/images/platform/page-design/download-join-articles.gif'
    }
  ]

  class PreviewDialog {
    constructor () {
      this.visible = false
      this.url = null
    }
  }

  class DataStorage {
    constructor () {
      this.image = {}
      this.quick_button = {
        id: '',
        image: '',
        thumbUrl: '',
        file: null
      }
      this.carousel = []
      this.feedback = {
        style: '',
        styleClientId: 0,
        styleThumb: ''
      }
    }
  }

  export default {
    name: 'ms-html-box',
    props: {
      genre: {
        type: String,
        default: 'IMAGE'
      },
      content: {
        required: true,
        type: [String, Number, Array, Object]
      },
      active: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        hover: false,
        editing: false,
        deleteHover: false,
        dialog: {
          preview: new PreviewDialog()
        },
        newData: new DataStorage()
      }
    },
    created () {
      this.newData = new DataStorage()
      switch (this.genre) {
        case 'IMAGE':
          this.newData.image = {
            response: {
              url: this.content
            }
          }
          break
        case 'QUICK_BUTTON':
          if (typeof this.content === 'object' && this.content.hasOwnProperty('id')) {
            const index = this.quickButtons.findIndex(item => item.id === this.content.id)
            if (index >= 0) {
              this.newData.quick_button = {
                id: this.content.id,
                image: this.content.image,
                thumbUrl: this.quickButtons[index]['thumbUrl']
              }
            }
          }
          break
        case 'CAROUSEL':
          const list = []
          if (Array.isArray(this.content)) {
            this.content.forEach(item => list.push({
              response: {
                url: item
              }
            }))
          }
          this.newData.carousel = list
          break
        case 'FEEDBACK':
          if (this.content && typeof this.content === 'object' &&
            this.content.hasOwnProperty('id') && this.content.id > 0) {
            this.newData.feedback.style = this.content.id
            this.newData.feedback.styleClientId = this.content.clientId || 0
            this.feedbackStyleChange(this.newData.feedback.style)
          }
          break
        default:
          throw Error('no set `' + this.genre + '`')
      }
    },
    computed: {
      url () {
        return {
          imageUpload: imageUploadUrl
        }
      },
      isEditing () {
        return this.active && this.editing
      },
      carousels () {
        const list = []
        if (Array.isArray(this.content)) {
          this.content.forEach(item => {
            list.push({url: item})
          })
        }

        return list
      },
      feedbackStyle () {
        const list = [
          {label: 'PC 页面', list: []},
          {label: '手机页面', list: []}
        ]
        FEEDBACK_STYLE.forEach(item => {
          if (item.clientId === 1) {
            list[0].list.push(item)
          } else if (item.clientId === 2) {
            list[1].list.push(item)
          }
        })
        return list
      },
      quickButtons () {
        return QUICK_BUTTONS
      // },
      // quickButtonThumbUrl () {
      //   console.log('quickButtonThumbUrl', this.newData)
      //   // 如果上传替换图片，则显示新上传的图片
      //   if (this.newData.quick_button.file !== null) {
      //     return this.newData.quick_button.file.url
      //   } else {
      //     // 否则，显示默认图片
      //     const index = this.quickButtons.findIndex(item => item.id === this.newData.quick_button.id)
      //     return index >= 0 ? this.quickButtons[index]['thumbUrl'] || '' : ''
      //   }
      }
    },
    methods: {
      edit () {
        this.hover = false
        this.editing = true

        this.$emit('active')
      },
      finish () {
        this.editing = false

        let content = ''
        switch (this.genre) {
          case 'IMAGE':
            content = this.newData.image.response.url
            break
          case 'QUICK_BUTTON':
            content = {
              id: this.newData.quick_button.id,
              image: this.newData.quick_button.file ? this.newData.quick_button.file['response']['url'] || '' : ''
            }
            break
          case 'CAROUSEL':
            content = []
            this.newData.carousel.forEach(item => content.push(item.response.url))
            break
          case 'FEEDBACK':
            content = {
              id: this.newData.feedback.style,
              clientId: this.newData.feedback.styleClientId
            }
            break
          default:
            throw Error('no set `' + this.genre + '`')
        }

        const response = {genre: this.genre, content: content}
        this.$emit('finish', response)
      },
      trash () {
        this.$emit('remove')
      },
      handleImageSuccess (response, file) {
        this.newData.image = file
      },
      handleQuickButtonSuccess (response, file) {
        this.newData.quick_button.file = file
        this.newData.quick_button.thumbUrl = file.url
      },
      quickButtonChange (id) {
        const index = this.quickButtons.findIndex(item => item.id === id)
        if (index >= 0) {
          this.newData.quick_button.thumbUrl = this.quickButtons[index]['thumbUrl']
        }
      },
      handleCarouselRemove (file, fileList) {
        this.newData.carousel = fileList
      },
      handleCarouselPreview (file) {
        const preview = new PreviewDialog()
        preview.visible = true
        preview.url = file.url || null

        this.dialog.preview = preview
      },
      handleCarouselSuccess (response, file, fileList) {
        this.newData.carousel = fileList
      },
      feedbackStyleChange (feedbackStyle) {
        const styleIndex = FEEDBACK_STYLE.findIndex(d => d.value === feedbackStyle)
        const style = FEEDBACK_STYLE[styleIndex]
        this.newData.feedback.style = style ? feedbackStyle : ''
        this.newData.feedback.styleClientId = style ? style.clientId || 0 : 0
        this.newData.feedback.styleThumb = style ? style.thumb || '' : ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  $base-z-index: 100;

  .ms-html-box {
    position: relative;
    padding: 8px;
    border: 3px $color-white solid;
    box-sizing: border-box;
    /*background: $color-light;*/

    &.hover {
      border-color: $color-white-tint;
    }
    &.editing, &.active {
      border-color: $color-success;
    }
    &.delete-hover {
      border-color: $color-danger;
    }

    .option {
      text-align: center;
    }

    p.no-content {
      border: 1px $color-white-tint dashed;
      border-radius: 5px;
      padding: 5px;
      margin: 0;
      text-align: center;
      /*color: $color-white-tint;*/
    }

    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      background: rgba(255, 255, 255, 0.5);
      top: 0;
      left: 0;
      border-radius: 4px;
      text-align: center;
      z-index: $base-z-index;

      button {
        position: absolute;
        top: calc(50% - 16px);
        z-index: $base-z-index + 1;
      }
    }

    .delete {
      color: $color-gray;
      cursor: pointer;
      position: absolute;
      top: 2px;
      right: 10px;
      z-index: $base-z-index + 1;
      &:hover {
        color: $color-danger;
      }
    }

    .prev-option {
      margin-bottom: 8px;
    }

    .image, .carousel {
    }

    .feedback {
      overflow: hidden;
      text-align: center;

      &-form-box {
        overflow: hidden;
      }
      &-form {
        float: left;
        text-align: left;
      }
      &-thumb {
        float: right;
        width: 200px;
        height: 200px;
        border: 1px solid $color-white-tint;
        background: $color-primary-tint;
      }
      &-preview {
        height: 200px;
      }
    }
  }
</style>

<style lang="scss">
  @import "../../../assets/styles/env";

  .ms-html-box {
    .image, .quick-button {
      .el-upload {
        width: 100%;
        min-height: 180px;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        &:hover {
          border-color: #409EFF;
        }
      }
      .el-upload-dragger {
        width: 100%;
        height: auto;
        min-height: 180px;
        &:hover {
          border-color: $color-success;
        }
      }
      .el-icon-upload {
        font-size: 68px;
        color: #c0c4cc;
        margin: 30px 0 16px;
        line-height: 50px;
      }
      .el-upload__tip {
        text-align: left;
      }
      img {
        width: 100%;
        height: 178px;
        display: block;
      }
      em {
        font-style: normal;
        color: $color-primary-active;
      }
    }
  }
</style>
