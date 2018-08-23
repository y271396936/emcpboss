import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE, PLATFORM_LIST } from '@/utils/constants'

const platforms = []
PLATFORM_LIST.forEach(item => {
  platforms.push({
    value: item.id, label: item.title
  })
})

const SEARCH_CONDITION = [
  {
    name: 'platformId',
    title: '所属平台',
    placeholder: '--请选择所属平台--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: platforms
    }
  },
  {
    name: 'accountTitle',
    title: '渠道账户',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'moneyStatus',
    title: '余额状态',
    placeholder: '--请选择余额状态--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '已欠费'},
        {value: 2, label: '零余额'},
        {value: 3, label: '不足1天消费（不含零余额）'},
        {value: 4, label: '不足3天消费（不含零余额）'},
        {value: 5, label: '不足5天消费（不含零余额）'},
        {value: 6, label: '不足7天消费（不含零余额）'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.platformId = ''
    this.accountTitle = ''
    this.moneyStatus = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.channelId = ''
    this.money = ''
    this.coin = ''
    this.reason = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
