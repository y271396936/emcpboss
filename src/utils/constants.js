// Search 组件的搜索框类型
export const CONDITION_TYPE = {
  TEXT: 'text',
  SELECT: 'select',
  TIME: 'time',
  DATE: 'date',
  DATETIME: 'datetime',
  SELECT_GROUP: 'select_group'
}

// Search 组件的时间显示类型
export const DATE_PICKER_SHOW_TYPE = {
  YEAR: 'year',
  MONTH: 'month',
  DATE: 'date',
  WEEK: 'week',
  DATETIME: 'datetime',
  DATETIME_RANGE: 'datetimerange',
  DATE_RANGE: 'daterange'
}

// 平台列表
export const PLATFORM_LIST = [
  {id: 1, title: '百度', status: 1},
  {id: 2, title: '360', status: 1},
  {id: 3, title: '搜狗', status: 1},
  {id: 4, title: '神马', status: 1},
  {id: 5, title: '陌陌', status: 1},
  {id: 6, title: '今日头条', status: 1},
  {id: 7, title: 'UC头条', status: 1},
  {id: 8, title: '腾讯', status: 1},
  {id: 9, title: '58', status: 1},
  {id: 10, title: '一点资讯', status: 1},
  {id: 11, title: '知乎', status: 1}
]

// 服务列表
export const SERVICE_LIST = [
  {id: 1, title: '首联反馈', status: 1}
]

// session key
export const SESSION_KEY = {
  USER: 'user',
  PERMS: 'perms'
}
