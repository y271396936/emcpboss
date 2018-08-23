import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
const SEARCH_CONDITION = [
  {
    name: 'year',
    title: '年份',
    placeholder: '',
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
    value: '总消费点数',
    visible: true,
    config: {
      list: [
        {value: '1', label: '总消费点数'},
        {value: '2', label: '总消费金额'},
        {value: '3', label: '总利润'},
        {value: '4', label: '总服务费'}
      ]
    }
  },
  {
    name: 'title',
    title: '项目名称',
    placeholder: '项目名称，可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'typeId',
    title: '渠道类型',
    placeholder: '--请选择渠道类型--',
    type: CONDITION_TYPE.SELECT,
    value: '传统搜索',
    visible: true,
    config: {
      list: [
        {value: '1', label: '传统搜索'},
        {value: '2', label: '信息流'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.year = ''
    this.dataType = ''
    this.title = ''
    this.typeId = ''
  }
}

export {
  SearchArgument,
  SEARCH_CONDITION
}
