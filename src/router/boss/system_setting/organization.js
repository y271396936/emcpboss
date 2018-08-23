const SystemDepartment = () => import(/* webpackChunkName: "organizations" */ '@/components/system_setting/SystemDepartment')
const SystemRole = () => import(/* webpackChunkName: "organizations" */ '@/components/system_setting/SystemRole')
const SystemPerm = () => import(/* webpackChunkName: "organizations" */ '@/components/system_setting/SystemPerm')
const SystemUser = () => import(/* webpackChunkName: "organizations" */ '@/components/system_setting/SystemUserList')

const routers = [
  {path: 'system-departments', component: SystemDepartment},
  {path: 'system-roles', component: SystemRole},
  {path: 'system-perms', component: SystemPerm},
  {path: 'system-user', component: SystemUser}
]

const menu = {
  title: '组织架构',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '部门架构',
      icon: 'sitemap',
      path: '/system-setting/system-departments',
      perm: 'systemDepartment:list',
      flag: false
    },
    {title: '系统用户', icon: 'user', path: '/system-setting/system-user', perm: 'systemUsers:list', flag: false},
    {title: '系统角色', icon: 'user', path: '/system-setting/system-roles', perm: 'systemRole:list', flag: false},
    {title: '系统权限', icon: 'diamond', path: '/system-setting/system-perms', perm: 'systemPerm:list', flag: false}
  ]
}

export default {
  routers,
  menu
}
