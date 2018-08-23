import Example from '@/router/boss/example/index'

const navs = [
  {title: '组件样例', icon: 'connectdevelop', menu: 'example'}
]

const menus = {
  main: [],
  example: Example.menu
}

export default {
  navs,
  menus
}
