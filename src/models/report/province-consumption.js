import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

const DAILY_SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
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
    name: 'dataType',
    title: '数据类型',
    placeholder: '--请选择数据类型--',
    type: CONDITION_TYPE.SELECT,
    value: '总点击次数',
    visible: true,
    config: {
      list: [
        {value: 1, label: '总展现次数'},
        {value: 2, label: '总消费点数'},
        {value: 3, label: '总点击次数'},
        {value: 4, label: '点击率'},
        {value: 5, label: '平均点击价格'},
        {value: 6, label: '总转化数'},
        {value: 7, label: '转化成本'}
      ]
    }
  }
]

const MONTH_SEARCH_CONDITION = [
  {
    name: 'year',
    title: '年',
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
    name: 'dataType',
    title: '数据类型',
    placeholder: '--请选择数据类型--',
    type: CONDITION_TYPE.SELECT,
    value: '总点击次数',
    visible: true,
    config: {
      list: [
        {value: 1, label: '总展现次数'},
        {value: 2, label: '总消费点数'},
        {value: 3, label: '总点击次数'},
        {value: 4, label: '点击率'},
        {value: 5, label: '平均点击价格'},
        {value: 6, label: '总转化数'},
        {value: 7, label: '转化成本'}
      ]
    }
  }
]

const MONTH_PIE_SEARCH_CONDITION = [
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
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.month = ''
    this.type = ''
    this.top = ''
  }
}

export {
  DAILY_SEARCH_CONDITION,
  MONTH_SEARCH_CONDITION,
  MONTH_PIE_SEARCH_CONDITION,
  SearchArgument
}
