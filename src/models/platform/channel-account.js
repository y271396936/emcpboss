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
    name: 'genre',
    title: '账户类型',
    placeholder: '--请选择账户类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 0, label: '无忧户'},
        {value: 1, label: '服务户'}
      ]
    }
  },
  {
    name: 'name',
    title: '帐户名',
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
    visible: false,
    config: {
      list: [
        {value: -1, label: '已下稿'},
        {value: 0, label: '无效'},
        {value: 1, label: '有效'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.platformId = ''
    this.genre = ''
    this.name = ''
    this.status = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.platformId = ''
    this.name = ''
    this.password = ''
    this.genre = ''
    this.company = ''
    this.copyrightUrl = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
