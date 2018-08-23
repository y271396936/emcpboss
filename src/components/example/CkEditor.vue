<template>
  <div>
    <textarea v-model="content" id="editor"></textarea>
    <p>
      Visit the <a href="https://sdk.ckeditor.com/" target="_blank">CKEditor SDK</a>
      for a huge collection of samples showcasing editor features, with source code readily
      available to copy and use in your own implementation.
    </p>
    <p>
      <el-button type="primary" size="small" @click="submit">提交</el-button>
    </p>
  </div>
</template>

<script>
  import CKEDITOR from 'CKEDITOR'

  export default {
    data () {
      return {
        content: `<h1>Hello world!</h1>
      <p>I'm an instance of <a href="https://ckeditor.com">CKEditor</a>.</p>`
      }
    },
    mounted () {
      CKEDITOR.replace('editor', {
        // 图片上传路径，留空这不开启上传
        filebrowserUploadUrl: '/rest/support/editor/ck/files',
        height: '200px',
        width: '90%',
        toolbar: 'Full'
      })
      this.editor = CKEDITOR.instances['editor']
    },
    methods: {
      submit () {
        console.log('origin: ', this.content)
        console.log('final: ', this.editor.getData())
      }
    }
  }
</script>

<style scoped>

</style>
