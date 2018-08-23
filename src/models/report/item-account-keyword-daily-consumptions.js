import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'

const PIE_SEARCH_CONDITION = [
  {
    name: 'date',
    title: '年份',
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
    name: 'top',
    title: '排名',
    placeholder: '--请选择排名--',
    type: CONDITION_TYPE.SELECT,
    value: '前10',
    visible: true,
    config: {
      list: [
        {value: 5, label: '前5'},
        {value: 10, label: '前10'},
        {value: 15, label: '前15'},
        {value: 20, label: '前20'}
      ]
    }
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'platformId',
    title: '平台',
    placeholder: '--请选择--',
    type: CONDITION_TYPE.SELECT,
    visible: true,
    config: {
      list: [
        {value: 1, label: '百度'},
        {value: 2, label: '360'},
        {value: 3, label: '搜狗'},
        {value: 4, label: '神马'},
        {value: 5, label: '陌陌'},
        {value: 6, label: '今日头条'},
        {value: 7, label: 'UC头条'},
        {value: 8, label: '腾讯'},
        {value: 9, label: '58'},
        {value: 10, label: '一点资讯'},
        {value: 11, label: '知乎'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.year = ''
    this.month = ''
    this.itemTitle = ''
    this.keywordNatureTitle = ''
    this.top = ''
    this.platformId = ''
  }
}

export {
  PIE_SEARCH_CONDITION,
  SearchArgument
}
