<template>
  <div :class="['page-setting', fixed ? 'fixed' : '']">
    <div class="page-setting-wrap">
      <el-form :model="setting" ref="pageSettingForm" label-width="80px" size="small">
        <el-form-item
          label="项目方案"
          prop="itemSolutionId">
          <el-input
            v-model="setting.itemSolutionId"
            placeholder="请输入项目方案ID"
            :disabled="setting.itemSolutionId > 0"/>
        </el-form-item>
        <el-form-item
          label="访问地址"
          prop="url"
          :rules="[
            { required: true, message: '请输入访问地址', trigger: 'blur' }
          ]">
          <el-input v-model="setting.url" placeholder="如：www.abc.com/cygs-m">
            <template slot="prepend">http://</template>
            <template slot="append">/</template>
          </el-input>
        </el-form-item>
        <el-form-item label="页面标题" prop="title">
          <el-input v-model="setting.title" placeholder="留空则自动设置为项目名"/>
        </el-form-item>
        <el-form-item label="页面宽度" prop="width">
          <el-input v-model="setting.width" placeholder="留空则为100%；支持：100%, 960px, 1000"/>
        </el-form-item>
        <el-form-item>
          <el-button v-if="finishButton" type="success" @click.native="finish()">完成</el-button>
          <el-button v-if="deployButton" type="primary" @click.native="deploy()">发布</el-button>
          <slot name="option">
          </slot>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import { PageSetting } from '@/models/platform/page-design'

  export default {
    name: 'PageSetting',
    props: {
      content: {
        required: true,
        type: Object
      },
      fixed: {
        type: Boolean,
        default: false
      },
      finishButton: {
        type: Boolean,
        default: true
      },
      deployButton: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        setting: new PageSetting()
      }
    },
    created () {
      this.setting = Object.assign({}, new PageSetting(), this.content)
      if (this.setting.itemSolutionId === 0) {
        this.setting.itemSolutionId = ''
      }
    },
    methods: {
      finish () {
        this.validate(() => {
          this.$emit('finish', this.setting)
        })
      },
      deploy () {
        this.validate(() => {
          this.$emit('deploy', this.setting)
        })
      },
      validate (cb) {
        this.$refs['pageSettingForm'].validate(valid => {
          if (valid) {
            cb !== null && typeof cb === 'function' && cb()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/env";

  .page-setting {
    &-wrap {
      border: 1px solid $color-bg-info;
      padding: 8px;
      box-sizing: border-box;
      background: $color-white;
    }

    &.fixed {
      height: 120px;
      .page-setting-wrap {
        position: fixed;
      }
    }
  }
</style>
