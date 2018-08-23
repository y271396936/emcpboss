import { AbstractSearchArgument, AbstractFormArgument } from '../global'
import { CONDITION_TYPE } from '../../utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'title',
    title: '资讯标题',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },

  {
    name: 'publisher',
    title: '发布人',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'updator',
    title: '更新人',
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
    this.publisher = ''
    this.updator = ''
  }
}
class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.id = ''
    this.title = ''
    this.publisher = ''
    this.publishTime = ''
    this.updator = ''
    this.updatorTime = ''
    this.content = ''
    this.startActivityTime = ''
    this.endActivityTime = ''
    this.marketingAssortentId = ''
    this.defaultDisplay = ''
    this.display = ''
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
