import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '../../utils/constants'
import Api from '@/api/system/system-user'

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: false,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'itemName',
    title: '项目名称',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'genre',
    title: '申请类型',
    placeholder: '--请选择申请类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '下稿'},
        {value: 2, label: '暂停'},
        {value: 3, label: '无效'}
      ]
    }
  },
  {
    name: 'operator',
    title: '申请人',
    placeholder: '请输入关键词',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true,
    config: {
      list: [],
      remote: {
        enabled: true,
        loading: false,
        method: (query) => {
          const myself = SEARCH_CONDITION[6]
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
  },
  {
    name: 'saleStatus',
    title: '销售审核状态',
    placeholder: '--请选择状态--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: -1, label: '已拒绝'},
        {value: 0, label: '未审核'},
        {value: 1, label: '已同意'}
      ]
    }
  },
  {
    name: 'operrateStatus',
    title: '运营审核状态',
    placeholder: '--请选择状态--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: -1, label: '已拒绝'},
        {value: 0, label: '未审核'},
        {value: 1, label: '已同意'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.startTime = ''
    this.endTime = ''
    this.genre = ''
    this.operator = ''
    this.saleStatus = ''
    this.itemName = ''
    this.operrateStatus = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
