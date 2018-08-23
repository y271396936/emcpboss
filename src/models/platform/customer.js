import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '../../utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'genre',
    title: '客户类型',
    placeholder: '--请选择客户类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '销售客户'},
        {value: 2, label: '渠道客户'}
      ]
    }
  },
  {
    name: 'title',
    title: '客户名称',
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
        {value: 1, label: '上稿客户'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.genre = ''
    this.title = ''
    this.status = ''
  }
}

class MonthGrowthSearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.day = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.salerId = ''
    this.genre = ''
    this.title = ''
    this.money = ''
    this.contacts = ''
    this.mobile = ''
    this.status = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  MonthGrowthSearchArgument,
  FormArgument
}
