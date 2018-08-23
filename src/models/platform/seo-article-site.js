import { AbstractFormArgument, AbstractSearchArgument } from '../global'

class SearchArgument extends AbstractSearchArgument {
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.title = ''
    this.webFramework = ''
    this.webCharset = ''
    this.indexUrl = ''
    this.adminUrl = ''
    this.loginAccount = ''
    this.loginPassword = ''
    this.categoryPid = ''
    this.categoryId = ''
  }
}

export {
  SearchArgument,
  FormArgument
}
