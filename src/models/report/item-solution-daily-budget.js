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
    this.budget = ''
    this.reason = ''
  }
}

export {
  SearchArgument,
  FormArgument
}
