import {AbstractFormArgument, AbstractSearchArgument} from '../global'
import {CONDITION_TYPE} from '../../utils/constants'
import Api from '@/api/system/system-user'

const SEARCH_CONDITION = [
  {
    name: 'id',
    title: 'ID',
    placeholder: '整数',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'customerGenre',
    title: '客户类型',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '1', label: '销售客户'},
        {value: '2', label: '渠道客户'}
      ]
    }
  },
  {
    name: 'customerTitle',
    title: '客户名称',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'itemTitle',
    title: '项目名称',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'regulator',
    title: '运营专员',
    placeholder: '请输入关键字',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [],
      remote: {
        enabled: true,
        loading: false,
        method: (query) => {
          const myself = SEARCH_CONDITION[4]
          myself.config.remote.loading = true

          if (query === '' || query === undefined) {
            myself.config.list = []
            myself.config.remote.loading = false
          }
          Api.operatorLikeness({name: query}, response => {
            let status = response.status || 0
            let body = response.data.list || []
            if (status >= 200 && status <= 204) {
              let list = []
              body.forEach(item => {
                list.push({value: item, label: item})
              })
              myself.config.list = list
            }
            myself.config.remote.loading = false
          })
        }
      }
    }
  },
  {
    name: 'channelTitle',
    title: '推广渠道',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'accountTitle',
    title: '渠道账户',
    placeholder: '可模糊查询',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'planStandard',
    title: '推广计划',
    placeholder: '如：QD-泰芒了MQD2-2510S',
    type: CONDITION_TYPE.TEXT,
    value: '',
    visible: true
  },
  {
    name: 'status',
    title: '状态',
    type: CONDITION_TYPE.SELECT,
    value: '',
    visible: true,
    config: {
      list: [
        {value: '1', label: '上稿中'},
        {value: '0', label: '无效'},
        {value: '-1', label: '已下稿'},
        {value: '-2', label: '暂停'},
        {value: '-3', label: '下稿申请中'},
        {value: '-4', label: '上稿申请中'},
        {value: '-5', label: '已转户'}
      ]
    }
  }
]

// 留言板样式
const FEEDBACK_STYLE = [
  {
    value: 1,
    title: '页面跳转留言板',
    clientId: 1,
    thumb: '/static/images/platform/item-solution/feedback.jpg',
    status: 1
  },
  {
    value: 4,
    title: '页面pc留言板',
    clientId: 1,
    thumb: '/static/images/platform/item-solution/feedback-new.jpg',
    status: 1
  },
  {
    value: 2,
    title: '底部悬浮版',
    clientId: 1,
    thumb: '/static/images/platform/item-solution/feedback-bottom.jpg',
    status: 0
  },
  {
    value: 3,
    title: '页面手机留言板',
    clientId: 2,
    thumb: '/static/images/platform/item-solution/feedback-mobile.jpg',
    status: 1
  }
]
// 留言板核心代码
const FEEDBACK_CORE_CODE = `<script>
  var _ms = _ms || [];
  _ms.push(['_setUri', '#FEEDBACK_URI#']);

  (function() {
    var ms = document.createElement("script"); ms.type = 'text/javascript'; ms.async = true;
    ms.src = "http://v2.51qudao888.com/js/ms.qudao51-2.0.min.js";
    var s = document.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ms, s);
  })();
</script>`
// 留言板 iframe 显示代码
const FEEDBACK_IFRAME_CODE = `<div id="ms-feedback-wrap" align="center">
    <script> _ms.push(['_makeIframe']); </script>
</div>`
// 留言板底部样式代码
const FEEDBACK_BOTTOM_CODE = `<div style="height:50px;width:100%;background:url('#backgroundImg#') no-repeat center top;position:fixed;bottom:0;left:0;z-index:88;">
  <div style="width:1000px;height:50px;margin:0 auto;">
    <div style="float:left;width:500px;height:50px;overflow:hidden;">
      <a href="#kfUrl#" target="_blank" style="width:48px;height:50px;display:block;float:right;margin-right:50px;"></a>
    </div>
    <div id="ms-feedback-wrap" style="float:left;width:500px;height:50px;overflow:hidden;">
      <script> _ms.push(['_makeIframe']); </script>
    </div>
  </div>
</div>`

