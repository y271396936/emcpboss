import { AbstractSearchArgument } from '../global'

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.userId = ''
    this.customerId = ''
    this.startTime = ''
    this.endTime = ''
  }
}

export {
  SearchArgument
}
