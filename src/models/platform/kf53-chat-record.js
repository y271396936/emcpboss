import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '../../utils/constants'
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
  },
  {
    name: 'importLogId',
    title: '导入日志ID',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'platformId',
    title: '导入平台',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: platforms
    }

  }, {
    name: 'itemSolutionId',
    title: '项目方案ID',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'pageUrl',
    title: '咨询页面URL',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'ipProvince',
    title: '省份',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'ipCity',
    title: '城市',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'accountTitle',
    title: '账户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'referrerKeyword',
    title: '来源关键词',
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
    this.importLogId = ''
    this.platformId = ''
    this.itemSolutionId = ''
    this.itemTitle = ''
    this.pageUrl = ''
    this.ipProvince = ''
    this.ipCity = ''
    this.accountTitle = ''
    this.referrer = ''
    this.referrerKeyword = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
