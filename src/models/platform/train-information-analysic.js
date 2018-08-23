import {AbstractFormArgument, AbstractSearchArgument} from '../global'
import {CONDITION_TYPE} from '@/utils/constants'

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
    name: 'publisher',
    title: '发布人',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'updator',
    title: '更新人',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.title = ''
    this.publisher = ''
    this.updator = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.title = ''
    this.content = ''
    this.revoke = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
