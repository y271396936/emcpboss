import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '@/utils/constants'

const platforms = []
PLATFORM_LIST.forEach(item => {
  platforms.push({
    value: item.id, label: item.title
  })
})

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'importLogId',
    title: '导入日志ID',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'platformId',
    title: '推广平台',
    placeholder: '--请选择推广平台--',
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
        {value: '一点资讯信息流', label: '一点资讯信息流'},
        {value: '知乎信息流', label: '知乎信息流'},
        {value: '陌陌信息流', label: '陌陌信息流'}
      ]
    }
  },
  {
    name: 'accountTitle',
    title: '账户',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'network',
    title: '网络',
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
  }
]

const MONTH_REPORT_SEARCH_CONDITION = [
  {
    name: 'year',
    title: '年份',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.YEAR
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
        {value: '百度信息流', label: '百度信息流'},
        {value: '360信息流', label: '360信息流'},
        {value: '今日头条信息流', label: '今日头条信息流'},
        {value: 'UC信息流', label: 'UC信息流'},
        {value: '广点通', label: '广点通'},
        {value: '一点资讯信息流', label: '一点资讯信息流'},
        {value: '知乎信息流', label: '知乎信息流'},
        {value: '陌陌信息流', label: '陌陌信息流'}
      ]
    }
  },
  {
    name: 'industry',
    title: '行业',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'dataGroup',
    title: '合并',
    placeholder: '--请选择合并方式--',
    type: CONDITION_TYPE.SELECT,
    value: '按渠道合并',
    visible: true,
    config: {
      list: [
        {value: 1, label: '按渠道合并'},
        {value: 2, label: '按行业合并'}
      ]
    }
  },
  {
    name: 'orderBy',
    title: '排序',
    placeholder: '--请选择排序--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '按展现倒序'},
        {value: 2, label: '按点击倒序'},
        {value: 3, label: '按消费倒序'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.date = ''
    this.importLogId = ''
    this.platformId = ''
    this.accountTitle = ''
    this.itemTitle = ''
    this.network = ''
    this.orderBy = ''
    this.channel = ''
    this.year = ''
    this.dataGroup = ''
    this.industry = ''
  }
}
class TimeShareSearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.date = ''
    this.orderBy = ''
    this.channel = ''
    this.year = ''
    this.dataGroup = ''
    this.industry = ''
  }
}

export {
  SEARCH_CONDITION,
  MONTH_REPORT_SEARCH_CONDITION,
  SearchArgument,
  TimeShareSearchArgument
}
