import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '../../utils/constants'

const SEARCH_ENGINES = {
  'baidu.com': '百度',
  'soso.com': '搜搜',
  'sogou.com': '搜狗',
  'so.com': '360',
  'sm.cn': '神马',
  'yahoo.com': '雅虎',
  'google.com': '谷歌',
  'bing.com': '必应'
}

const GENRES = {
  1: '竞价推广',
  2: '品牌推广',
  3: '手机官网',
  4: '微信游戏',
  5: '手机资料包'
}

const TEMPLATE_STYLES = {
  1: 'PC普通模板',
  2: 'PC底部悬浮模板',
  3: '手机普通模板',
  4: 'PC简洁模板'
}

const SEARCH_CONDITION = [
  {
    name: 'time',
    title: '留言时间',
    placeholder: '',
    type: CONDITION_TYPE.DATE,
    value: '',
    visible: false,
    config: {
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
  },
  {
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'source',
    title: '自定来源',
    placeholder: '须填全部内容',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'clientId',
    title: '推广渠道',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '1', label: 'PC端'},
        {value: '2', label: '手机端'},
        {value: '3', label: 'APP端'}
      ]
    }
  },
  {
    name: 'searchWord',
    title: '搜索词',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'genreId',
    title: '留言板类型',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: '-888', label: '测试留言'},
        {value: '1', label: '竞价推广'},
        // {value: '2', label: '品牌推广'},
        {value: '3', label: '手机官网'},
        {value: '4', label: '微信游戏'}
      ]
    }
  },
  {
    name: 'templateStyle',
    title: '模板样式',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: '1', label: 'PC 普通模板'},
        {value: '4', label: 'PC 简洁模板'},
        {value: '2', label: 'PC 底部悬浮模板'},
        {value: '3', label: '手机 普通模板'}
      ]
    }
  },
  {
    name: 'readStatus',
    title: '是否已读',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: '1', label: '已读'},
        {value: '0', label: '未读'}
      ]
    }
  }
]

class FeedbackSearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.startTime = ''
    this.endTime = ''
    this.itemTitle = ''
    this.itemSolutionId = null
    this.customerTitle = ''
    this.source = ''
    this.clientId = null
    this.genreId = null
    this.templateStyle = ''
    this.status = null
    this.readStatus = null
    this.searchWord = ''
  }
}

export {
  SEARCH_ENGINES,
  GENRES,
  TEMPLATE_STYLES,
  SEARCH_CONDITION,
  FeedbackSearchArgument
}
