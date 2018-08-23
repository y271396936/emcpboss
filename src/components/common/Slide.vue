<template>
  <div class="slide">
    <transition :name="transitionName">
      <div v-if="visible"
           :class="['slide-wrap', 'slide-wrap-' + align]"
           :style="{width: (width > 100 ? width + 'px' : '1000px')}">
        <div class="slide-header">
          <el-button class="ms-btn-close" icon="el-icon-close" round @click="close()"></el-button>
          <slot name="header">{{ title }}</slot>
        </div>
        <div class="slide-body">
          <el-scrollbar class="slide-body-scrollbar">
              <slot> &lt;EMPTY&gt; </slot>
          </el-scrollbar>
        </div>
      </div>
    </transition>
    <div v-if="shade && visible"
         class="slide-shade"
         :style="{ opacity: (shadeOpacity > 0 ? shadeOpacity / 100 : .5)}"></div>
  </div>
</template>
<script>
  const transitionMap = {
    left: 'slide-left',
    right: 'slide-right'
  }

  export default {
    name: 'MsSlide',
    props: {
      title: {
        type: String,
        default: ''
      },
      width: {
        type: Number,
        default: 1000
      },
      align: {
        type: String,
        default: 'right'
      },
      shade: {
        type: Boolean,
        default: true
      },
      shadeOpacity: {
        type: Number,
        default: 30
      }
    },
    data () {
      return {
        visible: false
      }
    },
    computed: {
      transitionName () {
        return transitionMap[this.align] || transitionMap.left
      }
    },
    methods: {
      show () {
        this.visible = true
        this.$emit('show')
      },
      close () {
        this.visible = false
        this.$emit('close')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/styles/env";

  .slide {
    position:absolute;
    &-wrap {
      position: fixed;
      top: 0;
      z-index: $z-index-slide + 1;
      padding: 8px 0 8px 8px;
      background-color: $color-white;
      height: 100%;
      &-left {
        left: 0;
        .ms-btn-close {
          right: -20px;
        }
      }
      &-right {
        right: 0;
        .ms-btn-close {
          left: -20px;
        }
      }
    }
    &-header {
      height: 32px;
      line-height: 32px;
      font-size: 16px;
      text-align: center;
      font-weight: bold;
      overflow: hidden;
      .ms-btn-close {
        position: absolute;
        top: 2px;
        padding: 10px;
        border-radius: 20px;
      }
    }
    &-body {
      float: right;
      width: 100%;
      height: 100%;
      &-scrollbar {
        width: 100%;
        height: 100%;
        padding-bottom: 20px;
        box-sizing: border-box;
      }
    }
    &-shade {
      position: fixed;
      top: 0;
      left: 0;
      z-index: $z-index-slide;
      width: 100%;
      height: 100%;
      background-color: $color-black;
    }
  }
</style>
<style lang="scss">
  // 纵向滚动条
  .slide-body-scrollbar .el-scrollbar__view {
    padding-right: 8px;
    padding-bottom: 28px;
  }
</style>
