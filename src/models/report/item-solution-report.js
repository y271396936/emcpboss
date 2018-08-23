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
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'importLogId',
    title: '导入日志ID',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
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
    name: 'accountTitle',
    title: '账户',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
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
    name: 'channelId',
    title: '推广渠道',
    placeholder: '--请选择推广渠道--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: []
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.startTime = ''
    this.endTime = ''
    this.importLogId = ''
    this.platformId = ''
    this.accountTitle = ''
    this.customerTitle = ''
    this.itemTitle = ''
    this.channelId = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
