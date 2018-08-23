import { AbstractFormArgument } from '../global'

class SearchArgument {
  constructor () {
    this.pid = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.pid = ''
    this.title = ''
  }
}

export {
  SearchArgument,
  FormArgument
}
