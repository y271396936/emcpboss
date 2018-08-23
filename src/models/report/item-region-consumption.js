import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import moment from 'moment'

let date = []
date[0] = moment().format('YYYY-MM-01')
date[1] = moment().format('YYYY-MM-DD')

const HISTOGRAM_SEARCH_CONDITION = [
  {
    name: 'year',
    title: '年份',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.YEAR,
      format: 'yyyy',
      valueFormat: 'yyyy'
    }
  },
  {
    name: 'dataGroup',
    title: '分类方式',
    placeholder: '--请选择分类方式--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '根据省'},
        {value: 2, label: '根据市'}
      ]
    }
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '不支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'province',
    title: '省份',
    placeholder: '不支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'city',
    title: '城市',
    placeholder: '不支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  }
]

const CITY_PIE_SEARCH_CONDITION = [
  {
    name: 'date',
    title: '年份',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.MONTH,
      format: 'yyyy-MM',
      valueFormat: 'yyyy-MM'
    }
  },
  {
    name: 'top',
    title: '排名',
    placeholder: '--请选择排名--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 5, label: '前5'},
        {value: 10, label: '前10'},
        {value: 15, label: '前15'},
        {value: 20, label: '前20'}
      ]
    }
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '不支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'province',
    title: '省份',
    placeholder: '不支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  }
]

const PROVINCE_SEARCH_CONDITION = [
  {
    name: 'date',
    title: '年份',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.MONTH,
      format: 'yyyy-MM',
      valueFormat: 'yyyy-MM'
    }
  },
  {
    name: 'top',
    title: '排名',
    placeholder: '--请选择排名--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 5, label: '前5'},
        {value: 10, label: '前10'},
        {value: 15, label: '前15'},
        {value: 20, label: '前20'}
      ]
    }
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

const ANALYSIS_SEARCH_CONDITION = [
  {
    name: 'province',
    title: '省份',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'city',
    title: '城市',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'accounts',
    title: '账户',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'title',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'industry',
    title: '行业',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'channelId',
    title: '渠道',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: '8', label: '百度信息流'},
        {value: '9', label: '360信息流'},
        {value: '10', label: '今日头条信息流'},
        {value: '11', label: 'UC信息流'},
        {value: '14', label: '一点资讯信息流'}
      ]
    }
  },
  {
    name: 'day',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: date,
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.month = ''
    this.startTime = ''
    this.endTime = ''
    this.itemTitle = ''
    this.top = ''
    this.channelAccountName = ''
    this.industry = ''
    this.dataGroup = ''
    this.province = ''
    this.city = ''
    this.orderBy = ''
    this.accounts = ''
    this.title = ''
    this.industry = ''
    this.channelId = ''
    this.type = ''
    this.platformId = ''
  }
}

export {
  HISTOGRAM_SEARCH_CONDITION,
  CITY_PIE_SEARCH_CONDITION,
  PROVINCE_SEARCH_CONDITION,
  ANALYSIS_SEARCH_CONDITION,
  SearchArgument
}
