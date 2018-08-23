<template>
  <textarea
    :id="id"
    class="ms-editor"
    :value="currentValue"
    :rows="rows"
    :cols="cols"></textarea>
</template>

<script>
  import KindEditor from 'KindEditor'

  const imageUpload = {
    enabled: true,
    url: '/rest/support/editor/kind/files',
    category: 'editor'
  }

  export default {
    name: 'ms-editor',
    props: {
      value: {
        required: true,
        type: String
      },
      width: {
        type: [Number, String],
        default: '80%'
      },
      height: {
        type: [Number, String],
        default: '300px'
      },
      type: {
        type: String,
        default: 'kind'
      },
      toolBar: [String, Array],
      rows: {
        type: Number,
        default: 8
      },
      cols: {
        type: Number,
        default: 80
      },
      upload: {
        type: Object,
        default () {
          return imageUpload
        }
      },
      uploadCategory: String,
      textId: {
        required: true,
        type: String
      }
    },
    data () {
      return {
        currentValue: this.value || '',
        id: this.textId || 'textId'
      }
    },
    mounted () {
      KindEditor.lang({
        'seo-section': '插入文章分割符'
      })
      KindEditor.plugin('seo-section', function (K) {
        let editor = this
        let name = 'seo-section'
        // 点击图标时执行
        editor.clickToolbar(name, function () {
          editor.insertHtml('<p>#QUDAO-SECTION#</p>')
        })
      })
      const upload = Object.assign({}, imageUpload, this.upload)
      if (this.uploadCategory !== undefined && this.uploadCategory.length > 0) {
        upload.category = this.uploadCategory
      }

      const width = typeof this.width === 'string' ? this.width : this.width + 'px'
      const height = typeof this.height === 'string' ? this.height : this.height + 'px'
      const editorType = this.type === 'kind' ? 'kind' : 'ck'
      const toolTypes = {
        kind: {
          simple: ['source', '|', 'forecolor', 'bold', 'italic', 'underline', '|', 'image', 'seo-section']
        }
      }
      if (editorType === 'kind') {
        let kindConfig = {
          width: width,
          height: height,
          resizeType: 1,
          allowPreviewEmoticons: false,
          // items: this.tool,
          uploadJson: upload.url,
          allowImageUpload: upload.enabled,
          // allowFlashUpload: false,
          // allowMediaUpload: false,
          // allowFileUpload: false,
          // allowFileManager: false,
          extraFileUploadParams: {
            // 上传子目录
            category: upload.category
          },
          afterBlur: () => {
            this.blur()
          }
        }
        if (Array.isArray(this.toolBar)) {
          kindConfig.items = this.toolBar
        } else if (typeof this.toolBar === 'string' && toolTypes.hasOwnProperty(editorType) &&
          toolTypes[editorType].hasOwnProperty(this.toolBar)) {
          kindConfig.items = toolTypes[editorType][this.toolBar]
        }
        this.id = KindEditor.create('textarea#' + this.id, kindConfig)
      }
    },
    methods: {
      uploadValue () {
        this.editorContent = this.id.html()
        // 将变化传递给父组件
        this.$emit('input', this.editorContent)
      },
      blur () {
        this.uploadValue()
      }
    }
  }
</script>
<style lang="scss" scoped>
</style>
