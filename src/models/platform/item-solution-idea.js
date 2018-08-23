import { AbstractFormArgument } from '../global'
import { PLATFORM_LIST } from '@/utils/constants'

const platforms = []
PLATFORM_LIST.forEach(item => {
  platforms.push({
    value: item.id, label: item.title
  })
})

class ItemSolutionIdeaFormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.itemId = ''
    this.channelId = ''
    this.clientId = ''
    this.accountId = ''
  }
}

class Remote {
  constructor () {
    this.item = {
      loading: false,
      list: []
    }
    this.channel = {
      loading: false,
      list: []
    }
    this.account = {
      loading: false,
      list: []
    }
  }
}

export {
  ItemSolutionIdeaFormArgument,
  Remote
}
