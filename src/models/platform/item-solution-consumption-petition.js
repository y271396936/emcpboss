import {AbstractFormArgument, AbstractSearchArgument} from '../global'
import {CONDITION_TYPE, DATE_PICKER_SHOW_TYPE, PLATFORM_LIST} from '../../utils/constants'

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
      type: DATE_PICKER_SHOW_TYPE.DATE_RANGE,
      format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd'
    }
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
    name: 'urgencyDegree',
    title: '紧急情况',
    placeholder: '--请选择紧急情况--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: 1, label: '当天内回复'},
        {value: 2, label: '两天内回复'},
        {value: 3, label: '三天内回复'}
      ]
    }
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
    name: 'approval',
    title: '竞价审核',
    placeholder: '--请选择竞价审核--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: -1, label: '已拒绝'},
        {value: 0, label: '未审核'},
        {value: 1, label: '已审核'}
      ]
    }
  },
  {
    name: 'saleApproval',
    title: '销售审核',
    placeholder: '--请选择销售审核--',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: false,
    config: {
      list: [
        {value: -1, label: '已拒绝'},
        {value: 0, label: '未审核'},
        {value: 1, label: '和客户洽谈中'},
        {value: 2, label: '已同意'}
      ]
    }
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.itemSolutionId = ''
    this.startTime = ''
    this.endTime = ''
    this.itemTitle = ''
    this.platformId = ''
    this.urgencyDegree = ''
    this.approval = ''
    this.saleApproval = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.status = ''
    this.roleType = ''
    this.content = ''
  }
}

class BudgetFormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.itemSolutionId = ''
    this.budget = ''
    this.urgencyDegree = ''
    this.reason = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument,
  BudgetFormArgument
}
