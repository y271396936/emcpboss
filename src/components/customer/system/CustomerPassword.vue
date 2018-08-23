<template>
  <div class="ms-list">
    <h3 style="margin-left: 100px">修改密码</h3>
    <div style="width: 500px">
      <el-form class="form" label-width="160px" size="small" :model="form" ref="formModify">
        <el-form-item label="原密码" prop="oldPassword" :rules="[{required: true, message: '必填'}]">
          <el-input v-model="form.oldPassword" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password"
                      :rules="[{required: true, message: '必填'},{min: 8, message: '最少8位'}, { validator: validatePass, trigger: 'blur'}]">
          <el-input type="password" v-model="form.password" placeholder="最少8位，必须包含字母、数字"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirm" :rules="[{required: true, message: '必填'}, { validator: validatePass2, trigger: 'blur'}]">
          <el-input type="password" v-model="form.confirm"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit()">提交</el-button>
          <el-button @click="resetForm('formModify')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  import Api from '@/api/customer/password'

  export default {
    data () {
      return {
        form: {}
      }
    },
    methods: {
      submit () {
        this.$refs['formModify'].validate((valid) => {
          if (valid) {
            Api.modify({form: this.form}, response => {
              let status = response.status || 0
              let body = response.data || {}
              if (status >= 200 && status <= 204) {
                this.resetForm('formModify')
                this.$message.success('密码修改成功')
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
        if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