class SearchArgument extends AbstractSearchArgument {
  constructor () {
    super()

    this.id = ''
    this.customerGenre = ''
    this.customerTitle = ''
    this.itemTitle = ''
    this.regulator = ''
    this.channelTitle = ''
    this.accountTitle = ''
    this.planStandard = ''
    this.status = ''
  }
}

class FormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.itemId = ''
    this.platformId = ''
    this.channelId = ''
    this.accountId = ''
    this.clientId = ''
    this.pageId = ''
    this.pageUrl = ''
    this.pageType = null
    this.kf53Status = null
    this.feedbackStatus = null
  }
}

class ReportFormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.day = ''
    this.clientId = ''
    this.feedback = ''
    this.visitor = ''
    this.talk = ''
    this.phone = ''
  }
}

class NodeDataFormArgument extends AbstractFormArgument {
  constructor () {
    super()
    this.itemSolutionId = ''
    this.timeNode = ''
    this.costCoin = ''
    this.serviceCoin = ''
    this.talk = ''
    this.phone = ''
  }
}

class DownloadFormArgument {
  constructor () {
    this.libraryIds = ''
    this.matchModes = ''
    this.functions = ''
    this.price = ''
  }
}

class StatusPetition {
  constructor () {
    this.isEdit = true
    this.activeStep = 0
    this.endStepTitle = '完成'
    this.finishStepStatus = 'success'
    this.itemSolutionId = ''
    this.genre = null
    this.reason = ''
  }
}

class FeedbackCode {
  constructor () {
    this.itemSolutionIndex = null
    this.activeTabName = 'fourth'
    this.style = ''
    this.styleThumb = '/static/images/platform/item-solution/feedback-none.jpg'
    this.backgroundImg = ''
    this.kfUrl = ''
    this.code = {}
    this.code.core = ''
    this.code.show = ''
  }
}

class BidOperation {
  constructor () {
    this.lastIndex = null
    this.activeTabName = 'bidWork'

    // 推广参考
    this.orientation = {}
    this.orientation.id = 0
    this.orientation.itemId = 0
    this.orientation.loading = false
    this.orientation.handled = false
    this.orientation.current = {}
    this.orientation.history = []

    // 运营过程
    this.adjustJob = {}
    this.adjustJob.loading = false
    this.adjustJob.today = {}
    this.adjustJob.today.content = ''
    this.adjustJob.history = []
    this.adjustJob.pagination = {}

    // 运营监察
    this.bidReview = {}
    this.bidReview.loading = false
    this.bidReview.row = {}
    this.bidReview.row.form = {}
    this.bidReview.row.form.content = ''
    this.bidReview.row.pagination = {}
    this.bidReview.row.type = 'add'
    this.bidReview.approvalShow = false
    this.bidReview.history = []
    this.bidReview.pagination = {}

    //
    this.operating = {}

    // 客户反馈
    this.survey = {}
    this.survey.loading = false

    // 关键词策略
    this.keyword = {}
    this.keyword.activeName = 'search'

    // 框架分词
    this.splitWord = {
      matchModes: [],
      functions: []
    }
  }
}

class Remote {
  constructor () {
    this.customer = {
      loading: false,
      list: []
    }
    this.item = {
      loading: false,
      list: []
    }
    this.channel = {
      loading: false,
      list: []
    }
    this.account = {
      loading: false,
      list: []
    }
    // 部下
    this.subordinate = {
      loading: false,
      list: []
    }
    // 项目推广参考
    this.itemOrientation = {
      loading: false,
      list: [],
      history: {}
    }
    // 项目方案运营过程
    this.itemSolutionAdjustJob = {
      loading: false,
      list: [],
      history: {}
    }
    // 行业
    this.industry = {
      loading: false,
      data: {}
    }
    // 词库
    this.library = {
      loading: false,
      data: {}
    }
  }
}

class SiteForm {
  constructor () {
    this.itemSolutionId = ''
    this.pageUrl = ''
    this.pageType = ''
    this.pageStatus = ''
    this.kf53Status = ''
    this.feedbackStatus = ''
  }
}

export {
  SEARCH_CONDITION,
  FEEDBACK_STYLE,
  FEEDBACK_CORE_CODE,
  FEEDBACK_IFRAME_CODE,
  FEEDBACK_BOTTOM_CODE,
  SearchArgument,
  FormArgument,
  ReportFormArgument,
  NodeDataFormArgument,
  StatusPetition,
  FeedbackCode,
  BidOperation,
  Remote,
  SiteForm,
  DownloadFormArgument
}
