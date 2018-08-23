import { AbstractSearchArgument, AbstractFormArgument } from '../global'

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
    this.bidDatetime = ''
    this.changed = ''
    this.content = ''
    this.approvalContent = ''
  }
}

export {
  SearchArgument,
  FormArgument
}
