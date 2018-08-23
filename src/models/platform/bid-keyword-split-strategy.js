import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'condition1',
    title: '条件1',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true

  }, {
    name: 'condition2',
    title: '条件2',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'condition3',
    title: '条件3',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'condition4',
    title: '条件4',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'orderBy',
    title: '排序',
    placeholder: '--请选择排序方式--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '按权重'},
        {value: 0, label: '按ID'}
      ]
    }
  }, {
    name: 'status',
    title: '状态',
    placeholder: '--请选择状态--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '有效'},
        {value: 0, label: '无效'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.condition1 = ''
    this.condition2 = ''
    this.condition3 = ''
    this.condition4 = ''
    this.orderBy = ''
    this.status = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.libraryId = ''
    this.weight = ''
    this.condition1 = ''
    this.condition2 = ''
    this.condition3 = ''
    this.condition4 = ''
    this.status = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
