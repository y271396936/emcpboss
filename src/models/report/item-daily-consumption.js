import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import Api from '@/api/system/system-user'

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期范围',
    placeholder: '',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'customerGenre',
    title: '客户类型',
    placeholder: '--请选择客户类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '1', label: '销售客户'},
        {value: '2', label: '渠道客户'}
      ]
    }
  },
  {
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '客户名称，可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '项目名称，可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'itemSaler',
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
  }
]

const SALER_SEARCH_CONDITION = [
  {
    name: 'date',
    title: '月份',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.MONTH,
      format: 'yyyy-MM',
      valueFormat: 'yyyy-MM'
    }
  },
  {
    name: 'dataType',
    title: '数据类型',
    placeholder: '-数据类型-',
    type: CONDITION_TYPE.SELECT,
    value: '总消费点数',
    visible: true,
    config: {
      list: [
        {value: 1, label: '总消费点数'},
        {value: 2, label: '总消费现金'},
        {value: 3, label: '总服务费'},
        {value: 4, label: '产品总消费点数'},
        {value: 5, label: '产品总消费现金'},
        {value: 6, label: '竞品总消费点数'},
        {value: 7, label: '竞品总消费现金'}
      ]
    }
  },
  {
    name: 'other',
    title: '过滤离职人员',
    placeholder: '过滤条件',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '过滤离职销售'}
      ]
    }
  }
]

class ItemSearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.startTime = ''
    this.endTime = ''
    this.customerGenre = ''
    this.customerTitle = ''
    this.itemTitle = ''
    this.itemSaler = ''
  }
}

class SalerSearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.month = ''
    this.dataType = ''
    this.other = ''
  }
}

export {
  SEARCH_CONDITION,
  SALER_SEARCH_CONDITION,
  ItemSearchArgument,
  SalerSearchArgument
}
