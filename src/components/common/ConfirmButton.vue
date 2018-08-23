<template>
  <span class="ms-confirm-button">
    <el-popover v-model="visible" :placement="popoverPlacement" :width="popoverWidth" @show="show()" @hide="hide()">
      <template v-if="type === 'icon'">
        <el-tooltip slot="reference" :content="title">
          <icon class="ms-icon-btn" :name="icon" @click.native.prevent="visible = true"/>
        </el-tooltip>
      </template>
      <template v-else>
        <el-button slot="reference" type="text" :size="size" @click.native.prevent="visible = true">
          <icon v-if="icon.length > 0" :name="icon"/>
          {{ title }}
        </el-button>
      </template>

      <slot>您确定要删除这行数据吗？</slot>
      <div class="option">
        <el-button type="text" :size="size" @click.native.prevent="visible = false">取消</el-button>
        <el-button type="primary" :size="size" @click.native.prevent="confirm()">确定</el-button>
      </div>
    </el-popover>
  </span>
</template>

<script>
  export default {
    name: 'ms-confirm-button',
    props: {
      title: {
        type: String,
        default: '删除'
      },
      type: {
        type: String,
        default: 'button'
      },
      popoverPlacement: {
        type: String,
        default: 'left-start'
      },
      popoverWidth: {
        type: Number,
        default: 180
      },
      icon: {
        type: String,
        default: ''
      },
      size: {
        type: String,
        default: 'mini'
      }
    },
    data () {
      return {
        visible: false
      }
    },
    methods: {
      show () {
        this.$emit('show')
      },
      hide () {
        this.$emit('hide')
      },
      confirm () {
        this.$emit('confirm')
        this.visible = false
      }
    }
  }
</script>

<style scoped>
  .option {
    text-align: right;
    margin: 8px 0 0;
  }
</style>
