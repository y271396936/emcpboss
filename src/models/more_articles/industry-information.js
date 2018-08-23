import {AbstractFormArgument, AbstractSearchArgument} from '../global'
import {CONDITION_TYPE} from '@/utils/constants'
import Api from '@/api/system/system-user'

const SEARCH_CONDITION = [
  {
    name: 'title',
    title: '标题',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'publishUserName',
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
    this.title = ''
    this.publishUserName = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.type = ''
    this.title = ''
    this.picture = ''
    this.content = ''
  }
}

class IndustryArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.year = ''
    this.month = ''
    this.quarter = ''
    this.identifying = ''
  }
}

class FileFormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.category = 'editor'
    this.imgFile = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument,
  IndustryArgument,
  FileFormArgument
}
