import { AbstractFormArgument, AbstractSearchArgument } from '../global'
// import { CONDITION_TYPE } from '@/utils/constants'

// const SEARCH_CONDITION = [
//   {
//     name: 'itemId',
//     title: '项目',
//     placeholder: '- - - 请选择项目 - - -',
//     type: CONDITION_TYPE.SELECT,
//     value: '',
//     visible: true,
//     config: {
//       list: []
//     }
//   }
// ]

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()
    this.status = ''
    this.itemId = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.id = ''
    this.title = ''
    this.content = ''
    this.type = []
  }
}

class Remote {
  constructor () {
    this.item = {
      loading: false,
      list: []
    }
  }
}

export {
  // SEARCH_CONDITION,
  SearchArgument,
  FormArgument,
  Remote
}
