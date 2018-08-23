// 竞价培训
const basicNowladge = () => import(/* webpackChunkName: "bid-train" */ '@/components/operating_training/BasicNowladge')
const manuscriptFlow = () => import(/* webpackChunkName: "bid-train" */ '@/components/operating_training/ManuscriptFlow')
const DataAnalysic = () => import(/* webpackChunkName: "bid-train" */ '@/components/operating_training/DataAnalysic')
const SkillOperater = () => import(/* webpackChunkName: "bid-train" */ '@/components/operating_training/SkillOperater')
// 信息流培训
const TrainInformationKnowledge = () => import(/* webpackChunkName: "information-flow" */ '@/components/operating_training/TrainInformationKnowledge')
const TrainInformationAnalysic = () => import(/* webpackChunkName: "information-flow" */ '@/components/operating_training/TrainInformationAnalysic')
const TrainInformationManuscript = () => import(/* webpackChunkName: "information-flow" */ '@/components/operating_training/TrainInformationManuscript')
const TrainInformationSkill = () => import(/* webpackChunkName: "information-flow" */ '@/components/operating_training/TrainInformationSkill')
// 技巧培训
const trainSkill = () => import(/* webpackChunkName: "all-operating-centers" */ '@/components/operating_training/TrainSkill')
const InformationRelease = () => import(/* webpackChunkName: "all-operating-centers" */ '@/components/operating_training/InformationRelease')
// 内部资料
const workDuty = () => import(/* webpackChunkName: "all-operating-centers" */ '@/components/operating_training/WorkDuty')

const routers = [
  {path: 'basic-now-ladge', component: basicNowladge},
  {path: 'manuscript-flow', component: manuscriptFlow},
  {path: 'data-analysic', component: DataAnalysic},
  {path: 'skill-operater', component: SkillOperater},
  {path: 'information-knowledge', component: TrainInformationKnowledge},
  {path: 'information-analysic', component: TrainInformationAnalysic},
  {path: 'information-manuscript', component: TrainInformationManuscript},
  {path: 'information-skill', component: TrainInformationSkill},
  {path: 'trainSkill', component: trainSkill},
  {path: 'information-release', component: InformationRelease},
  {path: 'work-duty', component: workDuty}
]

const menu = {
  title: '运营部',
  icon: 'building',
  flag: false,
  sons: [
    {
      title: '竞价培训',
      icon: 'book',
      flag: false,
      sons: [
        {
          title: '基础知识',
          icon: 'glass',
          path: '/company-information/basic-now-ladge',
          perm: 'trainBidKnowledge:list',
          flag: false
        },
        {
          title: '上稿流程',
          icon: 'trello',
          path: '/company-information/manuscript-flow',
          perm: 'trainBidManuscript:list',
          flag: false
        },
        {
          title: '数据分析',
          icon: 'rmb',
          path: '/company-information/data-analysic',
          perm: 'trainBidAnalysis:list',
          flag: false
        },
        {
          title: '技巧操作',
          icon: 'level-up',
          path: '/company-information/skill-operater',
          perm: 'trainBidSkill:list',
          flag: false
        }
      ]
    },
    {
      title: '信息流培训',
      icon: 'align-left',
      flag: false,
      sons: [
        {
          title: '基础知识',
          icon: 'crosshairs',
          path: '/company-information/information-knowledge',
          perm: 'TrainInformationKnowledge:list',
          flag: false},
        {
          title: '上稿流程',
          icon: 'crosshairs',
          path: '/company-information/information-manuscript',
          perm: 'trainInformationManuscript:list',
          flag: false
        },
        {
          title: '数据分析',
          icon: 'crosshairs',
          path: '/company-information/information-analysic',
          perm: 'TrainInformationAnalysic:list',
          flag: false
        },
        {title: '技巧操作',
          icon: 'crosshairs',
          path: '/company-information/information-skill',
          perm: 'trainInformationSkill:list',
          flag: false}
      ]
    },
    {
      title: '技巧培训',
      icon: 'skype',
      flag: false,
      sons: [
        {
          title: '内部技巧',
          icon: 'crosshairs',
          path: '/company-information/trainSkill',
          perm: 'trainSkill:list',
          flag: false
        },
        {
          title: '行业资讯',
          icon: 'th-large',
          path: '/company-information/information-release',
          perm: 'informationClick:list',
          flag: false
        }
      ]
    },
    {
      title: '内部资料',
      icon: 'skype',
      flag: false,
      sons: [
        {
          title: '内部资料',
          icon: 'glass',
          path: '/company-information/work-duty',
          perm: 'trainWorkDuty:list',
          flag: false
        }
      ]
    }
  ]
}

export default {
  routers,
  menu
}
