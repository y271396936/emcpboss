/**
 *Created by Heqi on 2018/1/17.
 */

import { AbstractFormArgument } from '../global'

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.oldPassword = ''
    this.password = ''
    this.confirm = ''
  }
}

export {
  FormArgument
}
