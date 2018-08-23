import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'industry',
    title: '行业',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'title',
    title: '品类',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'status',
    title: '状态',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 0, label: '无效'},
        {value: 1, label: '有效'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.industry = ''
    this.title = ''
    this.status = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.industry = ''
    this.title = ''
    this.status = ''
    this.firstLevel = ''
  }
}

class Remote {
  constructor () {
    this.industry = {
      loading: false,
      list: []
    }
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument,
  Remote
}
