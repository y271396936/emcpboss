const KeywordCategoryManage = () => import(/* webpackChunkName: "keywords" */ '@/components/operating_center/keyword_manager/KeywordCategoryManage')
const KeywordNatureManage = () => import(/* webpackChunkName: "keywords" */ '@/components/operating_center/keyword_manager/KeywordNatureManage')
const ThesaurusList = () => import(/* webpackChunkName: "keywords" */ '@/components/operating_center/keyword_manager/ThesaurusList')
const KeywordList = () => import(/* webpackChunkName: "keywords" */ '@/components/operating_center/keyword_manager/KeywordList')
const ParticipleWay = () => import(/* webpackChunkName: "keywords" */ '@/components/operating_center/keyword_manager/ParticipleWay')
const IdeaList = () => import(/* webpackChunkName: "keywords" */ '@/components/operating_center/idea_manager/IdeaList')

const routers = [
  {path: 'keyword-category-manager', component: KeywordCategoryManage},
  {path: 'keyword-nature-manager', component: KeywordNatureManage},
  {path: 'thesaurus-list', component: ThesaurusList},
  {path: 'keyword-list', component: KeywordList},
  {path: 'participle-way', component: ParticipleWay},
  {path: 'idea-list', component: IdeaList}
]

const menu = {
  title: '关键词管理',
  icon: 'th-large',
  flag: false,
  sons: [
    {
      title: '品类管理',
      icon: 'cloud',
      path: '/operating-center/keyword-category-manager',
      perm: 'projectBidKeywordCategory:list',
      flag: false
    }, {
      title: '词性管理',
      icon: 'cloud',
      path: '/operating-center/keyword-nature-manager',
      perm: 'projectBidKeywordNature:list',
      flag: false
    }, {
      title: '词库列表',
      icon: 'cloud',
      path: '/operating-center/thesaurus-list',
      perm: 'projectBidKeywordLibrary:list',
      flag: false
    }, {
      title: '关键词列表',
      icon: 'cloud',
      path: '/operating-center/keyword-list',
      perm: 'projectBidKeyword:list',
      flag: false
    }, {
      title: '分词策略',
      icon: 'cloud',
      path: '/operating-center/participle-way',
      perm: 'projectBidKeywordSplitStrategy:list',
      flag: false

    }, {
      title: '创意列表',
      icon: 'cloud',
      path: '/operating-center/idea-list',
      perm: 'idea:list',
      flag: false
    }
  ]
}

export default {
  routers,
  menu
}
