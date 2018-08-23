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
    name: 'publishTime',
    title: '发布时间',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'publishUserName',
    title: '发布人',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'updateTime',
    title: '更新时间',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'updateUserName',
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
    this.publishTime = ''
    this.publishUserName = ''
    this.updateTime = ''
    this.updateUserName = ''
  }
}
class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.id = ''
    this.title = ''
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
