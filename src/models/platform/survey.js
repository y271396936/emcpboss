import {AbstractFormArgument, AbstractSearchArgument} from '../global'
import {CONDITION_TYPE} from '@/utils/constants'

const SEARCH_CONDITION = [
  {
    name: 'id',
    title: 'ID',
    placeholder: '请输入完整ID',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'key',
    title: '唯一标识(key)',
    placeholder: '请输入完整key',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'itemName',
    title: '项目名称',
    placeholder: '支持模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'contacts',
    title: '联系人姓名',
    placeholder: '请填写完整姓名',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'mobile',
    title: '联系人电话',
    placeholder: '请填写完整电话',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'qq ',
    title: '联系人QQ',
    placeholder: '请填写完整QQ',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  }
]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.id = ''
    this.key = ''
    this.itemName = ''
    this.contacts = ''
    this.mobile = ''
    this.qq = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.itemName = ''
    this.webSite = ''
    this.regtime = ''
    this.brands = ''
    this.popularizeTimeSpan = ''
    this.vitalArea = ''
    this.cooperantShop = ''
    this.productOrientation = ''
    this.products = ''
    this.mainKeywords = ''
    this.emphasisKeywords = ''
    this.mainArea = ''
    this.notArea = ''
    this.popularizeTime = ''
    this.dailyBudget = ''
    this.genderRation = ''
    this.ageSegment = ''
    this.filiale = ''
    this.filialeCitys = ''
    this.joinWebSite = ''
    this.advantage = ''
    this.minInvestment = ''
    this.maxInvestment = ''
    this.joinPolicy = ''
    this.competitor = ''
    this.tvCompetitor = ''
    this.teamPeople = ''
    this.dailyMinResource = ''
    this.onlineService = ''
    this.contacts = ''
    this.qq = ''
    this.mobile = ''
    this.visitingRate = ''
    this.closeRate = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  FormArgument
}
