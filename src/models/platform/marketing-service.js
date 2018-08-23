import {AbstractFormArgument, AbstractSearchArgument} from '../global'
import {CONDITION_TYPE} from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'categoryId',
    title: '类别',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: []
    }
  },
  {
    name: 'title',
    title: '标题',
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
    this.categoryId = ''
    this.type = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.categoryId = ''
    this.type = ''
    this.title = ''
    this.picture = ''
    this.content = ''
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
  FileFormArgument
}
