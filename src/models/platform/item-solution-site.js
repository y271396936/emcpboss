import { AbstractFormArgument, AbstractSearchArgument } from '../global'

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.itemSolutionId = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.itemSolutionId = ''
    this.pageUrl = ''
    this.pageType = ''
    this.pageStatus = ''
    this.kf53Status = ''
    this.feedbackStatus = ''
  }
}

export {
  SearchArgument,
  FormArgument
}
