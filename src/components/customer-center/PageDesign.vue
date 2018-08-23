<template>
  <div class="page-design">
    <div class="page-designer">
      <div class="col-item col-left">
        <div class="col-left-fixed">
          <dl class="genre-list">
            <dt>可用组件</dt>
            <dd
              v-for="(item, index) in genres" :key="index"
              @click="addComponent(item.name)">{{ item.title }}</dd>
          </dl>
          <dl>
            <dt>功能代码</dt>
            <dd v-for="(item, index) in features" :key="index">
              {{ item.title }}
              <el-switch v-model="featureCodeActive[item.name]" active-color="#13ce66" :disabled="!item.editable"/>
            </dd>
          </dl>
          <dl>
            <dt>发布设置</dt>
            <dd
              class="setting-box"
              @mouseover="settingBoxVisible = true"
              @mouseout="settingBoxVisible = false">
              页面信息
              <span v-if="setting.url" class="ms-success">(已设置)</span>
              <span v-else class="ms-caution">(未设置)</span>
              <icon name="angle-double-right" scale="1" />
              <div v-if="settingBoxVisible" class="page-setting-box">
                <ms-page-setting :content="setting" @finish="finishPageSetting" />
              </div>
            </dd>
            <dd>
              <el-button size="small" type="primary" @click="deploy">发布页面</el-button>
              <el-button size="mini" @click="goBack">返回</el-button>
            </dd>
          </dl>
        </div>
      </div>
      <div class="col-item col-right">
        <!--<ms-header-->
          <!--v-if="featureCodeActive.header"-->
          <!--content=""-->
          <!--@finish="finishFeatureCode"-->
          <!--@remove="featureCodeActive.header = false"/>-->

        <ms-html-box
          v-for="(item, index) in list" :key="index"
          :genre="item.genre"
          :content="item.content"
          :active="index === activeIndex"
          @active="active(index)"
          @remove="remove(index)"
          @finish="finish"/>

        <ms-copyright v-if="featureCodeActive.copyrightUrl" />
        <ms-kf53
          v-if="featureCodeActive.kf53CodeSrc"
          content=""
          :fixed="true"
          @finish="finishFeatureCode"
          @remove="featureCodeActive.kf53CodeSrc = false" />
        <ms-footer-fixed
          v-if="featureCodeActive.footerFixedStyleId"
          content=""
          @finish="finishFeatureCode"
          @remove="featureCodeActive.footerFixedStyleId = false" />
      </div>
    </div>
  </div>
</template>

