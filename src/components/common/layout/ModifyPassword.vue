<template>
  <transition name="fade">
    <el-row class="login" type="flex" justify="center">
      <el-col class="login-box" :lg="6" :md="8" :sm="12" :xs="20">
        <h1 class="login-box-title">
          设置新登录密码
          <sub>— 账号安全机制，请不定期更新您的密码 —</sub>
        </h1>
        <br/>
        <el-form class="form" label-width="80px" size="small" :model="ruleForm" ref="ruleForm">
          <el-form-item label="原密码" prop="oldPassword" :rules="[{required: true, message: '必填'}]">
            <el-input v-model="ruleForm.oldPassword"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="password"
                        :rules="[{required: true, message: '必填'},{min: 8, message: '最少8位'}, { validator: validatePass, trigger: 'blur'}]">
            <el-input v-model="ruleForm.password" placeholder="最少8位，必须包含字母、数字"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirm"
                        :rules="[{required: true, message: '必填'}, { validator: validatePass2, trigger: 'blur'}]">
            <el-input v-model="ruleForm.confirm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
        <p class="copyright">
          &copy; 2016 - {{year}} <a href="//www.qudao51.com/" target="_blank">渠道无忧</a>
        </p>
      </el-col>
    </el-row>
  </transition>
</template>
<script>
  import moment from 'moment'
  import Api from '@/api/system/system-user'

  export default {
    name: 'ms-modify-password',
    data () {
      return {
        ruleForm: {},
        year: moment().format('Y')
      }
    },
    methods: {
      submitForm () {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            Api.modifyPassword({form: this.ruleForm}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                this.$message.success('密码修改成功，请重新登录')
                this.$store.getters.isLogin = false
                this.$store.state.user.info = {}
                window.location.reload()
              } else {
                this.$message.error(body.error || '密码修改失败')
              }
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      validatePass (rule, value, callback) {
        let regp = /^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/
        if (regp.test(value)) {
          callback()
        } else {
          callback(new Error('必须包含字母和数字!'))
        }
      },
      validatePass2 (rule, value, callback) {
        if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  .login {
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 1;
    background-color: rgba(94, 108, 132, 0.66);
    .login-box {
      height: 343px;
      padding: 20px;
      position: relative;
      top: 100px;
      border-radius:30px;
      box-shadow: 2px 2px 50px $color-gray;
      background-color: $color-white;
      &-title {
        width: 100%;
        text-align: center;
        padding-bottom: 5px;
        margin: 0;
        color: $color-secondary;
        border-bottom: 2px solid $color-tint;
        sub {
          display: block;
          @extend %font-size-small;
          font-weight: normal;
          padding-top: 9px;
          color: #aeb2b7;
          text-align: center;
        }
      }
      .copyright {
        text-align: right;
        @extend %font-size-small;
      }
    }
  }
</style>
