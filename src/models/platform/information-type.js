import { AbstractFormArgument, AbstractSearchArgument } from '../global'

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.departmentId = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.departmentId = ''
    this.type = ''
  }
}

export {
  SearchArgument,
  FormArgument
}
