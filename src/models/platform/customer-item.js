import { AbstractFormArgument, AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, PLATFORM_LIST } from '@/utils/constants'
import Api from '@/api/system/system-user'

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
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '销售客户'},
        {value: 2, label: '渠道客户'}
      ]
    }
  },
  {
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'title',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'industryTitle',
    title: '行业',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }, {
    name: 'saler',
    title: '销售经理',
    placeholder: '请输入关键词',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [],
      remote: {
        enabled: true,
        loading: false,
        method: (query) => {
          const myself = SEARCH_CONDITION[4]
          myself.config.remote.loading = true

          if (query === '' || query === undefined) {
            myself.config.list = []
            myself.config.remote.loading = false
          }
          Api.salesLikeness({name: query}, response => {
            let status = response.status || 0
            let body = response.data.list || []
            if (status >= 200 && status <= 204) {
              let list = []
              body.forEach(item => {
                list.push({value: item, label: item})
              })
              myself.config.list = list
            }
            myself.config.remote.loading = false
          })
        }
      }
    }
  }, {
    name: 'server',
    title: '客服专员',
    placeholder: '请输入关键词',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [],
      remote: {
        enabled: true,
        loading: false,
        method: (query) => {
          const myself = SEARCH_CONDITION[5]
          myself.config.remote.loading = true

          if (query === '' || query === undefined) {
            myself.config.list = []
            myself.config.remote.loading = false
          }
          Api.serviceLikeness({name: query}, response => {
            let status = response.status || 0
            let body = response.data.list || []
            if (status >= 200 && status <= 204) {
              let list = []
              body.forEach(item => {
                list.push({value: item, label: item})
              })
              myself.config.list = list
            }
            myself.config.remote.loading = false
          })
        }
      }
    }
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
        {value: 1, label: '上稿中'},
        {value: 0, label: '无效'},
        {value: -1, label: '已下稿'},
        {value: -2, label: '暂停'},
        {value: -3, label: '下稿申请中'},
        {value: -4, label: '暂停申请中'},
        {value: -5, label: '无效申请中'}
      ]
    }
  },
  {
    name: 'other',
    title: '其他',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '未指定行业'},
        {value: 2, label: '未制定推广方向'},
        {value: 3, label: '客户未提交问卷'},
        {value: 4, label: '客户已提交问卷'}
      ]
    }
  }, {
    name: 'orderBy',
    title: '排序',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '客服跟进排序'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.customerGenre = ''
    this.customerTitle = ''
    this.title = ''
    this.industryTitle = ''
    this.saler = ''
    this.server = ''
    this.status = ''
    this.other = ''
    this.orderBy = ''
    this.id = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.customerId = ''
    this.itemId = ''
    this.genre = ''
    this.title = ''
    this.salerId = ''
    this.budget = ''
    this.serverId = ''
    this.website = ''
    this.address = ''
    this.trailWay = ''
    this.trailContent = ''
    this.contacts = ''
    this.mobile = ''
    this.duty = ''
    this.acquiescent = ''
    this.phone = ''
    this.qq = ''
    this.wechat = ''
    this.email = ''
    this.address = ''
    this.reason = ''
    this.industryId = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
