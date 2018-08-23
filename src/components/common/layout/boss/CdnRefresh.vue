<template>
  <div>
    <el-dialog class="cdn-refresh" width="45%" :visible="visible" @open="getFormToken" @close="close">
      <el-form :model="form" size="small" label-width="80px" ref="cdnRefreshForm">
        <el-form-item label="地址" prop="pageUrl" :rules="[
          {required: true, message: '必填'},
          {validator: validateUrl}
        ]">
          <el-input v-model="form.pageUrl" @blur="urlBlur"/>
        </el-form-item>
        <el-form-item label="刷新方式" prop="refreshGenre" :rules="[
          {required: true, message: '必选'},
          {validator: validateGenre}
        ]">
          <el-select v-model="form.refreshGenre" @change="genreChange">
            <el-option label="当前URL" :value="1"/>
            <el-option label="整个目录" :value="2"/>
          </el-select>
        </el-form-item>
      </el-form>
      <ol>
        <li>地址随便填，系统会自动修正。<span class="ms-info">发送给客户预览时，请使用以上自动修正后的地址！</span></li>
        <li>因 CDN 节点过多，大约在成功提交后五分钟内全部生效</li>
        <li>
          <strong>注意：</strong><code>http://www.xxx.com</code>和<code>http://www.xxx.com/</code>是两个不同的访问地址
        </li>
      </ol>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click.native.prevent="close">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Api from '@/api/platform/cdn-refresh-log'
  import FormTokenApi from '@/api/system/form-token'

  export default {
    name: 'cdn-refresh',
    props: {
      visible: {
        required: true,
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        form: {
          token: '',
          pageUrl: '',
          refreshGenre: 1,
          // 1-目录URL，2-整个目录，3-文件URL
          refreshType: 1
        }
      }
    },
    methods: {
      close () {
        this.$emit('update:visible', false)
      },
      getFormToken () {
        FormTokenApi.create(response => {
          let status = response.status || 0
          let body = response.data || []
          if (status >= 200 && status <= 204) {
            this.form.token = body.token || ''
          }
        })
      },
      validateUrl (rule, value, callback) {
        const protocols = value.replace(/\s?/g, '').match(/^(.*):\/\/.*/)
        const protocol = Array.isArray(protocols) && protocols.length >= 2 ? protocols[1] : 'http'
        if (protocol !== 'http' && protocol !== 'https') {
          callback(new Error('不支持的通信协议 [' + protocol + ']，或者地址输入错误'))
        } else if (!(/^https?:\/\/.*/.test(value))) {
          callback(new Error('地址输入错误'))
        } else {
          callback()
        }
      },
      validateGenre (rule, value, callback) {
        const items = this.form.pageUrl.split('/')
        if (value === 2 && items.length > 1 && items[items.length - 1].indexOf('.') !== -1) {
          callback(new Error('这是一个文件地址！无法刷新整个目录'))
        } else {
          callback()
        }
      },
      urlBlur (e) {
        const value = e.target.value || ''
        this.$refs['cdnRefreshForm'].clearValidate()

        // 先去掉输入中的所有空白字符、查询参数、头尾所有 /
        let url = value.replace(/\s+/g, '').replace(/\?.*$/g, '').replace(/(^\/*)|(\/*$)/g, '')

        if (url.length > 0) {
          // 根据判断最后段是否为文件
          const items = url.split('/')
          if (items.length > 1 && items[items.length - 1].indexOf('.') !== -1) {
            // 文件URL
            this.form.refreshType = 3
          } else {
            // 目录URL
            this.form.refreshType = 1
            url = url + '/'
          }

          // 重组 url
          this.form.pageUrl = url
        }
      },
      genreChange (value) {
        if (value === 2) {
          this.form.refreshType = 2
        }
      },
      submit () {
        this.$refs['cdnRefreshForm'].validate((valid) => {
          if (valid) {
            // todo 一次刷新多个 url
            // const form = this.form
            // form.url = form.url.replace('\n', '#MS#')

            Api.create(this.form, response => {
              let status = response.status || 0
              let body = response.data || []
              if (status >= 200 && status <= 204) {
                if (body.map.error.length > 0) {
                  let msg = ''
                  body.map.error.forEach(item => {
                    msg = msg + item + '<br/>'
                  })
                  this.$message.error({
                    dangerouslyUseHTMLString: true,
                    message: msg
                  })
                } else {
                  this.$message.success('刷新成功')
                }
                this.getFormToken()
              } else {
                this.$message.error(body.error || '刷新失败')
                this.getFormToken()
              }
            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .cdn-refresh {
    text-align: left;
  }
</style>
