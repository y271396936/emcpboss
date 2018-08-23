import { SESSION_KEY } from '@/utils/constants'
import { permAction } from '../../action-names'

const ACTION = permAction

// mutation types
const MUTATION_SAVED = 'SAVED'
const MUTATION_CLEAR = 'CLEAR'

const state = {

}

const getters = {
  perms () {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY.PERMS) || '[]')
  }
}

const actions = {
  [ACTION.save] ({commit}, {list}) {
    commit(MUTATION_SAVED, {list: list})
  }
}

const mutations = {
  [MUTATION_SAVED] (state, {list}) {
    sessionStorage.setItem(SESSION_KEY.PERMS, JSON.stringify(list))
  },
  [MUTATION_CLEAR] () {
    sessionStorage.removeItem(SESSION_KEY.PERMS)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
