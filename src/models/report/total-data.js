import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
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
    name: 'dataType',
    title: '数据类型',
    placeholder: '--请选择数据类型--',
    type: CONDITION_TYPE.SELECT,
    value: '消费',
    visible: true,
    config: {
      list: [
        {value: 1, label: '展现'},
        {value: 2, label: '消费'},
        {value: 3, label: '点击'},
        {value: 4, label: '点击率'},
        {value: 5, label: '平均点击价格'},
        {value: 6, label: '转化'},
        {value: 7, label: '转化成本'}
      ]
    }
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '不支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
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

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.month = ''
    this.top = ''
    this.itemTitle = ''
    this.province = ''
    this.type = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
