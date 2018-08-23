<template>
  <div class="search">
    <el-row class="search-condition">
      <span class="condition-title">搜索条件：</span>
      <el-tag
        v-for="condition in selectiveConditions" :key="condition.name"
        class="condition-tag"
        type="primary"
        size="mini"
        closable
        @close="removeCondition(condition.index, condition.name)">
        {{ condition.text }}
      </el-tag>
      <el-button
        v-if="selectiveConditions.length > 0"
        class="search-criteria-btn"
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="updateConditions">提交搜索
      </el-button>
      <el-button
        v-else
        class="search-criteria-btn"
        type="primary"
        icon="el-icon-search"
        size="mini"
        @click="updateConditions">搜索全部
      </el-button>
    </el-row>

    <el-row class="search-list">
      <div v-show="search.visible" v-for="search in data" :key="search.name" class="search-item" v-if="search.type != conditionType.SELECT_RADIO">
        <span class="search-title">{{ search.title }}：</span>
        <el-input
          v-if="search.type === conditionType.TEXT"
          v-model="search.value"
          class="search-input"
          size="mini"
          :placeholder="search.placeholder">
          <template v-if="search.slots && search.slots.prepend" slot="prepend">{{ search.slots.prepend }}</template>
          <template v-if="search.slots && search.slots.append" slot="append">{{ search.slots.append }}</template>
        </el-input>
        <template v-else-if="search.type === conditionType.SELECT">
          <el-select
            v-if="search.config.remote && search.config.remote.enabled"
            v-model="search.value"
            size="mini"
            filterable clearable remote
            :placeholder="search.placeholder"
            :remote-method="search.config.remote.method"
            :loading="search.config.remote.loading">
            <el-option
              v-for="option in search.config.list" :key="option.value"
              :label="option.label"
              :value="option.label"
              :disabled="option.disabled"/>
          </el-select>
          <el-select
            v-else
            v-model="search.value"
            size="mini"
            filterable clearable
            :placeholder="search.placeholder">
            <el-option
              v-for="option in search.config.list" :key="option.value"
              :label="option.label"
              :value="option.label"
              :disabled="option.disabled"/>
          </el-select>
        </template>
        <el-select
          v-else-if="search.type === conditionType.SELECT_GROUP"
          v-model="search.value"
          size="mini"
          clearable
          :placeholder="search.placeholder">
          <el-option-group v-for="group in search.config" :key="group.label" :label="group.label">
            <el-option
              v-for="option in group.options" :key="option.value"
              :label="option.label"
              :value="option.label"
              :disabled="option.disabled"/>
          </el-option-group>
        </el-select>
        <el-date-picker
          v-else-if="search.type === conditionType.DATE"
          v-model="search.value"
          size="mini"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-value="search.value"
          :type="search.config.type"
          :format="search.config.format"
          :value-format="search.config.valueFormat">
          <!--:picker-options="getPickerOptions(search.config.type)"-->
        </el-date-picker>
      </div>
      <div class="pickRadio" v-show="search.visible" v-for="search in data" v-if="search.type === conditionType.DATE && search['config'].type === daterPickerType.DATE_RANGE">
          <span class="pick-title">{{search.title}}快选：</span>
          <el-radio-group v-model="search.value" size="small">
            <el-radio :label="today" border>今天</el-radio>
            <el-radio :label="yesterday" border>昨天</el-radio>
            <el-radio :label="before_yes" border>前天</el-radio>
            <el-radio :label="last_week" border>最近一周</el-radio>
            <el-radio :label="last_month" border>最近30天</el-radio>
            <el-radio :label="month" border>本月</el-radio>
          </el-radio-group>
      </div>
    </el-row>

    <el-row v-show="moreBtn.visible" class="more-box">
      <span class="more-btn" @click="moreSwitch()">
        {{ moreBtn.text }} <icon :name="moreBtn.icon"/>
      </span>
    </el-row>
  </div>
</template>

