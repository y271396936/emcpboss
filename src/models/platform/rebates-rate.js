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
    name: 'customerGenre',
    title: '客户类型',
    placeholder: '--请选择账户类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '销售客户'},
        {value: 2, label: '渠道客户'}
      ]
    }
  }, {
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'platformId',
    title: '所属平台',
    placeholder: '--请选择所属平台--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: platforms
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.customerTitle = ''
    this.customerGenre = ''
    this.platformId = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.customerId = ''
    this.platformId = ''
    this.planTypeId = ''
    this.rate = ''
    this.originRate = ''
    this.effectiveType = ''
  }
}

class Remote {
  constructor () {
    this.customer = {
      loading: false,
      list: []
    }
    this.item = {
      loading: false,
      list: []
    }
    this.channel = {
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
