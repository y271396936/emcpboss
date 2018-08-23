<template>
  <div>
    <textarea v-model="content" id="editor" rows="10" cols="80"></textarea>
    <p>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </p>
  </div>
</template>

<script>
  import KindEditor from 'KindEditor'

  export default {
    data () {
      return {
        content: `<h1>Hello world!</h1>
      <p>I'm an instance of <a href="http://kindeditor.net/demo.php">kindEditor</a>.</p>`
      }
    },
    mounted () {
      this.editor = KindEditor.create('textarea#editor', {
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
    },
    methods: {
      submit () {
        console.log('origin: ', this.content)
        // 无法通过 v-model 获取对应值，只能通过下面的方式获取最后的值
        console.log('final: ', this.editor.html())
      }
    }
  }
</script>

<style scoped>

</style>
