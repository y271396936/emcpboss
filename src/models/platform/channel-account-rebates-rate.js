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
    title: '账户名',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'channelTitle',
    title: '推广渠道',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '百度竞价', label: '百度竞价'},
        {value: '百度网盟', label: '百度网盟'},
        {value: '360竞价', label: '360竞价'},
        {value: '搜狗竞价', label: '搜狗竞价'},
        {value: '神马竞价', label: '神马竞价'},
        {value: '百度信息流', label: '百度信息流'},
        {value: '360信息流', label: '360信息流'},
        {value: '今日头条信息流', label: '今日头条信息流'},
        {value: 'UC信息流', label: 'UC信息流'},
        {value: '搜狗银河', label: '搜狗银河'},
        {value: '广点通', label: '广点通'},
        {value: '一点资讯信息流', label: '一点资讯信息流'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.platformId = ''
    this.accountTitle = ''
    this.channelTitle = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.channelId = ''
    this.clientId = ''
    this.accountId = ''
    this.rate = ''
    this.originRate = ''
  }
}

class Remote {
  constructor () {
    this.account = {
      loading: false,
      list: []
    }
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument,
  Remote
}
