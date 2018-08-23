import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'libraryId',
    title: '词库ID',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'industry',
    title: '所属行业',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'libraryTitle',
    title: '品类',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'word',
    title: '关键词',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'status',
    title: '状态',
    placeholder: '--请选择状态--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 0, label: '无效'},
        {value: 1, label: '有效'}
      ]
    }
  },
  {
    name: 'wordAttribute',
    title: '关键词属性',
    placeholder: '--请选择状态--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '新加词'},
        {value: 2, label: '搜索词'},
        {value: 3, label: '大流量词'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.libraryId = ''
    this.industry = ''
    this.libraryTitle = ''
    this.word = ''
    this.status = ''
    this.wordAttribute = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.libraryId = ''
    this.word = ''
    this.tag = ''
    this.keywords = ''
    this.status = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
