import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import moment from 'moment'

let date = []
date[0] = moment().format('YYYY-MM-01')
date[1] = moment().format('YYYY-MM-DD')

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: date,
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'itemTitle',
    title: '项目名',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'channel',
    title: '推广渠道',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '百度信息流', label: '百度信息流'},
        {value: '360信息流', label: '360信息流'},
        {value: '今日头条信息流', label: '今日头条信息流'},
        {value: 'UC信息流', label: 'UC信息流'},
        {value: '一点资讯信息流', label: '一点资讯信息流'}
      ]
    }
  },
  {
    name: 'accountTitle',
    title: '账户',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'ageRange',
    title: '年龄范围',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: '1-18岁', label: '1-18岁'},
        {value: '18-23岁', label: '18-23岁'},
        {value: '24-30岁', label: '24-30岁'},
        {value: '31-40岁', label: '31-40岁'},
        {value: '41-50岁', label: '41-50岁'},
        {value: '50岁以上', label: '50岁以上'},
        {value: '其他', label: '其他'}
      ]
    }
  },
  {
    name: 'orderBy',
    title: '排序',
    placeholder: '--请选择排序--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '按展现倒序'},
        {value: 2, label: '按点击倒序'},
        {value: 3, label: '按消费倒序'}
      ]
    }
  },
  {
    name: 'dataGroup',
    title: '数据合并',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '项目名-账户-年龄'},
        {value: 2, label: '项目名-渠道-年龄'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.startTime = ''
    this.endTime = ''
    this.itemTitle = ''
    this.platformId = ''
    this.channel = ''
    this.accountTitle = ''
    this.ageRange = ''
    this.orderBy = ''
    this.dataGroup = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
