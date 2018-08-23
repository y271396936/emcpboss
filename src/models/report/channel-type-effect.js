/**
 *Created by Heqi on 2018/3/16.
 */
import ItemApi from '@/api/platform/item'
import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

const HISTOGRAM_SEARCH_CONDITION = [
  {
    name: 'year',
    title: '年份',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.YEAR,
      format: 'yyyy',
      valueFormat: 'yyyy'
    }
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '请输入关键词',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [],
      remote: {
        enabled: true,
        loading: false,
        method: (query) => {
          const myself = HISTOGRAM_SEARCH_CONDITION[1]
          myself.config.remote.loading = true

          if (query === '' || query.length === 0) {
            myself.config.list = []
            myself.config.remote.loading = false
            return
          }

          ItemApi.likeness({title: query, pageSize: 100}, response => {
            let status = response.status || 0
            let body = response.data || []
            if (status >= 200 && status <= 204) {
              const list = []
              body.forEach(item => {
                list.push({value: item.title, label: item.title})
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
    name: 'dataType',
    title: '类型',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '展现'},
        {value: 2, label: '消费'},
        {value: 3, label: '点击'},
        {value: 4, label: '点击率'},
        {value: 5, label: '平均点击价格'},
        {value: 6, label: '转化'},
        {value: 7, label: '转化成本'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.top = ''
    this.dataType = ''
  }
}

export {
  HISTOGRAM_SEARCH_CONDITION,
  SearchArgument
}
