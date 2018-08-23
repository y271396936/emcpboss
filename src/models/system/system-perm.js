import { AbstractSearchArgument, AbstractFormArgument } from '../global'

class SearchArgument extends AbstractSearchArgument {}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.firstLevel = ''
    this.secondLevel = ''
    this.permName = ''
    this.perm = ''
  }
}

export {
  SearchArgument,
  FormArgument
}
