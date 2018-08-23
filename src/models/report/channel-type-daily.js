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
      type: DATE_PICKER_SHOW_TYPE.MONTH,
      format: 'yyyy-MM',
      valueFormat: 'yyyy-MM'
    }
  }, {
    name: 'dataType',
    title: '数据类型',
    placeholder: '--请选择数据类型--',
    type: CONDITION_TYPE.SELECT,
    value: '总消费点数',
    visible: true,
    config: {
      list: [
        {value: 1, label: '总消费点数'},
        {value: 2, label: '总消费金额'},
        {value: 3, label: '总利润'},
        {value: 4, label: '总服务费'}
      ]
    }
  }, {
    name: 'platformId',
    title: '所属平台',
    placeholder: '--请选择所属平台--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: platforms
    }
  }, {
    name: 'typeId',
    title: '渠道类型',
    placeholder: '--请选择渠道类型--',
    type: CONDITION_TYPE.SELECT,
    value: '传统搜索',
    visible: true,
    config: {
      list: [
        {value: 1, label: '传统搜索'},
        {value: 2, label: '信息流'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.year = ''
    this.month = ''
    this.dataType = ''
    this.platformId = ''
    this.typeId = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
