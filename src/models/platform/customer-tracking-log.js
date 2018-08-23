import { AbstractFormArgument } from '../global'

class TrackingLogFormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.trailWay = ''
    this.trailContent = ''
  }
}

export {
  TrackingLogFormArgument
}
