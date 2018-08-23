<template>
  <transition name="fade">
    <el-row class="login" type="flex" justify="center">
      <el-col class="login-box" :lg="6" :md="8" :sm="12" :xs="20">
        <h1 class="login-box-title">
          渠道无忧媒
          <sub>—— 更多企业选择的渠道服务商</sub>
        </h1>

        <el-form :model="form" class="login-form" size="large" @keyup.enter.native="login" ref="form">
          <el-form-item
            prop="loginAccount"
            :rules="[
                  { required: true, message: '请输入账号' },
                  { min: 3, max: 15, message: '长度在 3 到 15 个字符' }
                ]">
            <el-input v-model="form.loginAccount" placeholder="用户名、Email，或绑定手机">
              <icon slot="prefix" name="user"/>
            </el-input>
          </el-form-item>
          <el-form-item
            prop="password"
            :rules="[
                  { required: true, message: '请输入密码' }
                ]">
            <el-input v-model="form.password" type="password" placeholder="密码">
              <icon slot="prefix" name="key"/>
            </el-input>
          </el-form-item>
          <el-form-item size="mini">
            <el-checkbox v-model="rememberMe" label="记住账号"/>
            <!--<a href="#">忘记密码?</a>-->
          </el-form-item>
          <el-form-item>
            <el-button v-if="logining" class="btn-login" type="info" disabled>正在登陆...</el-button>
            <el-button v-else class="btn-login" type="primary" @click="login">登录</el-button>
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
  import UserApi from '@/api/system/user'
  import moment from 'moment'
  import { userAction } from '@/store/action-names'

  const _CK_LOGIN_ACCOUNT = '_qd_emcp.b_u'

  export default {
    name: 'MsLogin',
    data () {
      return {
        logining: false,
        year: moment().format('Y'),
        form: {
          loginAccount: '',
          password: ''
        },
        rememberMe: true
      }
    },
    created () {
      // 获取已记住的账号
      let loginAccount = this.$cookie.get(_CK_LOGIN_ACCOUNT)
      if (loginAccount !== undefined && loginAccount !== null && loginAccount.length > 0) {
        this.form.loginAccount = loginAccount
      }
    },
    methods: {
      login () {
        if (this.logining) {
          return
        }

        this.$refs['form'].validate(valid => {
          if (valid) {
            // 记住账号
            if (this.rememberMe) {
              this.$cookie.set(_CK_LOGIN_ACCOUNT, this.form.loginAccount)
            } else {
              this.$cookie.delete(_CK_LOGIN_ACCOUNT)
            }

            this.logining = true
            UserApi.login(this.form, (response) => {
              let status = response.status || 0
              let body = response.data || {}
              if (status === 200 || status === 204) {
                this.$store.dispatch(userAction.login, {user: body})
                this.$message.success('登陆成功')
                window.location.reload()
              } else {
                this.$message.error(body.error || '登陆失败')
              }
              this.logining = false
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/env";

  .login {
    width: 100%;
    height: 100%;
    background-color: $color-secondary;
    .login-box {
      height: 360px;
      padding: 20px;
      position: relative;
      top: calc(50% - 180px);
      border-radius:15px;
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
          text-align: right;
        }
      }
      .seo {
        margin: 0;
      }
      .login-form {
        padding-top: 20px;
        .btn-login {
          width: 100%;
        }
      }
      .copyright {
        text-align: right;
        @extend %font-size-small;
      }
    }
  }
</style>
