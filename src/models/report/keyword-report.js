import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST } from '@/utils/constants'

const platforms = []
PLATFORM_LIST.forEach(item => {
  platforms.push({
    value: item.id, label: item.title
  })
})

const SEARCH_CONDITION = [
  {
    name: 'date',
    title: '日期',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: true,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'importLogId',
    title: '导入日志ID',
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
    name: 'accountTitle',
    title: '账户',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
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
    name: 'keyWord',
    title: '关键词',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'keywordCategoryTitle',
    title: '品类',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'keywordNatureTitle',
    title: '词性',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'dataGroup',
    title: '数据合并',
    placeholder: '--请选择数据合并方式--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 2, label: '按 方案-关键词标志 合并'}
      ]
    }
  },
  {
    name: 'orderBy',
    title: '排序',
    placeholder: '--请选择排序--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 1, label: '按转化数倒序'},
        {value: 2, label: '按转化成本顺序'},
        {value: 3, label: '按展现倒序'},
        {value: 4, label: '按点击倒序'},
        {value: 5, label: '按消费倒序'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.startTime = ''
    this.endTime = ''
    this.importLogId = ''
    this.platformId = ''
    this.accountTitle = ''
    this.customerTitle = ''
    this.itemTitle = ''
    this.keyWord = ''
    this.keywordCategoryTitle = ''
    this.keywordNatureTitle = ''
    this.dataGroup = ''
    this.orderBy = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
