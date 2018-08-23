/**
 * Created by yh on 2018/1/23.
 */
import { AbstractSearchArgument, AbstractFormArgument } from '../global'

class SearchArgument extends AbstractSearchArgument {
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.titleText = ''
    this.contentText = ''
    this.siteIds = []
  }
}

export {
  SearchArgument,
  FormArgument
}
