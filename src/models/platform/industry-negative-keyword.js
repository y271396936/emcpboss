import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, PLATFORM_LIST } from '@/utils/constants'

const platforms = []
PLATFORM_LIST.forEach(item => {
  platforms.push({
    value: item.id, label: item.title
  })
})

const SEARCH_CONDITION = [
  {
    name: 'genre',
    title: '类型',
    placeholder: '--请选择账户类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '否定词'},
        {value: 2, label: '精否词'}
      ]
    }
  }, {
    name: 'industryTitle',
    title: '行业名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'platformId',
    title: '所属平台',
    placeholder: '--请选择所属平台--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: platforms
    }
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
        {value: -10, label: '已删除'},
        {value: 0, label: '无效'},
        {value: 1, label: '有效'},
        {value: 2, label: '已审阅'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.genre = ''
    this.industryTitle = ''
    this.platformId = ''
    this.status = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.industryId = ''
    this.platformId = ''
    this.genre = ''
    this.title = ''
    this.keywords = ''
    this.status = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
