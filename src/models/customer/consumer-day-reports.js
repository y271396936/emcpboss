/**
 *Created by Heqi on 2018/1/17.
 */

import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import moment from 'moment'

const year = new Date().getFullYear()
const lastMonth = moment().subtract(1, 'months').format('MM')

const SEARCH_CONDITION1 = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: year + '-' + lastMonth,
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
    name: 'itemId',
    title: '项目',
    placeholder: '- - - 请选择项目 - - -',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: []
    }
  }
]

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: year + '-' + lastMonth,
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
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'status',
    title: '状态',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '上稿中'},
        {value: 0, label: '无效'},
        {value: -1, label: '已下稿'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.status = ''
    this.itemId = ''
    this.year = ''
    this.month = ''
    this.dataType = ''
    this.itemTitle = ''
    this.status = ''
  }
}

export {
  SEARCH_CONDITION,
  SEARCH_CONDITION1,
  SearchArgument
}
