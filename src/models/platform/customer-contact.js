import { AbstractFormArgument, AbstractSearchArgument } from '../global'

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.customerId = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.customerId = ''
    this.contacts = ''
    this.duty = ''
    this.mobile = ''
    this.acquiescent = ''
    this.phone = ''
    this.qq = ''
    this.wechat = ''
    this.email = ''
    this.address = ''
  }
}

export {
  SearchArgument,
  FormArgument
}
