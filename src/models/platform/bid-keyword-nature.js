import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'title',
    title: '词性名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.title = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.title = ''
    this.rule = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
