<template>
  <div class="ms-list">
    <el-row class="operation">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><icon name="home"></icon></el-breadcrumb-item>
        <el-breadcrumb-item>数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>53数据导入</el-breadcrumb-item>
        <el-breadcrumb-item>53KF数据导入</el-breadcrumb-item>
      </el-breadcrumb>
    </el-row>

    <el-form class="form" label-width="120px" size="small" :model="form">
      <el-form-item label="文件" prop="file" :rules="[{required: true,messae:'必填'}]">
        <input type="file" accept="file/html" id="file" name="file" @change="onFileChange"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submit()" :loading="submitLoading">提交</el-button>
      </el-form-item>
    </el-form>

    <ol>
      <li style="line-height: 30px">支持格式 <span class="ms-danger">HTML 文件</span>（.html）</li>
      <li style="line-height: 30px">请<span class="ms-danger">勿重复</span>导入，否则转化数据会翻倍，但不影响“要电话量”的统计。如果发生重复导入，请在<span
        class="ms-danger">
           “导入日志”</span>中执行<span class="ms-danger">回退</span>操作
      </li>
      <li style="line-height: 30px">该导入文件<span class="ms-danger">头部标题禁止更改,头部格式如下:</span></li>
      <ol class="code-light" style="line-height: 30px">
        <li class="ms-danger">空值,访客名称,接待客服,对话时间,对话条数,访问来源,来源页面,关键词,咨询页面,访客地区,ip地址,对话渠道,对话类型,对话主题,访客评价
          ,着陆页面,来源风格,访客标签,访客编号,首次响应时长,平均响应时长,开始方式,结束方式
        </li>
      </ol>
    </ol>
  </div>
</template>

<script>
  import Api from '@/api/platform/kf53-chat-record'
  import FormTokenApi from '@/api/system/form-token'

  export default {
    data () {
      return {
        form: {},
        submitLoading: false,
        loading: false
      }
    },
    created () {
      // 获得 form token
      FormTokenApi.create(response => {
        let status = response.status || 0
        let body = response.data || []
        if (status >= 200 && status <= 204) {
          this.form.token = body.token || ''
        }
      })
    },
    methods: {
      submit () {
        this.submitLoading = true
        this.loading = true
        // 获得 form token
        Api.import({form: this.form}, response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.submitLoading = false
            this.$message.success('上传成功')
          } else {
            this.submitLoading = false
            this.$message.error(body.error || '上传失败')
          }
          this.form = {}
          document.getElementById('file').value = ''
          // 再次获取 form token
          FormTokenApi.create(response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              this.form.token = body.token || ''
            }
          })
        })
      },
      onFileChange (e) {
        this.form.file = e.target.files[0]
      }
    }
  }
</script>
<style scoped>

</style>


