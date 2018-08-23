import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '@/utils/constants'
import moment from 'moment'

const platforms = []
PLATFORM_LIST.forEach(item => {
  platforms.push({
    value: item.id, label: item.title
  })
})
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
    name: 'channel',
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
    name: 'netWork',
    title: '网络类型',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
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
        {value: 1, label: '项目名-渠道-网络'},
        {value: 2, label: '项目名-账户-网络'}
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
    this.network = ''
    this.orderBy = ''
    this.dataGroup = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
