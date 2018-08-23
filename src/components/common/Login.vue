<template>
  <transition name="fade">
    <el-row class="login" type="flex" justify="center">
      <el-col class="login-box">
        <div class="left">
          <div class="logo"><img src="../../assets/images/login/cus-login.png" alt=""></div>
          <div class="des">开屏魔方</div>
        </div>
        <div class="right">
          <el-form :model="form" class="login-form" size="large" @keyup.enter.native="login" ref="form">
            <el-form-item
              prop="loginAccount">
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
            </el-form-item>
            <el-form-item>
              <el-button v-if="logining" class="btn-login" type="info" disabled>正在登陆...</el-button>
              <el-button v-else class="btn-login" type="primary" @click="login">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <div class="bottom">
        <div class="adver">大数据驱动广告运营，大数据驱动项目招商</div>
        <div><img src="../../assets/images/login/simple.png" alt=""></div>
        <div class="copyright">
          &copy; 2016 - {{year}} <a href="//www.qudao51.com/" target="_blank">渠道无忧</a>
        </div>
      </div>
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
<style lang="scss">
  .right .login-form .el-form-item .el-form-item__content .el-input {
    input {
      padding-left: 30px;
      border: none;
      background-color: transparent;
      border-bottom: 1px solid #cccccc;
      border-radius: 0;
    }
  }
</style>
<style lang="scss" scoped>
  @import "../../assets/styles/env";

  .login {
    width: 100%;
    height: 100%;
    background: #000 url("../../assets/images/login/customer-login.jpg") no-repeat fixed center;
    /*-webkit-background-size: 100%;*/
    /*background-size: 100%;*/
    .login-box {
      width: 910px;
      height: 478px;
      position: relative;
      top: calc(50% - 247px);
      box-sizing: border-box;
      box-shadow: 2px 2px 50px $color-gray;
      display: flex;
      >div{
        width: 50%;
      }
      .left{
        background: rgba(255, 255, 255, 0.82);
        text-align: center;
        position: relative;
        .logo {
          margin-top:143px;
        }
        .des {
          font-size: 32px;
          letter-spacing: 5px;
        }
        .copyright {
          position: absolute;
          bottom: 10px;
          left: 19%;
        }
      }
      .right {
        background-color: #f8fafa;
        padding: 90px 60px;
        box-sizing: border-box;
      }
      .seo {
        margin: 0;
      }
      .login-form {
        padding-top: 20px;
        .btn-login {
          width: 100%;
          border-radius: 50px;
          margin-top: 25px;
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 68px;
      text-align: center;
      color: white;
      .adver {
        font-size: 25px;
        letter-spacing: 8px;
        margin-bottom: 13px;
      }
      .copyright {
        @extend %font-size-small;
        margin-top: 12px;
      }
    }
  }
</style>
