<template>
  <div
    :class="[
      'kf53',
      fixed ? 'fixed' : '',
      hover && !editing ? 'hover' : '',
      deleteHover ? 'delete-hover' : '',
      editing ? 'editing' : ''
    ]"
    @mouseover="hover = true"
    @mouseout="hover = false">
    <div class="kf53-wrap">
      <div class="preview">
        <img v-if="codeSrc && codeSrc.length > 0" src="/static/images/platform/page-design/kf53.jpg"/>
        <p v-else class="no-content">请<br/>填<br/>写<br/>53<br/>客<br/>服<br/>代<br/>码<br/></p>
      </div>
      <div v-show="editing" class="setting">
        <!--<pre>-->
        <!--&lt;script&gt;-->
        <!--(function() {-->
        <!--var _53code = document.createElement("script");-->
        <!--_53code.src = "<el-input v-model="content" size="small" placeholder="//tb.53kf.com/code/code/10158138/1"/>";-->
        <!--var s = document.getElementsByTagName("script")[0];-->
        <!--s.parentNode.insertBefore(_53code, s);-->
        <!--})();-->
        <!--&lt;/script&gt;-->
        <!--</pre>-->
        <el-input
          v-model="currentContent"
          type="textarea"
          :rows="8"
          placeholder="<script>(function(){var _53code = .... }());</script>"/>
        <div class="option">
          <el-button size="small" type="success" @click="finish()">完成</el-button>
        </div>
      </div>

      <div v-show="hover && !editing && !deleteHover" class="mask" @click="edit()">
        <el-button size="small" type="info">编辑</el-button>
      </div>

      <div
        v-show="hover"
        class="delete"
        @click="trash()"
        @mouseover="deleteHover = true"
        @mouseout="deleteHover = false">
        <icon name="trash" scale="1.5"/>
      </div>
    </div>
  </div>
</template>

<script>
  const KF53_CODE_TEMPLATE = '&ltscript&gt(function() {var _53code = document.createElement("script");' +
    '_53code.src = "#CODE_SRC#";var s = document.getElementsByTagName("script")[0]; ' +
    's.parentNode.insertBefore(_53code, s);})();&lt/script&gt'

  export default {
    name: 'Kf53',
    props: {
      content: {
        required: true,
        type: String
      },
      fixed: {
        type: Boolean,
        default: false
      }
    },
    data () {
      const currentContent = this.content && this.content.length > 0
        ? KF53_CODE_TEMPLATE.replace('#CODE_SRC#', this.content) : ''
      return {
        hover: false,
        deleteHover: false,
        editing: false,
        currentContent: currentContent,
        codeSrc: ''
      }
    },
    watch: {
      currentContent (val) {
        const regex = /^<script>.*_53code\.src\s?=\s?"(http[s]?:)?(.*?)";.*<\/script>/i
        const noBlankStr = val.replace(/[\n\r]/g, '')
        const matchs = noBlankStr.match(regex)
        if (matchs !== null && matchs.length === 3) {
          this.codeSrc = matchs[2]
        }
      }
    },
    methods: {
      edit () {
        this.editing = true
      },
      trash () {
        this.$emit('remove')
      },
      finish () {
        this.editing = false

        const response = {genre: 'kf53CodeSrc', content: this.codeSrc}
        this.$emit('finish', response)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/styles/env";

  $base-z-index: 300;

  .kf53 {
    min-width: 46px;
    min-height: 226px;
    padding: 8px;
    display: inline-block;
    background: $color-white;
    border: 3px $color-white solid;
    z-index: $base-z-index;

    &.hover {
      border-color: $color-white-tint;
    }
    &.editing, &.active {
      border-color: $color-success;
    }
    &.delete-hover {
      border-color: $color-danger;
    }

    &.fixed {
      position: fixed;
      top: 100px;
    }

    &-wrap {
      height: 226px;
      width: 100%;
      box-sizing: border-box;
      position: relative;
    }

    .preview {
      width: 46px;
      height: 100%;
      box-sizing: border-box;
      float: left;

      p.no-content {
        border: 1px $color-white-tint dashed;
        border-radius: 5px;
        padding: 5px;
        margin: 0;
        text-align: center;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        /*color: $color-white-tint;*/
      }
    }

    .setting {
      float: left;
      width: 360px;
      margin-left: 8px;

      .option {
        margin-top: 8px;
      }
    }

    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      background: rgba(255, 255, 255, 0.5);
      top: 0;
      left: 0;
      border-radius: 4px;
      text-align: center;
      z-index: $base-z-index;

      button {
        position: absolute;
        bottom: 0;
        left: -5px;
        z-index: $base-z-index + 1;
      }
    }

    .delete {
      color: $color-gray;
      cursor: pointer;
      position: absolute;
      top: 2px;
      right: 10px;
      z-index: $base-z-index + 1;
      &:hover {
        color: $color-danger;
      }
    }
  }

</style>
