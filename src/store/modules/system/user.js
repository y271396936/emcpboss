import { SESSION_KEY } from '@/utils/constants'
import { userAction } from '../../action-names'

const ACTION = userAction

// mutation types
const MUTATION_USER_SAVED = 'USER_SAVED'
const MUTATION_USER_CLEAR = 'USER_CLEAR'

// state
const state = {
  info: null
}

// getters
const getters = {
  isLogin: state => {
    return state.info != null && state.info.id > 0
  }
}

// actions
const actions = {
  [ACTION.login] ({commit}, {user}) {
    commit(MUTATION_USER_SAVED, {user: user})
  },
  [ACTION.logout] ({commit}) {
    commit(MUTATION_USER_CLEAR)
  }
}

// mutations
const mutations = {
  [MUTATION_USER_SAVED] (state, {user}) {
    if (user !== undefined && user !== null) {
      sessionStorage.setItem(SESSION_KEY.USER, JSON.stringify(user) || null)
      state.info = user
    }
  },
  [MUTATION_USER_CLEAR] (state) {
    sessionStorage.removeItem(SESSION_KEY.USER)
    state.info = null
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
