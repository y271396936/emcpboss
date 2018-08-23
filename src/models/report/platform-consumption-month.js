import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '@/utils/constants'

const platforms = []
PLATFORM_LIST.forEach(item => {
  platforms.push({
    value: item.id, label: item.title
  })
})

const SEARCH_CONDTION = [
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
        {value: 3, label: '总服务费'}
      ]
    }
  },
  {
    name: 'platformId',
    title: '所属平台',
    placeholder: '--请选择所属平台--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: platforms
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.year = ''
    this.dataType = ''
    this.platformId = ''
  }
}

export {
  SEARCH_CONDTION,
  SearchArgument
}
