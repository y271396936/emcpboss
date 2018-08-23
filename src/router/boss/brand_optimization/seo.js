const SiteManage = () => import(/* webpackChunkName: "brand-group" */ '@/components/brand_optimization/SeoSiteManage')
const Article = () => import(/* webpackChunkName: "brand-group" */ '@/components/brand_optimization/SeoArticle')

const routers = [
  {path: 'seo-site-manages', component: SiteManage},
  {path: 'seo-articles', component: Article}
]

const menu = {
  title: 'SEO优化',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '站点管理',
      icon: 'globe',
      path: '/brand-optimization/seo-site-manages',
      perm: 'brandSeoArticleSite:list',
      flag: false
    },
    {
      title: '文章发布',
      icon: 'file-text',
      path: '/brand-optimization/seo-articles',
      perm: 'brandSeoArticleTask:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
