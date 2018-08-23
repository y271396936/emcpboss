import store from '@/store'
// import { userAction } from '@/store/action-names'
import BossNavMenus from './menus/boss'
// import CustomerNavMenus from './menus/customer'

const listNav = () => {
  const userInfo = store.state.user.info || {}
  const userType = userInfo['type'] || ''

  if (userType === 'boss') {
    return BossNavMenus.navs
  } else {
    return []
  }
}

const getMenus = () => {
  const userInfo = store.state.user.info || {}
  const userType = userInfo['type'] || ''
  if (userType === 'boss') {
    return BossNavMenus.menus
  } else {
    return []
  }
}

const getPerms = () => {
  const userInfo = store.state.user.info || {}
  const userPerms = userInfo['data'] || []
  return userPerms
}

const listMenu = () => {
  let menus = {}

  const userPerms = getPerms() || []
  const userMenus = getMenus() || {}
  for (let nav in userMenus) {
    menus[nav] = []

    const navMenus = userMenus[nav] || []
    const userInfo = store.state.user.info || {}
    const userType = userInfo['type'] || ''
    navMenus.forEach(item => {
      if (userType === 'boss') {
        if (item.perm === undefined) {
          if (item.sons !== undefined && item.sons.length > 0) {
            for (let i in item.sons) {
              if (item.sons[i].sons !== undefined) {
                for (let k in item.sons[i].sons) {
                  item.sons[i].sons[k].flag = true
                  item.sons[i].flag = true
                  item.flag = true
                  item.isShow = true
                }
              } else {
                if (userPerms.includes(item.sons[i].perm)) {
                  item.sons[i].flag = true
                  item.flag = true
                  item.isShow = undefined
                }
              }
            }
          }
        } else {
          if (userPerms.includes(item.perm)) {
            item.flag = true
          }
        }
      }
      menus[nav].push(item)
    })
  }
  return menus
}

export default {
  listNav,
  listMenu
}
