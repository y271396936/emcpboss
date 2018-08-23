import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '../../utils/constants'
import Api from '@/api/system/system-user'

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
    name: 'timeNode',
    title: '时间节点',
    placeholder: '--请选择时间节点--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '11:00', label: '11:00'},
        {value: '12:00', label: '12:00'},
        {value: '13:00', label: '13:00'},
        {value: '14:00', label: '14:00'},
        {value: '15:00', label: '15:00'},
        {value: '16:00', label: '16:00'},
        {value: '17:00', label: '17:00'},
        {value: '18:00', label: '18:00'}
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
  },
  {
    name: 'accountTitle',
    title: '帐户名',
    placeholder: '支持模糊查询',
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
    name: 'regulatorDepartmentId',
    title: '运营小组',
    placeholder: '--请选择运营小组--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: []
    }
  },
  {
    name: 'regulator',
    title: '运营专员',
    placeholder: '请输入关键词',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [],
      remote: {
        enabled: true,
        loading: false,
        method: (query) => {
          const myself = SEARCH_CONDITION[7]
          myself.config.remote.loading = true

          if (query === '' || query === undefined) {
            myself.config.list = []
            myself.config.remote.loading = false
          }
          Api.operatorLikeness({name: query}, response => {
            let status = response.status || 0
            let body = response.data.list || []
            if (status >= 200 && status <= 204) {
              let list = []
              body.forEach(item => {
                list.push({value: item, label: item})
              })
              myself.config.list = list
            }
            myself.config.remote.loading = false
          })
        }
      }
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.startTime = ''
    this.endTime = ''
    this.timeNode = ''
    this.platformId = ''
    this.accountTitle = ''
    this.customerTitle = ''
    this.itemTitle = ''
    this.regulatorDepartmentId = ''
    this.regulator = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.costCoin = ''
    this.talk = ''
    this.phone = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
