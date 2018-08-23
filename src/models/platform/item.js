import { AbstractFormArgument, AbstractSearchArgument } from '../global'

const SEARCH_CONDITION = [

]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.genre = ''
    this.title = ''
    this.status = ''
  }
}

class MonthGrowthSearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.day = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.customerId = ''
    this.title = ''
    this.salerId = ''
    this.budget = ''
    this.serverId = ''
    this.website = ''
    this.address = ''
  }
}

export {
  SEARCH_CONDITION,
  SearchArgument,
  MonthGrowthSearchArgument,
  FormArgument
}
