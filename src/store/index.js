import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import user from './modules/system/user'
import permission from './modules/system/permission'
import notification from './modules/system/notification'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
let state = {
  noread: 0
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules: {
    user, permission, notification
  },
  strict: debug
})
