import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'flatId',
    title: '平台',
    placeholder: '--请选择平台类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '竞价'},
        {value: 2, label: '百度信息流'},
        {value: 3, label: '360信息流'},
        {value: 4, label: '今日头条信息流'},
        {value: 5, label: 'UC信息流'},
        {value: 6, label: '一点资讯信息流'}
      ]
    }
  }, {
    name: 'idea',
    title: '创意',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'status',
    title: '状态',
    placeholder: '--请选择状态--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 0, label: '未使用'},
        {value: 1, label: '已使用'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.flatId = ''
    this.idea = ''
    this.status = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.flatId = ''
    this.ideaType = ''
    this.idea = ''
    this.idea1 = ''
    this.idea2 = ''

    this.clientId = ''
    this.channelId = ''
    this.accountId = ''
    this.itemId = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
