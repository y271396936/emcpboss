import { AbstractSearchArgument } from '../global'
import { CONDITION_TYPE, DATE_PICKER_SHOW_TYPE } from '@/utils/constants'
import Api from '@/api/system/system-user'

const SEARCH_CONDITION = [
  {
    name: 'dataDay',
    title: '数据日期',
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
    name: 'date',
    title: '操作时间',
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
    name: 'id',
    title: 'ID',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  },
  {
    name: 'typeId',
    title: '数据类型',
    placeholder: '--请选择数据类型--',
    type: CONDITION_TYPE.SELECT_GROUP,
    value: '',
    visible: true,
    config: [
      {
        label: '百度',
        options: [
          {value: 1, label: '百度PC'},
          {value: 7, label: '百度信息流'},
          {value: 2, label: '百度网盟'}
        ]
      }, {
        label: '360',
        options: [
          {value: 3, label: '360竞价'},
          {value: 8, label: '360信息流'}
        ]
      }, {
        label: '搜狗',
        options: [
          {value: 4, label: '搜狗竞价'},
          {value: 11, label: '搜狗银河'}
        ]
      }, {
        label: '神马',
        options: [
          {value: 5, label: '神马竞价'}
        ]
      }, {
        label: '陌陌',
        options: [
          {value: 6, label: '陌陌'}
        ]
      }, {
        label: '今日头条',
        options: [
          {value: 9, label: '今日头条信息流'}
        ]
      }, {
        label: 'UC头条',
        options: [
          {value: 10, label: 'UC信息流'}
        ]
      }
    ]
  },
  {
    name: 'reportGenre',
    title: '报告类型',
    placeholder: '--请选择报告类型--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '关键词汇总报告'},
        {value: 2, label: '地域报告'},
        {value: 3, label: '分时报告'},
        {value: 4, label: '搜索词报告'},
        {value: 5, label: '操作系统报告'},
        {value: 6, label: '年龄报告'},
        {value: 7, label: '兴趣报告'},
        {value: 8, label: '性别报告'},
        {value: 9, label: '平台报告'},
        {value: 10, label: '网络报告'},
        {value: 11, label: '学历报告'},
        {value: 12, label: '头条位置报告'},
        {value: 14, label: '意图词报告'}
      ]
    }
  },
  {
    name: 'rollbacked',
    title: '是否回退',
    placeholder: '--请选择是否回退--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: 0, label: '未回退'},
        {value: 1, label: '已回退'}
      ]
    }
  },
  {
    name: 'rollbackTime',
    title: '回退时间',
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
    name: 'operator',
    title: '操作者',
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
          const myself = SEARCH_CONDITION[7]
          myself.config.remote.loading = true

          if (query === '' || query === undefined) {
            myself.config.list = []
            myself.config.remote.loading = false
          }
          Api.operatorLikeness({name: query}, response => {
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
    name: 'accountTitle',
    title: '账户',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: false
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.startTime = ''
    this.endTime = ''
    this.id = ''
    this.typeId = ''
    this.reportGenre = ''
    this.rollbacked = ''
    this.startRollbackTime = ''
    this.endRollbackTime = ''
    this.operator = ''
    this.accountTitle = ''
    this.dataDay = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument
}
