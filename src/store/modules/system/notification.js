// mutation types
const RECEIVE = 'RECEIVE'
const READ = 'READ'
const READ_ALL = 'READ_ALL'

const NOTICE_TYPE = {
  SYSTEM: 'SYSTEM',
  USER: 'USER',
  CUSTOMER: 'CUSTOMER'
}

// state
const state = {
  count: {
    system: 0,
    user: 0,
    customer: 0
  }
}

// getters
const getters = {

}

// actions
const actions = {
  receiveSystemNotice ({commit}) {
    commit(RECEIVE, {type: NOTICE_TYPE.SYSTEM})
  },
  receiveUserMessage ({commit}) {
    commit(RECEIVE, {type: NOTICE_TYPE.USER})
  },
  receiveCustomerMessage ({commit}) {
    commit(RECEIVE, {type: NOTICE_TYPE.CUSTOMER})
  },
  readSystemNotice ({commit}) {
    commit(READ, {type: NOTICE_TYPE.SYSTEM})
  },
  readUserMessage ({commit}) {
    commit(READ, {type: NOTICE_TYPE.USER})
  },
  readCustomerMessage ({commit}) {
    commit(READ, {type: NOTICE_TYPE.CUSTOMER})
  },
  readAll ({commit}) {
    commit(READ_ALL)
  }
}

// mutations
const mutations = {
  [RECEIVE] (state, {type}) {
    state.count[type.toLowerCase()]++
  },
  [READ] (state, {type}) {
    state.count[type.toLowerCase()] = 0
  },
  [READ_ALL] (state) {
    state.count = {
      system: 0,
      user: 0,
      customer: 0
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
