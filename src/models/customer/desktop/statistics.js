import {AbstractSearchArgument} from '../../global'

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.itemId = ''
    this.startTime = ''
    this.endTime = ''
    this.title = ''
    this.status = ''
  }
}

export {
  SearchArgument
}