<script>
  import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
  import moment from 'moment'

  // 时间快捷方式
  const pickerShortcuts = [
    {
      text: '昨天',
      onClick (picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    }, {
      text: '前天',
      onClick (picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
        picker.$emit('pick', date)
      }
    }, {
      text: '三天前',
      onClick (picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 3)
        picker.$emit('pick', date)
      }
    }, {
      text: '一周前',
      onClick (picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    }
  ]
  const pickerRangShortcuts = [
    {
      text: '昨天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        end.setTime(end.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '前天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 2)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '三天前',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
        end.setTime(end.getTime() - 3600 * 1000 * 24 * 3)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近一周',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '最近30天',
      onClick (picker) {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '本月',
      onClick (picker) {
        const today = new Date()
        const start = new Date(today.getFullYear(), today.getMonth(), 1)
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        picker.$emit('pick', [start, end])
      }
    }, {
      text: '上月',
      onClick (picker) {
        const today = new Date()
        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const end = new Date(today.getFullYear(), today.getMonth(), 0)
        picker.$emit('pick', [start, end])
      }
    }
  ]

  const moreBtn = {
    spread: {icon: 'angle-double-down', text: '展示所有条件'},
    shrink: {icon: 'angle-double-up', text: '隐藏所有条件'}
  }

  export default {
    name: 'MsSearch',
    props: {
      data: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data () {
      return {
        today: [moment().subtract(0, 'days').format('YYYY-MM-DD'), moment().subtract(0, 'days').format('YYYY-MM-DD')],
        yesterday: [moment().subtract(1, 'days').format('YYYY-MM-DD'), moment().subtract(1, 'days').format('YYYY-MM-DD')],
        before_yes: [moment().subtract(2, 'days').format('YYYY-MM-DD'), moment().subtract(2, 'days').format('YYYY-MM-DD')],
        last_week: [moment().subtract(6, 'days').format('YYYY-MM-DD'), moment().subtract(0, 'days').format('YYYY-MM-DD')],
        last_month: [moment().subtract(1, 'months').format('YYYY-MM-DD'), moment().subtract(0, 'months').format('YYYY-MM-DD')],
        month: [moment().startOf('month').format('YYYY-MM-DD'), moment().endOf('month').format('YYYY-MM-DD')]
      }
    },
    computed: {
      conditionType () {
        return CONDITION_TYPE
      },
      daterPickerType () {
        return DATE_PICKER_SHOW_TYPE
      },
      selectiveConditions () {
        let arr = []
        this.data.forEach(function (item, idx) {
          if (item.value !== undefined && item.value !== null && item.value !== '') {
            let text = item.title + ': '
            let value = item.value

            switch (item.type) {
              case CONDITION_TYPE.TEXT:
                if (item.hasOwnProperty('slots')) {
                  text += (item.slots.prepend || '') + item.value + (item.slots.append || '')
                } else {
                  text += item.value
                }
                break
              case CONDITION_TYPE.SELECT:
                if (!item.hasOwnProperty('config') || !item.config.hasOwnProperty('list')) {
                  text += item.value
                } else {
                  let label
                  item.config.list.forEach(function (option) {
                    if (option.label === item.value) {
                      label = option.label
                      value = option.value
                    }
                  })
                  text += label !== undefined ? label : item.value
                }
                break
              case CONDITION_TYPE.SELECT_GROUP:
                if (!item.hasOwnProperty('config')) {
                  text += item.value
                } else {
                  let label
                  item.config.forEach(group => {
                    group.options.forEach(option => {
                      if (option.label === item.value) {
                        label = option.label
                        value = option.value
                      }
                    })
                  })
                  text += label !== undefined ? label : item.value
                }
                break
              case CONDITION_TYPE.DATE:
              case CONDITION_TYPE.TIME:
              case CONDITION_TYPE.DATETIME:
                if (item.config && item.config.type.endsWith('range')) {
                  text += item.value[0] + ' 至 ' + item.value[1]
                } else {
                  text += item.value
                }
                break
              default:
                text += item.value
                break
            }

            arr.push({index: idx, name: item.name, text: text, value: value})
          }
        })

        return arr
      },
      moreBtn () {
        // 只要存在搜索条件，就需要显示
        const length = this.data.length
        let btn = {visible: length > 0}

        // 数据列表中存在不可见的项，则需要显示更多按钮
        let hasHidden = false
        for (let i = 0; i < length; i++) {
          if (!this.data[i].visible && !hasHidden) {
            hasHidden = true
            break
          }
        }

        return Object.assign(btn, hasHidden ? moreBtn.spread : moreBtn.shrink)
      }
    },
    methods: {
      updateConditions () {
        let criteria = {}
        for (let item of this.selectiveConditions) {
          criteria[item.name] = item.value
        }

        // // 点击搜索后，自动收缩条件列表
        // this.data.forEach(function (item) {
        //   item.visible = false
        // })

        this.$emit('click', criteria)
      },
      getPickerOptions (type) {
        if (type.endsWith('range')) {
          return {
            shortcuts: pickerRangShortcuts
          }
        } else if (type === 'date') {
          return {
            shortcuts: pickerShortcuts
          }
        }
      },
      removeCondition (idx, name) {
        if (this.data[idx]['name'] === name) {
          this.data[idx]['value'] = null
        }
      },
      moreSwitch () {
        const length = this.data.length

        // 数据列表中存在不可见的项，则这次操作是展开
        let hasHidden = false
        for (let i = 0; i < length; i++) {
          if (!this.data[i].visible && !hasHidden) {
            hasHidden = true
            break
          }
        }

        this.data.forEach(function (item) {
          item.visible = hasHidden || !item.visible
        })
//       需要重新渲染表格高度
        this.$emit('clickH')
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../../assets/styles/env";
  .pick-title{
    display: inline-block;
    font-size:13px;
    padding-left: 32px;
  }
  .el-checkbox.is-bordered.el-checkbox--small{
    padding: 5px 15px 0px 10px;
    border-radius: 3px;
    height: 29px;
  }
  .el-checkbox-group{
    display: inline-block;
  }
  .pickRadio{
    display: inline-block;
    height: 36px;
    line-height: 36px;
    border-bottom: 1px dashed #dddddd;
  }
  .el-radio--small.is-bordered{
    padding: 6px 7px 0 5px;
    border-radius: 3px;
    height: 28px;
  }
  .search-condition {
    background-color: $color-light;
    border: 1px solid $color-tint;
    padding: 3px 5px;
    min-height: 30px;
    line-height: 30px;
    .condition-title {
      float: left;
      font-size: 15px;
      color: #7d7d7d;
      font-weight: bold;
    }
    .condition-tag {
      height: 28px;
      margin: 0 5px 5px 0;
      line-height: 28px;
    }
  }
  .search-list {
    width: 100%;
    .search-item {
      display: inline-block;
      height: 36px;
      line-height: 36px;
      border-bottom: 1px dashed $color-white-tint;
      @media screen and (min-width: $screen-sm) and (max-width: $screen-md) {
        width: 33%;
        .search-input {
          width: 110px !important;
        }
        el-date-editor,.el-range-editor,.el-input__inner,.el-date-editor--daterange,.el-range-editor--mini{
          width:110px !important;
        }
        el-select,.el-select--mini{
          width:110px !important;
        }
        el-date-editor,.el-input el-input--mini,.el-input--prefix,.el-input--suffix,.el-date-editor--year{
          width:110px;
        }
      }
      @media screen and (min-width: $screen-md) and (max-width: $screen-lg) {
        width: 33%;
        .search-title{
          width:114px !important;
        }
      }
      @media screen and (min-width: $screen-lg) and (max-width: $screen-xl) {
        width: 32%;
      }
      @media screen and (min-width: $screen-xl) {
        width: 20%;
      }
      .search-title {
        display: block;
        float: left;
        font-size:13px;
        width: 116px;
        box-sizing: border-box;
        text-align: right;
      }
      .search-input {
        width: 140px;
      }
      el-date-editor,.el-range-editor,.el-input__inner,.el-date-editor--daterange,.el-range-editor--mini{
        width:201px;
      }
      el-select,.el-select--mini{
        width:140px;
      }
      el-date-editor,.el-input el-input--mini,.el-input--prefix,.el-input--suffix,.el-date-editor--year{
        width:140px;
      }
    }
  }

  .more-box {
    text-align: center;
    position: relative;
    top: -1px;
    margin-bottom: 8px;
    border-top: 1px solid $color-white-tint;
    .more-btn {
      display: inline-block;
      position: relative;
      margin-top: -1px;
      height: 28px;
      line-height: 28px;
      padding: 0 20px;
      border: 1px solid $color-white-tint;
      border-top-color: $color-white;
      cursor: pointer;
      font-size: 15px;
      font-weight: 700;
      color: #8f9196;
      .fa-icon {
        margin-left: 5px;
      }
    }
    &:hover {
      border-color: $color-primary-active;
      .more-btn {
        color: $color-primary-active;
        border-color: $color-primary-active;
        border-top-color: $color-white;
      }
    }
  }
</style>
