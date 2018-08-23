import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, PLATFORM_LIST, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import moment from 'moment'

const platforms = []
PLATFORM_LIST.forEach(item => {
  platforms.push({
    value: item.id, label: item.title
  })
})

let date = []
date[0] = moment().format('YYYY-MM-01')
date[1] = moment().format('YYYY-MM-DD')

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: date,
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  }, {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
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
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.startTime = ''
    this.endTime = ''
    this.itemTitle = ''
    this.platformId = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.feedback = ''
    this.visitor = ''
    this.talk = ''
    this.phone = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
