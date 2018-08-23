import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'year',
    title: '年份',
    type: CONDITION_TYPE.DATE,
    value: new Date().getFullYear().toString(),
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
    value: '总点数',
    visible: true,
    config: {
      list: [
        {value: 1, label: '总点数'},
        {value: 2, label: '总金额'},
        {value: 3, label: '总服务费'},
        {value: 4, label: '产品消费总点数'},
        {value: 5, label: '产品消费总金额'},
        {value: 6, label: '竞品消费总点数'},
        {value: 7, label: '竞品消费总金额'}
      ]
    }
  },
  {
    name: 'customerGenre',
    title: '客户类型',
    placeholder: '--请选择客户类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '销售客户'},
        {value: 2, label: '渠道客户'}
      ]
    }
  }, {
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  }, {
    name: 'title',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  }, {
    name: 'status',
    title: '状态',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '上稿中'},
        {value: -1, label: '已下稿'},
        {value: 0, label: '无效'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.dataType = ''
    this.customerGenre = ''
    this.customerTitle = ''
    this.title = ''
    this.status = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
