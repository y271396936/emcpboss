import { AbstractFormArgument } from '../global'

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.itemSolutionId = null
    this.content = null
    this.replyContent = null
  }
}

export {
  FormArgument
}
