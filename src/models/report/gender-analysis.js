/**
 *Created by Heqi on 2018/4/25.
 */

import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import moment from 'moment'

let date = []
date[0] = moment().subtract(1, 'days').format('YYYY-MM-DD')
date[1] = date[0]

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
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
    name: 'gender',
    title: '性别',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '0', label: '未知'},
        {value: '1', label: '男'},
        {value: '2', label: '女'}
      ]
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
    name: 'industry',
    title: '行业',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.startTime = ''
    this.endTime = ''
    this.gender = ''
    this.itemTitle = ''
    this.channel = ''
    this.accountTitle = ''
    this.industry = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
