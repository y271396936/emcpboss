const permissionList = [
  {
    label: '工作流程',
    children: [
      {
        label: '工作反馈',
        children: [
          {
            label: ' 列表',
            value: 'projectBidWorkFeedback:list'
          },
          {
            label: ' 添加',
            value: 'projectBidWorkFeedback:add'
          },
          {
            label: ' 修改',
            value: 'projectBidWorkFeedback:edit'
          },
          {
            label: ' 设置已读',
            value: 'projectBidWorkFeedback:ajaxRead'
          }
        ]
      }
    ]
  },
  {
    label: '品牌优化',
    children: [
      {
        label: '客户后台留言',
        children: [
          {
            label: ' 列表',
            value: 'reservationService:list'
          },
          {
            label: ' 删除',
            value: 'reservationService:delete'
          }
        ]
      },
      {
        label: '站点管理',
        children: [
          {
            label: ' 列表',
            value: 'brandSeoArticleSite:list'
          },
          {
            label: ' 添加',
            value: 'brandSeoArticleSite:add'
          },
          {
            label: ' 修改',
            value: 'brandSeoArticleSite:edit'
          }
        ]
      },
      {
        label: '文章发布',
        children: [
          {
            label: ' 列表',
            value: 'brandSeoArticleTask:list'
          },
          {
            label: ' 添加',
            value: 'brandSeoArticleTask:add'
          },
          {
            label: ' 日志',
            value: 'brandSeoArticleTask:showLogs'
          },
          {
            label: ' 下载日志',
            value: 'brandSeoArticleTask:downloadLogs'
          },
          {
            label: ' 执行任务',
            value: 'brandSeoArticleTask:ajaxHandle'
          }
        ]
      },
      {
        label: '案例发布',
        children: [
          {
            label: ' 列表',
            value: 'brandSeoCaseShow:list'
          },
          {
            label: ' 添加',
            value: 'brandSeoCaseShow:add'
          },
          {
            label: ' 修改',
            value: 'brandSeoCaseShow:edit'
          },
          {
            label: ' 删除',
            value: 'brandSeoCaseShow:delete'
          },
          {
            label: ' 审批',
            value: 'brandSeoCaseShow:approval'
          }
        ]
      },
      {
        label: '案例预览',
        children: [
          {
            label: ' 预览',
            value: 'brandSeoCaseShow:customerShow'
          }
        ]
      },
      {
        label: '企业动态',
        children: [
          {
            label: ' 列表',
            value: 'CustomerHomeArticle:list'
          },
          {
            label: ' 添加',
            value: 'CustomerHomeArticle:add'
          },
          {
            label: ' 修改',
            value: 'CustomerHomeArticle:edit'
          },
          {
            label: ' 删除',
            value: 'CustomerHomeArticle:delete'
          }
        ]
      },
      {
        label: '行业/营销操作权限',
        children: [
          {
            label: ' 列表',
            value: 'marketService:list'
          },
          {
            label: ' 添加',
            value: 'marketService:add'
          },
          {
            label: ' 修改',
            value: 'marketService:edit'
          },
          {
            label: ' 删除',
            value: 'marketService:delete'
          },
          {
            label: ' 创业人群分析',
            value: 'marketService:getAnalysis'
          }
        ]
      },
      {
        label: '分类管理',
        children: [
          {
            label: ' 列表',
            value: 'category:list'
          },
          {
            label: ' 添加',
            value: 'category:add'
          },
          {
            label: ' 修改',
            value: 'category:edit'
          },
          {
            label: ' 删除',
            value: 'category:delete'
          }
        ]
      }
    ]
  },
  {
    label: '客服中心',
    children: [
      {
        label: '平台账户',
        children: [
          {
            label: ' 列表',
            value: 'basicChannelAccount:list'
          },
          {
            label: ' 模糊搜索',
            value: 'basicChannelAccount:likenesses'
          },
          {
            label: ' 添加',
            value: 'basicChannelAccount:add'
          },
          {
            label: ' 修改',
            value: 'basicChannelAccount:edit'
          },
          {
            label: ' 删除',
            value: 'basicChannelAccount:delete'
          },
          {
            label: ' 修改账户密码',
            value: 'basicChannelAccount:modalPassword'
          },
          {
            label: ' 设置上下搞',
            value: 'basicChannelAccount:ajaxStatus'
          }
        ]
      },
      {
        label: '推广渠道',
        children: [
          {
            label: ' 列表',
            value: 'basicChannel:list'
          },
          {
            label: ' 添加',
            value: 'basicChannel:add'
          },
          {
            label: ' 修改',
            value: 'basicChannel:edit'
          },
          {
            label: ' 删除',
            value: 'basicChannel:delete'
          }
        ]
      },
      {
        label: '推广客户',
        children: [
          {
            label: ' 列表',
            value: 'projectCustomer:list'
          },
          {
            label: ' 添加',
            value: 'projectCustomer:add'
          },
          {
            label: ' 修改',
            value: 'projectCustomer:edit'
          },
          {
            label: ' 删除',
            value: 'projectCustomer:delete'
          },
          {
            label: ' 模糊查询',
            value: 'systemCustomerUser:likenesses'
          },
          {
            label: ' 委派',
            value: 'projectCustomer:modalAppoint'
          },
          {
            label: ' 查看联系人',
            value: 'projectCustomer:viewContact'
          }
        ]
      },
      {
        label: '客户账号',
        children: [
          {
            label: ' 列表',
            value: 'systemCustomerUser:list'
          },
          {
            label: ' 添加',
            value: 'systemCustomerUser:add'
          },
          {
            label: ' 修改',
            value: 'systemCustomerUser:edit'
          },
          {
            label: ' 删除',
            value: 'systemCustomerUser:delete'
          },
          {
            label: ' SSO登陆',
            value: 'systemUser:ssoLogin'
          },
          {
            label: ' 登录分析',
            value: 'customerUserLoginLog:list'
          },
          {
            label: ' 登录概况',
            value: 'customerUserLoginLog:getAnalysis'
          }
        ]
      },
      {
        label: '客户项目',
        children: [
          {
            label: ' 列表',
            value: 'projectItem:list'
          },
          {
            label: ' 添加',
            value: 'projectItem:add'
          },
          {
            label: ' 修改',
            value: 'projectItem:edit'
          },
          {
            label: ' 删除',
            value: 'projectItem:delete'
          },
          {
            label: ' 指定行业',
            value: 'projectItem:modalIndustry'
          },
          {
            label: ' 改预算',
            value: 'projectItem:ajaxBudgetUpdate'
          },
          {
            label: ' 预算记录',
            value: 'projectItemBudgetChangeLog:modalList'
          },
          {
            label: ' 添加/修改客户问卷',
            value: 'projectItemSurvey:modalUpdateByItem'
          },
          {
            label: ' 客户问卷',
            value: 'projectItemSurvey:modalViewByItem'
          },
          {
            label: ' 推广方向记录',
            value: 'projectItemOrientation:modalList'
          },
          {
            label: ' 新增推广方向',
            value: 'projectItemOrientation:modalAdd'
          },
          {
            label: ' 删除推广方向',
            value: 'projectItemOrientation:delete'
          },
          {
            label: ' 客户跟进记录',
            value: 'projectCustomerTrackingLog:ajaxListByItem'
          },
          {
            label: ' 添加跟进客户',
            value: 'projectCustomerTrackingLog:addByItem'
          },
          {
            label: ' 修改客户跟进',
            value: 'projectCustomerTrackingLog:edit'
          },
          {
            label: ' 客户联系人',
            value: 'projectCustomerContact:ajaxListByCustomer'
          },
          {
            label: ' 默认联系人方式',
            value: 'projectCustomerContact:ajaxGetAcquiescent'
          },
          {
            label: ' 新增联系人',
            value: 'projectCustomerContact:add'
          },
          {
            label: ' 修改联系人',
            value: 'projectCustomerContact:edit'
          },
          {
            label: ' 项目状态更新',
            value: 'index:showUpdateStatus'
          }
        ]
      },
      {
        label: '项目状态更新申请',
        children: [
          {
            label: ' 列表',
            value: 'projectItemDraft:list'
          },
          {
            label: ' 拒绝申请',
            value: 'projectItemDraft:modalRepulse'
          },
          {
            label: ' 同意申请',
            value: 'projectItemDraft:ajaxAgree'
          }
        ]
      },
      {
        label: '客户问卷调查',
        children: [
          {
            label: ' 列表',
            value: 'survey:list'
          },
          {
            label: ' 生成问卷',
            value: 'survey:add'
          },
          {
            label: ' 同步问卷',
            value: 'survey:bind'
          },
          {
            label: ' 删除',
            value: 'survey:delete'
          }
        ]
      },
      {
        label: 'CDN账号管理',
        children: [
          {
            label: ' 列表',
            value: 'projectCDNAccount:list'
          },
          {
            label: ' 添加',
            value: 'projectCDNAccount:add'
          },
          {
            label: ' 修改',
            value: 'projectCDNAccount:edit'
          }
        ]
      },
      {
        label: 'CDN域名管理',
        children: [
          {
            label: ' 列表',
            value: 'projectCDNDomain:list'
          },
          {
            label: ' 添加',
            value: 'projectCDNDomain:add'
          },
          {
            label: ' 修改',
            value: 'projectCDNDomain:edit'
          },
          {
            label: ' 删除',
            value: 'projectCDNDomain:delete'
          }
        ]
      },
      {
        label: 'CDN刷新日志',
        children: [
          {
            label: ' 列表',
            value: 'projectCDNRefreshLog:list'
          },
          {
            label: ' 批量刷新',
            value: 'projectCDNRefresh:refresh'
          }
        ]
      }
    ]
  },
  {
    label: '运营中心',
    children: [
      {
        label: '行业分类',
        children: [
          {
            label: ' 列表',
            value: 'basicItemIndustry:list'
          },
          {
            label: ' 添加',
            value: 'basicItemIndustry:add'
          },
          {
            label: ' 修改',
            value: 'basicItemIndustry:edit'
          },
          {
            label: ' 删除',
            value: 'basicItemIndustry:delete'
          },
          {
            label: ' 子列表',
            value: 'basicItemIndustry:ajaxSon'
          },
          {
            label: ' 竞价标准列表',
            value: 'basicIndustryCriterion:ajaxAllByIndustry'
          },
          {
            label: ' 修改竞价标准',
            value: 'basicIndustryCriterion:modalUpdate'
          }
        ]
      },
      {
        label: '行业推广词策略',
        children: [
          {
            label: ' 列表',
            value: 'basicIndustryKeywordStrategy:list'
          },
          {
            label: ' 修改',
            value: 'basicIndustryKeywordStrategy:edit'
          },
          {
            label: ' 删除',
            value: 'basicIndustryKeywordStrategy:delete'
          },
          {
            label: ' 审阅',
            value: 'basicIndustryKeywordStrategy:ajaxApprove'
          },
          {
            label: ' 批量删除',
            value: 'basicIndustryKeywordStrategy:batchDelete'
          }
        ]
      },
      {
        label: '行业否定词策略',
        children: [
          {
            label: ' 列表',
            value: 'basicIndustryNegativeKeyword:list'
          },
          {
            label: ' 添加',
            value: 'basicIndustryNegativeKeyword:add'
          },
          {
            label: ' 修改',
            value: 'basicIndustryNegativeKeyword:edit'
          },
          {
            label: ' 删除',
            value: 'basicIndustryNegativeKeyword:delete'
          },
          {
            label: ' 批量删除',
            value: 'basicIndustryNegativeKeyword:batchDelete'
          }
        ]
      },
      {
        label: '项目方案',
        children: [
          {
            label: ' 列表',
            value: 'projectItemSolution:list'
          },
          {
            label: ' 列表-显示预算',
            value: 'projectItemSolution:listShowBudget'
          },
          {
            label: ' 列表-显示标准',
            value: 'projectItemSolution:listShowStandard'
          },
          {
            label: ' 列表-显示渠道账户',
            value: 'projectItemSolution:listShowChannelAccount'
          },
          {
            label: ' 列表-显示渠道账户密码',
            value: 'projectItemSolution:ajaxGetAccountPassword'
          },
          {
            label: ' 添加',
            value: 'projectItemSolution:add'
          },
          {
            label: ' 删除',
            value: 'projectItemSolution:delete'
          },
          {
            label: ' 推广页',
            value: 'projectItemSolutionSpreadPage:modalPageList'
          },
          {
            label: ' 设计推广页',
            value: 'projectItemSolution:addPageDesign'
          },
          {
            label: ' 新增推广页',
            value: 'projectItemSolutionSpreadPage:modalAddUrl'
          },
          {
            label: ' 推广页-编辑',
            value: 'projectItemSolutionSpreadPage:updateUrl'
          },
          {
            label: ' 推广页-删除',
            value: 'projectItemSolutionSpreadPage:delete'
          },
          {
            label: '推广页-检查',
            value: 'projectItemSolutionSpreadPage:checkRoad'
          },
          {
            label: ' 53强制',
            value: 'projectItemSolution:switchKf53Opening'
          },
          {
            label: ' 修改预算',
            value: 'projectItemSolution:ajaxBudgetUpdate'
          },
          {
            label: ' 每日预算列表',
            value: 'projectItemSolutionDailyBudget:modalList'
          },
          {
            label: ' 每日预算申请',
            value: 'projectItemSolutionDailyBudget:modalPetition'
          },
          {
            label: ' 涨预算申请',
            value: 'projectItemSolutionConsumptionPetition:modalAdd'
          },
          {
            label: ' 涨预算记录',
            value: 'projectItemSolutionConsumptionPetition:modalList'
          },
          {
            label: ' 涨预算审批情况',
            value: 'projectItemSolutionConsumptionPetition:modalView'
          },
          {
            label: ' 设置标准',
            value: 'projectItemSolution:ajaxCriterionUpdate'
          },
          {
            label: ' 分配运营专员',
            value: 'projectItemSolution:modalApportion'
          },
          {
            label: ' 暂停',
            value: 'projectItemSolution:pause'
          },
          {
            label: ' 下稿申请',
            value: 'projectItemSolution:ajaxStatusPetition'
          },
          {
            label: ' 转户',
            value: 'projectItemSolution:changeAccount'
          },
          {
            label: ' 留言板代码审查',
            value: 'projectItemSolution:ajaxPageReview'
          },
          {
            label: ' 推广方向列表',
            value: 'projectItemOrientation:ajaxView'
          },
          {
            label: ' 推广方向已处理',
            value: 'projectItemSolution:ajaxOrientationHandle'
          },
          {
            label: ' 历史运营过程',
            value: 'projectItemSolutionAdjustJob:ajaxHistory'
          },
          {
            label: ' 运营过程更新',
            value: 'projectItemSolutionAdjustJob:ajaxTodayUpdate'
          },
          {
            label: ' 监察记录',
            value: 'projectItemSolutionBidReview:ajaxList'
          },
          {
            label: ' 添加监察',
            value: 'projectItemSolutionBidReview:add'
          },
          {
            label: ' 修改监察',
            value: 'projectItemSolutionBidReview:edit'
          },
          {
            label: ' 审批监察',
            value: 'projectItemSolutionBidReview:approval'
          },
          {
            label: ' 推广词查询',
            value: 'basicIndustryKeywordStrategy:ajaxList'
          },
          {
            label: ' 添加新词',
            value: 'basicIndustryKeywordStrategy:add'
          },
          {
            label: ' 框架分词',
            value: 'projectItemSolution:ajaxSplitKeyword'
          },
          {
            label: ' 录53效果',
            value: 'projectItemSolution:modalAddReport'
          },
          {
            label: ' 节点数据',
            value: 'projectItemSolutionTimeNode:modalAdd'
          }
        ]
      },
      {
        label: '项目方案运营过程',
        children: [
          {
            label: ' 列表',
            value: 'projectItemSolutionAdjustJob:list'
          },
          {
            label: ' 审阅',
            value: 'projectItemSolutionAdjustJob:ajaxReply'
          }
        ]
      },
      {
        label: '项目方案预算修改申请',
        children: [
          {
            label: ' 列表',
            value: 'projectItemSolutionBudgetPetition:list'
          },
          {
            label: ' 通过',
            value: 'projectItemSolutionBudgetPetition:ajaxAgree'
          },
          {
            label: ' 拒绝',
            value: 'projectItemSolutionBudgetPetition:modalRepulse'
          }
        ]
      },
      {
        label: '项目方案涨预算申请',
        children: [
          {
            label: ' 列表',
            value: 'projectItemSolutionConsumptionPetition:list'
          },
          {
            label: ' 列表-显示渠道账户',
            value: 'projectItemSolutionConsumptionPetition:listShowChannelAccount'
          },
          {
            label: ' 审批',
            value: 'projectItemSolutionConsumptionPetition:ajaxApproval'
          }
        ]
      },
      {
        label: '项目方案下稿申请',
        children: [
          {
            label: ' 列表',
            value: 'projectItemSolutionStatusPetition:list'
          },
          {
            label: ' 通过',
            value: 'projectItemSolutionStatusPetition:ajaxAgree'
          },
          {
            label: ' 拒绝',
            value: 'projectItemSolutionStatusPetition:modalRepulse'
          }
        ]
      },
      {
        label: '节点数据管理',
        children: [
          {
            label: ' 列表',
            value: 'projectItemSolutionTimeNode:list'
          },
          {
            label: ' 修改',
            value: 'projectItemSolutionTimeNode:edit'
          },
          {
            label: ' 删除',
            value: 'projectItemSolutionTimeNode:delete'
          }
        ]
      },
      {
        label: '53快服管理',
        children: [
          {
            label: ' 列表',
            value: 'projectKf53Account:list'
          },
          {
            label: ' 添加',
            value: 'projectKf53Account:add'
          },
          {
            label: ' 修改',
            value: 'projectKf53Account:edit'
          },
          {
            label: ' 删除',
            value: 'projectKf53Account:delete'
          },
          {
            label: ' 登录53',
            value: 'projectKf53Account:ajaxLogin'
          }
        ]
      },
      {
        label: '品类管理',
        children: [
          {
            label: ' 列表',
            value: 'projectBidKeywordCategory:list'
          },
          {
            label: ' 添加',
            value: 'projectBidKeywordCategory:add'
          },
          {
            label: ' 修改',
            value: 'projectBidKeywordCategory:edit'
          }
        ]
      },
      {
        label: '词性管理',
        children: [
          {
            label: ' 列表',
            value: 'projectBidKeywordNature:list'
          },
          {
            label: ' 添加',
            value: 'projectBidKeywordNature:add'
          },
          {
            label: ' 修改',
            value: 'projectBidKeywordNature:edit'
          }
        ]
      },
      {
        label: '词库列表',
        children: [
          {
            label: ' 列表',
            value: 'projectBidKeywordLibrary:list'
          },
          {
            label: ' 添加',
            value: 'projectBidKeywordLibrary:add'
          },
          {
            label: ' 修改',
            value: 'projectBidKeywordLibrary:edit'
          },
          {
            label: ' 删除',
            value: 'projectBidKeywordLibrary:delete'
          }
        ]
      },
      {
        label: '关键词列表',
        children: [
          {
            label: ' 列表',
            value: 'projectBidKeyword:list'
          },
          {
            label: ' 添加',
            value: 'projectBidKeyword:add'
          },
          {
            label: ' 修改',
            value: 'projectBidKeyword:edit'
          },
          {
            label: ' 下载',
            value: 'projectBidKeywordLibrary:download'
          },
          {
            label: ' 导入',
            value: 'projectBidKeywordLibrary:import'
          }
        ]
      },
      {
        label: '分词策略',
        children: [
          {
            label: ' 列表',
            value: 'projectBidKeywordSplitStrategy:list'
          },
          {
            label: ' 添加',
            value: 'projectBidKeywordSplitStrategy:add'
          },
          {
            label: ' 修改',
            value: 'projectBidKeywordSplitStrategy:edit'
          },
          {
            label: ' 删除',
            value: 'projectBidKeywordSplitStrategy:delete'
          }
        ]
      },
      {
        label: '创意列表',
        children: [
          {
            label: ' 列表',
            value: 'idea:list'
          },
          {
            label: ' 添加',
            value: 'idea:add'
          },
          {
            label: ' 修改',
            value: 'idea:edit'
          },
          {
            label: ' 删除',
            value: 'idea:delete'
          },
          {
            label: ' 项目方案列表',
            value: 'idea:itemSolutionList'
          },
          {
            label: ' 绑定项目方案',
            value: 'idea:bindItemSolution'
          },
          {
            label: ' 删除项目方案',
            value: 'itemSolutionIdea:delete'
          },
          {
            label: ' 下载',
            value: 'idea:export'
          }
        ]
      },
      {
        label: '运营报告',
        children: [
          {
            label: ' 留言数据报告',
            value: 'analysisFeedback:itemSolution'
          },
          {
            label: ' 节点数据报告',
            value: 'analysisItemSolutionTimeNodeReport:list'
          },
          {
            label: ' 运营数据报告',
            value: 'analysisAdjust:list'
          },
          {
            label: ' 运营数据报告-显示对话成本标准',
            value: 'analysisAdjust:listShowTalkPrice'
          },
          {
            label: ' 运营数据报告-显示留言均价标准',
            value: 'analysisAdjust:listShowFeedbackPrice'
          },
          {
            label: ' 运营数据报告-显示渠道账户',
            value: 'analysisAdjust:showChannelAccount'
          },
          {
            label: ' 运营数据报告-运营过程',
            value: 'analysisAdjust:ajaxAdjustJobLogs'
          },
          {
            label: ' 项目预算报告',
            value: 'analysisAdjustItemBudget:list'
          },
          {
            label: ' 项目预算报告-显示消费',
            value: 'analysisAdjustItemBudget:listShowCostCoin'
          },
          {
            label: ' 项目预算报告-显示对话成本标准',
            value: 'analysisAdjustItemBudget:listShowTalkPrice'
          },
          {
            label: ' 项目预算报告-显示留言均价标准',
            value: 'analysisAdjustItemBudget:listShowFeedbackPrice'
          },
          {
            label: ' 渠道消费汇总报告',
            value: 'analysisBidConsumptionReport:channelClient'
          },
          {
            label: ' 渠道消费达标日报',
            value: 'analysisBidConsumptionReport:channelClientDaily'
          },
          {
            label: ' 渠道消费达标日报-导出',
            value: 'analysisBidConsumptionReport:channelClientDailyDownload'
          }
        ]
      },
      {
        label: '信息流培训',
        children: [
          {
            label: ' 技巧操作列表',
            value: 'trainInformationSkill:list'
          },
          {
            label: ' 技巧操作添加',
            value: 'trainInformationSkill:add'
          },
          {
            label: ' 技巧操作修改',
            value: 'trainInformationSkill:edit'
          },
          {
            label: ' 技巧操作删除',
            value: 'trainInformationSkill:delete'
          },
          {
            label: ' 上稿流程列表',
            value: 'trainInformationManuscript:list'
          },
          {
            label: ' 上稿流程添加',
            value: 'trainInformationManuscript:add'
          },
          {
            label: ' 上稿流程修改',
            value: 'trainInformationManuscript:edit'
          },
          {
            label: ' 上稿流程删除',
            value: 'trainInformationManuscript:delete'
          },
          {
            label: ' 基础知识列表',
            value: 'TrainInformationKnowledge:list'
          },
          {
            label: ' 基础知识添加',
            value: 'TrainInformationKnowledge:add'
          },
          {
            label: ' 基础知识修改',
            value: 'TrainInformationKnowledge:edit'
          },
          {
            label: ' 基础知识删除',
            value: 'TrainInformationKnowledge:delete'
          },
          {
            label: ' 数据分析列表',
            value: 'TrainInformationAnalysic:list'
          },
          {
            label: ' 数据分析添加',
            value: 'TrainInformationAnalysic:add'
          },
          {
            label: ' 数据分析修改',
            value: 'TrainInformationAnalysic:edit'
          },
          {
            label: ' 数据分析删除',
            value: 'TrainInformationAnalysic:delete'
          }
        ]
      },
      {
        label: '竞价培训',
        children: [
          {
            label: ' 基础知识列表',
            value: 'trainBidKnowledge:list'
          },
          {
            label: ' 基础知识添加',
            value: 'trainBidKnowledge:post'
          },
          {
            label: ' 基础知识修改',
            value: 'trainBidKnowledge:put'
          },
          {
            label: ' 基础知识删除',
            value: 'trainBidKnowledge:delete'
          },
          {
            label: ' 上稿流程列表',
            value: 'trainBidManuscript:list'
          },
          {
            label: ' 上稿流程添加',
            value: 'trainBidManuscript:post'
          },
          {
            label: ' 上稿流程修改',
            value: 'trainBidManuscript:put'
          },
          {
            label: ' 上稿流程删除',
            value: 'trainBidManuscript:delete'
          },
          {
            label: ' 数据分析列表',
            value: 'trainBidAnalysis:list'
          },
          {
            label: ' 数据分析添加',
            value: 'trainBidAnalysis:post'
          },
          {
            label: ' 数据分析修改',
            value: 'trainBidAnalysis:put'
          },
          {
            label: ' 数据分析删除',
            value: 'trainBidAnalysis:delete'
          },
          {
            label: ' 技巧操作列表',
            value: 'trainBidSkill:list'
          },
          {
            label: ' 技巧操作添加',
            value: 'trainBidSkill:post'
          },
          {
            label: ' 技巧操作修改',
            value: 'trainBidSkill:put'
          },
          {
            label: ' 技巧操作删除',
            value: 'trainBidSkill:delete'
          }
        ]
      },
      {
        label: '技巧培训',
        children: [
          {
            label: ' 内部技巧列表',
            value: 'trainSkill:list'
          },
          {
            label: ' 内部技巧添加',
            value: 'trainSkill:add'
          },
          {
            label: ' 内部技巧修改',
            value: 'trainSkill:edit'
          },
          {
            label: ' 内部技巧删除',
            value: 'trainSkill:delete'
          },
          {
            label: ' 行业资讯列表',
            value: 'informationClick:list'
          },
          {
            label: ' 行业资讯添加',
            value: 'informationClick:add'
          },
          {
            label: ' 行业资讯编辑',
            value: 'informationClick:edit'
          },
          {
            label: ' 行业资讯删除',
            value: 'informationClick:delete'
          }
        ]
      },
      {
        label: '内部资料',
        children: [
          {
            label: ' 列表',
            value: 'trainWorkDuty:list'
          },
          {
            label: ' 添加',
            value: 'trainWorkDuty:post'
          },
          {
            label: ' 修改',
            value: 'trainWorkDuty:put'
          },
          {
            label: ' 删除',
            value: 'trainWorkDuty:delete'
          }
        ]
      }
    ]
  },
  {
    label: '数据导入',
    children: [
      {
        label: '53数据导入',
        children: [
          {
            label: ' 导入',
            value: 'projectService:53Import'
          },
          {
            label: ' 导入日志',
            value: 'projectKf53ChatRecordImportLog:list'
          },
          {
            label: ' 日志回退',
            value: 'projectKf53ChatRecordImportLog:rollback'
          },
          {
            label: ' 53数据列表',
            value: 'projectKf53ChatRecord:list'
          },
          {
            label: ' 要电话量列表',
            value: 'projectItemSolutionPageReport:list'
          },
          {
            label: ' 要电话量列表-修正',
            value: 'projectItemSolutionPageReport:modalEdit'
          },
          {
            label: ' 要电话量列表-改留言',
            value: 'projectItemSolutionPageReport:modalEditFeedback'
          },
          {
            label: '53数据下载',
            value: 'kf53ChatRecord:export'
          }
        ]
      },
      {
        label: '消费数据导入',
        children: [
          {
            label: ' 导入',
            value: 'financeItemSolutionReport:import'
          },
          {
            label: ' 导入日志',
            value: 'financeItemSolutionReport:importLogs'
          },
          {
            label: ' 日志回退',
            value: 'financeItemSolutionReport:rollback'
          },
          {
            label: ' 消费列表',
            value: 'financeItemSolutionReport:list'
          },
          {
            label: ' 消费列表-显示消费现金',
            value: 'financeItemSolutionReport:listShowCostMoney'
          },
          {
            label: ' 下载',
            value: 'financeItemSolutionReport:download'
          }
        ]
      },
      {
        label: '透视表导入',
        children: [
          {
            label: ' 关键词导入',
            value: 'financeKeywordReport:import'
          },
          {
            label: ' 地域导入',
            value: 'financeRegionReport:import'
          },
          {
            label: ' 时段导入',
            value: 'financeTimeShareReport:import'
          },
          {
            label: ' 搜索词导入',
            value: 'financeSearchKeywordReport:import'
          },
          {
            label: ' 操作系统导入',
            value: 'operatingSystemReport:import'
          },
          {
            label: ' 年龄导入',
            value: 'ageRangeReport:import'
          },
          {
            label: ' 兴趣导入',
            value: 'interestTypeReport:import'
          },
          {
            label: ' 性别导入',
            value: 'genderReport:import'
          },
          {
            label: ' 平台导入',
            value: 'platformReport:import'
          },
          {
            label: ' 网络导入',
            value: 'networkReport:import'
          },
          {
            label: ' 学历导入',
            value: 'educationReport:import'
          },
          {
            label: ' 头条位置导入',
            value: 'locationReport:import'
          },
          {
            label: ' 意图词导入',
            value: 'intentionReport:import'
          },
          {
            label: ' 导入日志',
            value: 'financePerspectiveReportImportLog:list'
          },
          {
            label: ' 日志回退',
            value: 'financePerspectiveReportImportLog:rollback'
          },
          {
            label: ' 关键词列表',
            value: 'financeKeywordReport:list'
          },
          {
            label: ' 地域列表',
            value: 'financeRegionReport:list'
          },
          {
            label: ' 时段列表',
            value: 'financeTimeShareReport:list'
          },
          {
            label: ' 搜索词列表',
            value: 'financeSearchKeywordReport:list'
          },
          {
            label: ' 操作系统列表',
            value: 'operatingSystemReport:list'
          },
          {
            label: ' 年龄列表',
            value: 'ageRangeReport:list'
          },
          {
            label: ' 兴趣列表',
            value: 'interestTypeReport:list'
          },
          {
            label: ' 性别列表',
            value: 'genderReport:list'
          },
          {
            label: ' 平台列表',
            value: 'platformReport:list'
          },
          {
            label: ' 网络列表',
            value: 'networkReport:list'
          },
          {
            label: ' 学历列表',
            value: 'educationReport:list'
          },
          {
            label: ' 头条位置列表',
            value: 'locationReport:list'
          },
          {
            label: '意图词列表',
            value: 'intentionReport:list'
          }
        ]
      }
    ]
  },
  {
    label: '留言列表',
    children: [
      {
        label: '留言列表',
        children: [
          {
            label: ' 列表',
            value: 'projectFeedback:list'
          },
          {
            label: ' 删除',
            value: 'projectFeedback:delete'
          },
          {
            label: ' 销毁',
            value: 'projectFeedback:remove'
          },
          {
            label: ' 查看详细信息',
            value: 'projectFeedback:showDetailed'
          }
        ]
      }
    ]
  },
  {
    label: '财务报表',
    children: [
      {
        label: '推广平台返点',
        children: [
          {
            label: ' 列表',
            value: 'financeChannelAccountRebatesRate:list'
          },
          {
            label: ' 添加',
            value: 'financeChannelAccountRebatesRate:add'
          },
          {
            label: ' 修改',
            value: 'financeChannelAccountRebatesRate:edit'
          },
          {
            label: ' 删除',
            value: 'financeChannelAccountRebatesRate:delete'
          }
        ]
      },
      {
        label: '客户返点率',
        children: [
          {
            label: ' 列表',
            value: 'projectRebatesRate:list'
          },
          {
            label: ' 添加',
            value: 'projectRebatesRate:add'
          },
          {
            label: ' 修改',
            value: 'projectRebatesRate:edit'
          },
          {
            label: ' 删除',
            value: 'projectRebatesRate:delete'
          },
          {
            label: ' 改返点',
            value: 'projectRebatesRate:ajaxChange'
          },
          {
            label: ' 返点记录',
            value: 'projectRebatesRate:ajaxShowChangeLog'
          }
        ]
      },
      {
        label: '客户付款',
        children: [
          {
            label: ' 列表',
            value: 'financeItemPayment:list'
          },
          {
            label: ' 添加',
            value: 'financeItemPayment:add'
          },
          {
            label: ' 修改',
            value: 'financeItemPayment:edit'
          },
          {
            label: ' 撤销',
            value: 'financeItemPayment:modalRevoke'
          },
          {
            label: ' 下载',
            value: 'financeItemPayment:download'
          }
        ]
      },
      {
        label: '客户项目余额',
        children: [
          {
            label: ' 列表',
            value: 'financeItemMoney:list'
          },
          {
            label: ' 转出',
            value: 'financeItemMoney:modalTransfer'
          },
          {
            label: ' 退款',
            value: 'financeItemMoney:modalRefund'
          }, {
            label: ' 下载',
            value: 'financeItemMoney:download'
          }
        ]
      },
      {
        label: '余额转出记录',
        children: [
          {
            label: ' 列表',
            value: 'financeItemMoney:transferList'
          }
        ]
      },
      {
        label: '退款记录',
        children: [
          {
            label: ' 列表',
            value: 'financeItemMoney:refundList'
          }
        ]
      },
      {
        label: '账户余额',
        children: [
          {
            label: ' 列表',
            value: 'financeChannelAccountCoin:list'
          },
          {
            label: ' 校准',
            value: 'financeChannelAccountCoin:modalCorrect'
          },
          {
            label: ' 打款',
            value: 'financeChannelAccountPayment:pay'
          },
          {
            label: ' 校准记录',
            value: 'financeChannelAccountCoin:modalCorrectList'
          },
          {
            label: ' 下载',
            value: 'financeChannelAccountCoin:download'
          }
        ]
      },
      {
        label: '平台打款记录',
        children: [
          {
            label: ' 列表',
            value: 'financeChannelAccountPayment:list'
          },
          {
            label: ' 撤销',
            value: 'financeChannelAccountPayment:modalRevoke'
          },
          {
            label: ' 下载',
            value: 'financeChannelAccountPayment:download'
          }
        ]
      },
      {
        label: '项目消费报表',
        children: [
          {
            label: ' 项目日总报表',
            value: 'analysisDailyConsumption:item'
          },
          {
            label: ' 项目平台日报表',
            value: 'analysisDailyConsumption:itemPlatform'
          },
          {
            label: ' 项目平台日报表-导出',
            value: 'analysisDailyConsumption:downloadPlatform'
          },
          {
            label: ' 项目设备日报表',
            value: 'analysisDailyConsumption:itemDevice'
          },
          {
            label: ' 项目计划日报表',
            value: 'analysisDailyConsumption:itemPlan'
          },
          {
            label: ' 项目消费月报表',
            value: 'analysisItemPerformance:month'
          },
          {
            label: ' 项目消费月报-导出',
            value: 'analysisItemPerformance:monthExport'
          },
          {
            label: ' 项目平台消费月报',
            value: 'analysisItemPlatformPerformance:month'
          },
          {
            label: ' 渠道类型日报权限',
            value: 'analysisChannelPerformance:daily'
          },
          {
            label: ' 渠道类型月报权限',
            value: 'analysisChannelMonthPerformance:month'
          }
        ]
      },
      {
        label: '账户消费报表',
        children: [
          {
            label: ' 账户日总报表',
            value: 'analysisDailyConsumption:accountPlatform'
          },
          {
            label: ' 账户日总报表-导出',
            value: 'analysisDailyConsumption:downloadAccount'
          },
          {
            label: ' 账户设备日消费报表',
            value: 'analysisDailyConsumption:accountDevice'
          },
          {
            label: ' 账户消费月报表',
            value: 'analysisAccountPerformance:month'
          },
          {
            label: ' 账户消费月报-导出',
            value: 'analysisAccountPerformance:monthExport'
          }
        ]
      },
      {
        label: '平台消费报表',
        children: [
          {
            label: ' 平台消费月报',
            value: 'analysisPlatformMonthConsumption:platformMonthConsumption'
          },
          {
            label: ' 渠道消费日报',
            value: 'analysisChannelTypePerformance:daily'
          },
          {
            label: ' 渠道消费月报',
            value: 'analysisChannelTypePerformance:month'
          },
          {
            label: ' 平台消费日报',
            value: 'analysisPlatformPerformance:daily'
          },
          {
            label: ' 导出',
            value: 'analysisPlatformPerformance:dailyExport'
          }
        ]
      },
      {
        label: '销售业绩日报',
        children: [
          {
            label: ' 列表',
            value: 'analysisSalesPerformance:daily'
          },
          {
            label: ' 导出',
            value: 'analysisSalesPerformance:dailyExport'
          }
        ]
      }
    ]
  },
  {
    label: '数据分析',
    children: [
      {
        label: '账户分析',
        children: [
          {
            label: ' 项目关键词分析',
            value: 'financeKeywordReport:list'
          },
          {
            label: ' 项目搜索词分析',
            value: 'analysisSearchKeywordConsumption:search'
          },
          {
            label: ' 项目搜索词分析下载',
            value: 'analysisSearchKeywordConsumption:download'
          },
          {
            label: ' 项目关键词分析下载',
            value: 'itemKeywordConsumption:download'
          },
          {
            label: ' 项目账户分析',
            value: 'analysisBidKeywordConsumption:account'
          },
          {
            label: ' 项目地域分析',
            value: 'analysisBidRegionConsumption:region'
          },
          {
            label: ' 项目时段分析',
            value: 'analysisInformationTime:list'
          }
        ]
      },
      {
        label: '项目分析',
        children: [
          {
            label: ' 项目词性分析',
            value: 'analysisBidKeywordConsumption:item'
          },
          {
            label: ' 项目词性日报',
            value: 'analysisItemKeyword:itemNatureDay'
          },
          {
            label: ' 项目词性月报',
            value: 'analysisItemKeyword:itemNaturePerformance'
          },
          {
            label: ' 项目地域日报',
            value: 'analysisItemRegion:provinceCityDay'
          },
          {
            label: ' 项目地域月报',
            value: 'analysisItemRegion:itemRegionPerformance'
          }
        ]
      },
      {
        label: '行业分析-竞价',
        children: [
          {
            label: ' 行业日报',
            value: 'industryDataAnalyse:daily'
          },
          {
            label: ' 行业月报',
            value: 'industryDataAnalyse:month'
          },
          {
            label: ' 行业词性月报',
            value: 'analysisIndustryKeywordPerformance:month'
          },
          {
            label: ' 行业地域月报',
            value: 'analysisIndustryRegionPerformance:month'
          }
        ]
      },
      {
        label: '大数据汇总',
        children: [
          {
            label: ' 省份日报',
            value: 'provinceConsumption:daily'
          },
          {
            label: ' 省份月报',
            value: 'provinceConsumption:month'
          },
          {
            label: ' 城市日报',
            value: 'analysisRegionDataCity:daily'
          },
          {
            label: ' 城市月报',
            value: 'analysisRegionDataCity:month'
          },
          {
            label: ' 词性日报',
            value: 'natureDataAnalyse:daily'
          },
          {
            label: ' 词性月报',
            value: 'natureDataAnalyse:month'
          }
        ]
      },
      {
        label: '信息流-账户分析',
        children: [
          {
            label: '意图词分析',
            value: 'itemInfoFlowIntentionAnalysis:list'
          },
          {
            label: '设备/操作系统分析',
            value: 'clientSystem:list'
          },
          {
            label: '性别分析',
            value: 'analysisBidSex:list'
          },
          {
            label: '年龄分析',
            value: 'informationAgeReport:list'
          },
          {
            label: '兴趣分析',
            value: 'informationHobbyReport:list'
          },
          {
            label: '学历分析',
            value: 'informationEducationReport:list'
          },
          {
            label: '网络分析',
            value: 'informationNetReport:list'
          },
          {
            label: '头条位置分析',
            value: 'locationReport:analyse'
          }
        ]
      },
      {
        label: '信息流日月报',
        children: [
          {
            label: '分时日报',
            value: 'itemTimeShareConsumption:daily'
          },
          {
            label: '网络日报',
            value: 'networkInfoFlowDayReport:list'
          },
          {
            label: '地域日报',
            value: 'regionInfoFlowDayReport:list'
          },
          {
            label: '性别日报',
            value: 'genderInfoFlowDayReport:list'
          },
          {
            label: '性别月报',
            value: 'genderMonthReport:list'
          },
          {
            label: '学历日报',
            value: 'educationInfoFlowDayReport:list'
          },
          {
            label: '年龄日报',
            value: 'ageInfoFlowDayReport:list'
          },
          {
            label: '年龄月报',
            value: 'ageInfoFlowMonthReport:list'
          },
          {
            label: '兴趣日报',
            value: 'interestTypeInfoFlowDayReport:list'
          },
          {
            label: '意图词日报',
            value: 'intentionInfoFlowDayReport:list'
          },
          {
            label: '头条位置日报',
            value: 'locationReport:getDailyReport'
          },
          {
            label: '分时月报',
            value: 'itemTimeShareConsumption:month'
          },
          {
            label: '网络月报',
            value: 'networkReport:getMonthReport'
          },
          {
            label: '意图词月报',
            value: 'intentionReport:getMonthReport'
          }, {
            label: '兴趣月报',
            value: 'interestTypeReport:monthReports'
          }, {
            label: '学历月报',
            value: 'educationReport:monthReports'
          },
          {
            label: '地域月报',
            value: 'regionReport:monthReports'
          },
          {
            label: '头条位置月报',
            value: 'locationReport:getMonthReport'
          }
        ]
      }
      // {
      //   label: '渠道设备页面效果报告',
      //   children: [
      //     {
      //       label: ' 列表',
      //       value: 'analysisItemSolutionPageReport:ItemDevice'
      //     }
      //   ]
      // }
    ]
  },
  {
    label: '图表中心',
    children: [
      {
        label: '账户分析',
        children: [
          {
            label: ' 城市占比图',
            value: 'analysisItemRegion:getPlatformCityPie'
          },
          {
            label: ' 省份占比图',
            value: 'analysisItemRegion:getPlatformProvincePie'
          },
          {
            label: ' 词性占比图',
            value: 'itemAccountKeywordDailyConsumptions:pie'
          },
          {
            label: ' 分时占比图',
            value: 'analysisItemTimeSharePie:accountTimeSharePie'
          }
        ]
      },
      {
        label: '行业分析',
        children: [
          {
            label: ' 词性柱状图',
            value: 'analysisIndustryKeywordPerformance:pillar'
          },
          {
            label: ' 词性占比图',
            value: 'analysisIndustryKeywordPerformance:pie'
          },
          {
            label: ' 地域柱状图',
            value: 'analysisIndustryRegionPerformance:pillar'
          },
          {
            label: ' 地域占比图',
            value: 'analysisIndustryRegionPerformance:pie'
          }
        ]
      },
      {
        label: '项目分析',
        children: [
          {
            label: ' 词性柱状图',
            value: 'analysisItemKeyword:itemNatureHistogramChart'
          },
          {
            label: ' 词性占比图',
            value: 'analysisItemKeyword:itemNatureChart'
          },
          {
            label: ' 地域柱状图',
            value: 'analysisItemRegion:itemRegionHistogramChart'
          },
          {
            label: ' 省份占比图',
            value: 'analysisItemRegion:itemRegionCostCoin'
          },
          {
            label: ' 城市占比图',
            value: 'analysisItemRegion:itemRegionChart'
          },
          {
            label: ' 渠道类型柱状图',
            value: 'itemChannelTypeEffects:bar'
          },
          {
            label: ' 渠道类型占比图',
            value: 'itemChannelTypeEffects:pie'
          }
        ]
      },
      {
        label: '总数据分析',
        children: [
          {
            label: ' 词性月占比图',
            value: 'natureDataAnalyse:monthPie'
          },
          {
            label: ' 行业月占比图',
            value: 'industryDataAnalyse:monthPie'
          },
          {
            label: ' 省份月占比图',
            value: 'provinceConsumption:pie'
          },
          {
            label: ' 城市月占比图',
            value: 'analysisRegionDataCity:pie'
          },
          {
            label: ' 渠道类型月占比图',
            value: 'channelTypeAnalysis:monthPie'
          }
        ]
      }
    ]
  },
  {
    label: '公司资料',
    children: [
      {
        label: '操作权限',
        children: [
          {
            label: ' 列表',
            value: 'companyInformation:list'
          },
          {
            label: ' 添加',
            value: 'companyInformation:add'
          },
          {
            label: ' 编辑',
            value: 'companyInformation:edit'
          },
          {
            label: ' 删除',
            value: 'companyInformation:delete'
          },
          {
            label: ' 查看资料类型',
            value: 'informationType:list'
          },
          {
            label: ' 添加资料类型',
            value: 'informationType:add'
          }
        ]
      },
      {
        label: '菜单权限',
        children: [
          {
            label: ' 销售部',
            value: 'companyInformation:sale'
          },
          {
            label: ' 优化部',
            value: 'companyInformation:majorization'
          },
          {
            label: ' 人事部',
            value: 'companyInformation:HR'
          },
          {
            label: ' 客服部',
            value: 'companyInformation:service'
          },
          {
            label: ' 品牌中心',
            value: 'companyInformation:brand'
          },
          {
            label: ' 研发部',
            value: 'companyInformation:development'
          },
          {
            label: ' 财务部',
            value: 'companyInformation:finance'
          },
          {
            label: ' 媒介部',
            value: 'companyInformation:media'
          }
        ]
      }
    ]
  },
  {
    label: '系统设置',
    children: [
      {
        label: '部门架构',
        children: [
          {
            label: ' 列表',
            value: 'systemDepartment:list'
          },
          {
            label: ' 添加',
            value: 'systemDepartment:modalAdd'
          },
          {
            label: ' 修改',
            value: 'systemDepartment:modalEdit'
          },
          {
            label: ' 删除',
            value: 'systemDepartment:delete'
          },
          {
            label: ' 用户列表',
            value: 'systemUser:list'
          },
          {
            label: ' 添加用户',
            value: 'systemUser:add'
          },
          {
            label: ' 修改用户',
            value: 'systemUser:edit'
          },
          {
            label: ' 用户离职',
            value: 'systemUser:leave'
          }
        ]
      },
      {
        label: '系统角色',
        children: [
          {
            label: ' 列表',
            value: 'systemRole:list'
          },
          {
            label: ' 添加',
            value: 'systemRole:add'
          },
          {
            label: ' 修改',
            value: 'systemRole:edit'
          },
          {
            label: ' 添加权限',
            value: 'systemMenuPerm:perm'
          }
        ]
      },
      {
        label: '系统用户',
        children: [
          {
            label: ' 列表',
            value: 'systemUsers:list'
          },
          {
            label: ' 重置密码',
            value: 'systemUser:resetPwd'
          }
        ]
      }
    ]
  },
  {
    label: '其他设置',
    children: [
      {
        label: '首页权限',
        children: [
          {
            label: ' 显示欠费统计',
            value: 'index:showItemMoneyStatistics'
          },
          {
            label: ' 显示项目月增长统计',
            value: 'index:showItemMonthGrowths'
          },
          {
            label: ' 显示客户月增长统计',
            value: 'index:showCustomerMonthGrowths'
          },
          {
            label: ' 显示项目近日消费统计',
            value: 'index:showItemNearlyConsumptions'
          }
        ]
      },
      {
        label: '财务特权',
        children: [
          {
            label: ' 显示利润',
            value: 'finance:showProfit'
          },
          {
            label: ' 显示消费现金',
            value: 'finance:showCostMoney'
          }
        ]
      },
      {
        label: '编辑器支持',
        children: [
          {
            label: ' Kind上传',
            value: 'supportEditorKind:upload'
          },
          {
            label: ' 推广页图片上传',
            value: 'supportEditorPageDesign:uploadFile'
          }
        ]
      }
    ]
  }
]

export default {
  permissionList
}
