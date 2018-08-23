// 主容器
import MainContent from '../../components/common/MainContent'
// 组件
import ExampleIndex from '../../components/example/Index'
import ExampleJsx from '../../components/example/Jsx'
import ExampleChart from '../../components/example/Chart'
import ExampleHttp from '../../components/example/Http'
import ExampleListExample from '../../components/example/ListExample'
import ExampleCkEditor from '../../components/example/CkEditor'
import ExampleKindEditor from '../../components/example/KindEditor'
import ExampleMigrateMap from '../../components/example/MigrateMap'
import ExampleMigrateMapBaidu from '../../components/example/MigrateMapBaidu'
import ExampleRelationalGraph from '../../components/example/RelationalGraph'
import ExampleScatterSign from '../../components/example/ScatterSign'

const router = {
  path: '/example',
  name: 'Example',
  component: MainContent,
  children: [
    {path: 'index', component: ExampleIndex},
    {path: 'jsx', component: ExampleJsx},
    {path: 'chart', component: ExampleChart},
    {path: 'http', component: ExampleHttp},
    {path: 'list', component: ExampleListExample},
    {path: 'ck-editor', component: ExampleCkEditor},
    {path: 'kind-editor', component: ExampleKindEditor},
    {path: 'migrate-map', component: ExampleMigrateMap},
    {path: 'migrate-map-baidu', component: ExampleMigrateMapBaidu},
    {path: 'relational-graph', component: ExampleRelationalGraph},
    {path: 'scatter-sign', component: ExampleScatterSign}
  ]
}

const menu = [
  {title: '所有样例', icon: 'home', path: '/example/index'},
  {title: 'JSX 支持', icon: 'jsfiddle', path: '/example/jsx'},
  {title: 'HTTP 请求', icon: 'meetup', path: '/example/http'},
  {
    title: '图表样例',
    icon: 'th-large',
    sons: [
      {title: '图表样例', icon: 'area-chart', path: '/example/chart'},
      {title: '迁徙地图', icon: 'globe', path: '/example/migrate-map'},
      {title: '迁徙地图(百度)', icon: 'globe', path: '/example/migrate-map-baidu'},
      {title: '微博签到点亮图', icon: 'globe', path: '/example/scatter-sign'},
      {title: '雨量关系图', icon: 'globe', path: '/example/relational-graph'}
    ]
  },
  {title: '列表页样例', icon: 'list', path: '/example/list'},
  {
    title: '富文本编辑器',
    icon: 'th-large',
    sons: [
      {title: 'CKEditor', icon: 'list', path: '/example/ck-editor'},
      {title: 'KindEditor', icon: 'list', path: '/example/kind-editor'}
    ]
  }
]

export default {
  router,
  menu
}
