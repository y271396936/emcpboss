/**
 *Created by Heqi on 2018/1/22.
 */

import { AbstractFormArgument } from '../global'

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()

    this.itemId = ''
    this.itemName = ''
    this.webSite = ''
    this.regtime = ''
    this.brands = ''
    this.popularizeTimeSpan = ''
    this.cooperantShop = ''
    this.productOrientation = ''
    this.products = ''
    this.popularizeTime = ''
    this.genderRation = ''
    this.ageSegment = ''
    this.filiale = ''
    this.filialeCitys = ''
    this.joinWebSite = ''
    this.advantage = ''
    this.minInvestment = ''
    this.maxInvestment = ''
    this.competitor = ''
    this.tvCompetitor = ''
    this.teamPeople = ''
    this.dailyMinResource = ''
    this.onlineService = ''
    this.contacts = ''
    this.qq = ''
    this.mobile = ''
    this.visitingRate = ''
    this.closeRate = ''
    this.joinPolicy = ''
  }
}

export {
  FormArgument
}
