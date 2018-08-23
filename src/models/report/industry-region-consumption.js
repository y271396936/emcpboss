import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

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
    name: 'industry',
    title: '行业',
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

const PIE_SEARCH_CONDITION = [
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
    value: '前10',
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
    name: 'industry',
    title: '行业',
    placeholder: '不支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.month = ''
    this.industry = ''
    this.top = ''
    this.dataGroup = ''
    this.province = ''
    this.city = ''
    this.channelTypeId = ''
    this.type = ''
  }
}

export {
  HISTOGRAM_SEARCH_CONDITION,
  PIE_SEARCH_CONDITION,
  SearchArgument
}
