import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'title',
    title: '标题',
    placeholder: '请输入',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'publisher',
    title: '发布人',
    placeholder: '请输入',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.departmentId = ''
    this.typeId = ''
    this.type = ''
    this.title = ''
    this.publisher = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.departmentId = ''
    this.typeId = ''
    this.type = ''
    this.title = ''
    this.content = ''
    this.token = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
