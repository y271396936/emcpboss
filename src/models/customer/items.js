/**
 *Created by Heqi on 2018/1/18.
 */

import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'title',
    title: '项目名称',
    placeholder: '项目名称，可模糊查询',
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
        {value: 1, label: '上稿中'},
        {value: 0, label: '审核中'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.title = ''
    this.status = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
