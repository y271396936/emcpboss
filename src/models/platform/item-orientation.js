import { AbstractFormArgument } from '../global'

class OrientationFormentArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.id = ''
    this.itemId = null
    this.popularizeTime = ''
    this.popularizeArea = ''
    this.excludeArea = ''
    this.benefitKeyword = ''
    this.greatChange = ''
    this.content = ''
  }
}

class StatusPetition {
  constructor () {
    this.isEdit = true
    this.activeStep = 0
    this.endStepTitle = '完成'
    this.finishStepStatus = 'success'
    this.itemSolutionId = ''
    this.genre = null
    this.reason = ''
  }
}
export {
  OrientationFormentArgument,
  StatusPetition
}
