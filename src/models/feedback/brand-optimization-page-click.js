import {AbstractSearchArgument} from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import moment from 'moment'

let time = []
time[0] = moment().format('YYYY-MM-01')
time[1] = moment().format('YYYY-MM-DD')
const SEARCH_CONDITION = [
  {
    name: 'time',
    title: '日期范围',
    placeholder: '',
    type: CONDITION_TYPE.DATE,
    value: time,
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  }, {
    name: 'customerTitle',
    title: '客户名',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true,
    config: {
      list: []
    }
  }, {
    name: 'type',
    title: '服务类型',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '培训服务'},
        {value: 2, label: '品牌策划'},
        {value: 3, label: '全网营销'},
        {value: 4, label: '提供建议'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.startDay = ''
    this.endDay = ''
    this.pageTitle = ''
    this.customerTitle = ''
    this.type = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument

}
