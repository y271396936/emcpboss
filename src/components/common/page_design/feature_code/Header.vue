<template>
  <div
    :class="[
      'header',
      hover && !editing ? 'hover' : '',
      deleteHover ? 'delete-hover' : '',
      editing ? 'editing' : ''
    ]"
    @mouseover="hover = true"
    @mouseout="hover = false">
    <div v-show="editing" class="setting">
      <el-select v-model="styleId" size="small" placeholder="请选择样式">
        <el-option
          v-for="(item, index) in styles" :key="index"
          :label="item.title"
          :value="item.id"/>
      </el-select>
      <el-button size="small" type="success" @click="finish()">完成</el-button>
    </div>
    <div class="preview">
      <img v-if="thumbUrl" :src="thumbUrl" />
      <p v-else class="no-content"> 请选择顶部导航样式 </p>
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

</template>

<script>
  const STYLES = [
    {
      id: 1,
      title: '招商帮',
      thumbUrl: '/static/images/platform/page-design/header-01.jpg'
    },
    {
      id: 2,
      title: '创展互联',
      thumbUrl: '/static/images/platform/page-design/header-02.jpg'
    },
    {
      id: 2,
      title: '商机在线',
      thumbUrl: '/static/images/platform/page-design/header-03.jpg'
    }
  ]

  export default {
    name: 'header',
    props: {
      content: {
        required: true,
        type: String
      }
    },
    data () {
      return {
        hover: false,
        deleteHover: false,
        editing: false,
        styleId: this.content
      }
    },
    computed: {
      styles () {
        return STYLES
      },
      thumbUrl () {
        const index = this.styles.findIndex(item => item.id === this.styleId)
        return index >= 0 ? this.styles[index]['thumbUrl'] || '' : ''
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

        const response = {genre: 'header', content: this.styleId}
        this.$emit('finish', response)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../../assets/styles/env";

  .header {
    position: relative;
    width: 100%;
    min-height: 38px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, .5);
    border: 3px $color-white solid;
    overflow: hidden;

    &.hover {
      border-color: $color-white-tint;
    }
    &.editing, &.active {
      border-color: $color-success;
    }
    &.delete-hover {
      border-color: $color-danger;
    }

    .preview {
      margin: 0;
      padding: 0;
      text-align: center;

      p.no-content {
        border: 1px $color-white-tint dashed;
        border-radius: 5px;
        padding: 5px;
        margin: 0;
        text-align: center;
        min-height: 38px;
        width: 100%;
        box-sizing: border-box;
      }
    }

    .setting {
      float: left;
      width: 100%;
      padding: 5px 8px;
      box-sizing: border-box;

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
      /*z-index: $base-z-index;*/

      button {
        position: absolute;
        top: calc(50% - 16px);
        /*z-index: $base-z-index + 1;*/
      }
    }

    .delete {
      color: $color-gray;
      cursor: pointer;
      position: absolute;
      top: 2px;
      right: 10px;
      /*<!--z-index: $base-z-index + 1;-->*/
      &:hover {
        color: $color-danger;
      }
    }
  }
</style>
