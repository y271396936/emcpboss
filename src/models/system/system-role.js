import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'departmentId',
    title: '所属部门',
    placeholder: '--请选择所属部门--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: []
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.departmentId = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.departmentId = ''
    this.title = ''
    this.ename = ''
    this.dataScope = ''
    this.perms = []
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
