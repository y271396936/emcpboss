import {AbstractFormArgument, AbstractSearchArgument} from '../global'
import {CONDITION_TYPE} from '@/utils/constants'
import Api from '@/api/system/system-user'

const SEARCH_CONDITION = [
  {
    name: 'name',
    title: '分类名',
    placeholder: '请输入您的分类名',
    type: CONDITION_TYPE.TEXT,
    visible: true,
    value: ''
  },
  {
    name: 'publisher',
    title: '发布人',
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
          Api.optimizeLikeness({name: query}, response => {
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
    this.publisher = ''
    this.name = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.name = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