<script>
  // import MsHeader from '@/components/common/page_design/feature_code/Header'
  import MsHtmlBox from '@/components/common/page_design/HtmlBox'
  import MsFooterFixed from '@/components/common/page_design/feature_code/FooterFixed'
  import MsKf53 from '@/components/common/page_design/feature_code/Kf53'
  import MsCopyright from '@/components/common/page_design/feature_code/Copyright'
  import MsPageSetting from '@/components/common/page_design/PageSetting'
  import {
    PageFeatureCode, PageSetting,
    SettingFormArgument
  } from '@/models/platform/page-design'
  import ItemSolutionApi from '@/api/platform/item-solution'

  const GENRES = [
    {title: '长图片', name: 'IMAGE'},
    {title: '快捷按钮', name: 'QUICK_BUTTON'},
    {title: '轮播图', name: 'CAROUSEL'},
    {title: '留言板', name: 'FEEDBACK'}
  ]

  const FEATURES = [
    // {title: '顶部导航', name: 'header', editable: true},
    {title: '53客服代码', name: 'kf53CodeSrc', editable: true},
    {title: '底部浮动代码', name: 'footerFixedStyleId', editable: true},
    // {title: '第三方统计代码', name: 'statisticsCode', editable: true},
    {title: '渠道版权代码', name: 'copyrightUrl', editable: false}
  ]

  export default {
    components: {
      MsHtmlBox,
      MsFooterFixed,
      MsKf53,
      MsCopyright,
      MsPageSetting
    },
    props: {
      id: {
        type: [Number, String],
        default: ''
      }
    },
    data () {
      return {
        activeIndex: null,
        settingBoxVisible: false,
        setting: new PageSetting(),
        featureCode: new PageFeatureCode(),
        featureCodeActive: {
          header: false,
          footerFixedStyleId: false,
          statisticsCode: false,
          kf53CodeSrc: false,
          copyrightUrl: true
        },
        list: [
          {
            genre: 'IMAGE',
            content: ''
          },
          {
            genre: 'CAROUSEL',
            content: []
          },
          {
            genre: 'FEEDBACK',
            content: {
              id: 0,
              clientId: 0
            }
          }
        ]
      }
    },
    created () {
      this.setting.itemSolutionId = this.itemSolutionId
    },
    computed: {
      itemSolutionId () {
        return this.id || this.$route.params['id'] || 0
      },
      genres () {
        return GENRES
      },
      features () {
        return FEATURES
      }
    },
    methods: {
      addComponent (name) {
        const index = this.activeIndex !== null ? this.activeIndex : this.list.length - 1
        const component = {genre: name, content: ''}
        if (index >= 0) {
          this.list.splice(index, 1, this.list[index], component)
        } else {
          this.list.push(component)
        }
      },
      active (index) {
        this.activeIndex = index
      },
      remove (index) {
        this.list.splice(index, 1)
      },
      finish (result) {
        if (this.activeIndex >= 0) {
          this.list.splice(this.activeIndex, 1, result)
        }
      },
      finishFeatureCode (result) {
        if (this.featureCode.hasOwnProperty(result.genre)) {
          this.featureCode[result.genre] = result.content || ''
        }
      },
      finishPageSetting (result) {
        this.settingBoxVisible = false
        this.setting = Object.assign({}, new PageSetting(), result)

        // 本身通过 route 传递了 itemSolutionId，则以传递的值为准
        if (this.itemSolutionId > 0) {
          this.setting.itemSolutionId = this.itemSolutionId
        }
      },
      deploy () {
        const form = {
          components: this.list,
          featureCode: this.featureCode,
          setting: new SettingFormArgument({pageSetting: this.setting})
        }

        const itemSolutionId = this.setting.itemSolutionId
        if (itemSolutionId <= 0) {
          this.$message.error('未指定项目方案')
          return
        }

        if (!form.setting.url || form.setting.url.length < 1) {
          this.$message.error('请先设置 页面信息 - 访问地址')
          return
        }

        ItemSolutionApi.deployPageDesign({id: itemSolutionId, form: form}, response => {
          const status = response.status || 0
          const body = response.data || {}
          if (status >= 200 && status < 300) {
            this.$message.success('发布成功')
            this.goBack()
          } else {
            this.$message.error(body.error || '发布失败')
          }
        })
      },
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/env";

  .page-design {
    &-setting {

    }

    .page-designer {
      height: 100%;
      /*display: flex;*/
      /*flex-flow: row nowrap;*/
      /*justify-content: space-around;*/
      /*align-items: flex-start;*/
      /*position: relative;*/

      .col-item {
        min-height: 100px;
        float: left;
        margin-left: 12px;

        &:first-child {
          margin-left: 0;
        }
      }

      .col-left {
        width: 200px;

        &-fixed {
          width: 200px;
          margin: 0;
          padding: 0;
          position: fixed;
          border: 1px solid $color-bg-info;
          line-height: 28px;
          z-index: 500;

          dl {
            margin: 0;
            padding: 0;
          }

          dt {
            padding: 5px;
            background: $color-primary-tint;
          }

          dd {
            padding: 5px;
            cursor: pointer;
            margin: 0;
            text-align: center;

            &:hover {
              background: $color-tint;
            }
          }

          .setting-box {
            position: relative;

            .page-setting-box {
              width: 380px;
              position: absolute;
              right: -380px;
              top: 0;
            }
          }
        }
      }

      .col-right {
        width: calc(100% - 230px);
        min-height: 600px;
        border: 1px solid $color-bg-info;
        position: relative;
        padding-bottom: 80px;

        .ms-feature-code {
          width: 100%;
          position: absolute;
          bottom: 0;
        }
      }
    }
  }
</style>
