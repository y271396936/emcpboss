import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import Api from '@/api/system/system-user'
import moment from 'moment'

let date = []
date[0] = moment().format('YYYY-MM-01')
date[1] = moment().format('YYYY-MM-DD')

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '导入时间',
    type: CONDITION_TYPE.DATE,
    value: date,
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  }, {
    name: 'id',
    title: 'ID',
    placeholder: '请填写ID',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'rollbacked',
    title: '是否回退',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 0, label: '未回退'},
        {value: 1, label: '已回退'}
      ]
    }
  }, {
    name: 'time',
    title: '回退时间',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  }, {
    name: 'creator',
    title: '操作者',
    placeholder: '请输入关键词',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [],
      remote: {
        enabled: true,
        loading: false,
        method: (query) => {
          const myself = SEARCH_CONDITION[4]
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
    this.rollbacked = ''
    this.startRollbackTime = ''
    this.endRollbackTime = ''
    this.creator = ''
    this.id = ''
  }
}
export {
  SEARCH_CONDITION,
  SearchArgument
}
