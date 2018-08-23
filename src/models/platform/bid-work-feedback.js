import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'
import Api from '@/api/system/system-user'

const SEARCH_CONDITION = [
  {
    name: 'userName',
    title: '姓名',
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
          const myself = SEARCH_CONDITION[0]
          myself.config.remote.loading = true

          if (query === '' || query === undefined) {
            myself.config.list = []
            myself.config.remote.loading = false
          }
          Api.userLikeness({name: query}, response => {
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
    name: 'atUserName',
    title: '对象姓名',
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
          const myself = SEARCH_CONDITION[1]
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
    name: 'read',
    title: '状态',
    placeholder: '--是否已读--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 0, label: '未读'},
        {value: 1, label: '已读'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.userName = ''
    this.atUserName = ''
    this.read = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.atUserName = null
    this.remark = null
    this.work = ''
    this.mindset = null
    this.proposal = null
    this.read = ''
    this.token = null
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
