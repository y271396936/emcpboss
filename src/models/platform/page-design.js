import { AbstractFormArgument, AbstractSearchArgument } from '../global'
// import { CONDITION_TYPE } from '@/utils/constants'

const SEARCH_CONDITION = [
]

class PageSetting {
  constructor () {
    this.itemSolutionId = ''
    this.title = ''
    this.width = ''
    this.url = ''
  }
}

class SettingFormArgument {
  constructor ({pageSetting}) {
    this.itemSolutionId = pageSetting.itemSolutionId || ''
    this.title = pageSetting.title || ''
    this.width = pageSetting.width || ''
    this.url = pageSetting.url || ''
  }
}

class PageFeatureCode {
  constructor () {
    this.header = ''
    this.footerFixedStyleId = ''
    this.statisticsCode = ''
    this.kf53CodeSrc = ''
    this.copyrightUrl = ''
  }
}

class SearchArgument extends AbstractSearchArgument {

}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.itemSolutionId = 0
    this.setting = new PageSetting()
    this.featureCode = new PageFeatureCode()
    this.components = []
  }
}

export {
  SEARCH_CONDITION,
  PageSetting,
  SettingFormArgument,
  PageFeatureCode,
  SearchArgument,
  FormArgument
}
