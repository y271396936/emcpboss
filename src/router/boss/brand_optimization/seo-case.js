const SeoCase = () => import(/* webpackChunkName: "brand-group" */ '@/components/brand_optimization/SeoCase')
const PreviewCase = () => import(/* webpackChunkName: "brand-group" */ '@/components/brand_optimization/PreviewCase')

const routers = [
  {path: 'seo-case', component: SeoCase},
  {path: 'preview-case', component: PreviewCase}
]

const menu = {
  title: '优化案例',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '案例发布',
      icon: 'file-text',
      path: '/brand-optimization/seo-case',
      perm: 'brandSeoCaseShow:list',
      flag: false
    },
    {
      title: '案例预览',
      icon: 'video-camera',
      path: '/brand-optimization/preview-case',
      perm: 'brandSeoCaseShow:customerShow',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
