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
    title: '日期范围',
    placeholder: '',
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
    name: 'platformId',
    title: '所属平台',
    placeholder: '--请选择所属平台--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: platforms
    }
  },
  {
    name: 'accountGenre',
    title: '账户类型',
    placeholder: '--请选择账户类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '0', label: '无忧户'},
        {value: '1', label: '服务户'}
      ]
    }
  },
  {
    name: 'accountTitle',
    title: '渠道账户',
    placeholder: '渠道账户，可模糊查询',
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
    this.platformId = ''
    this.accountGenre = ''
    this.accountTitle = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
