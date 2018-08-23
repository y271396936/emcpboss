import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '../../utils/constants'
import Api from '@/api/system/system-user'

const SEARCH_CONDITION = [
  {
    name: 'customerGenre',
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
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'itemStatus',
    title: '项目状态',
    placeholder: '--请选择项目状态--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: -1, label: '已下稿'},
        {value: 0, label: '无效'},
        {value: 1, label: '上稿中'}
      ]
    }
  },
  {
    name: 'maxMoney',
    title: '现金金额',
    type: CONDITION_TYPE.TEXT,
    slots: {
      prepend: '小于等于',
      append: '元'
    },
    value: '',
    visible: false
  },
  {
    name: 'maxCostDay',
    title: '可消费天数',
    type: CONDITION_TYPE.TEXT,
    slots: {
      prepend: '可消费不足',
      append: '天'
    },
    value: '',
    visible: false
  },
  {
    name: 'other',
    title: '其它',
    placeholder: '--请选择其它--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '只显示昨日消费'}
      ]
    }
  },
  {
    name: 'orderBy',
    title: '排序',
    placeholder: '--请选择排序--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '按昨日消费倒序'},
        {value: 2, label: '按可消费天数倒序'},
        {value: 3, label: '按现金金额倒序'}
      ]
    }
  },
  {
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
          const myself = SEARCH_CONDITION[8]
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
  },
  {
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
          const myself = SEARCH_CONDITION[9]
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
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.customerGenre = ''
    this.customerTitle = ''
    this.itemTitle = ''
    this.saler = ''
    this.server = ''
    this.itemStatus = ''
    this.maxMoney = ''
    this.maxCostDay = ''
    this.other = ''
    this.orderBy = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
