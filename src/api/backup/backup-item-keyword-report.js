/**
 *Created by Heqi on 2018/5/14.
 */

import http from '@/utils/http'

const URL = '/rest/boss/backup/keyword-report/list'

export default {
  list ({date, platformId, account, itemTitle, keyword, category, nature, industry, dataGroup, orderBy, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        startTime: date[0],
        endTime: date[1],
        platformId: platformId,
        accountTitle: account,
        itemTitle: itemTitle,
        keyWord: keyword,
        keywordCategoryTitle: category,
        keywordNatureTitle: nature,
        industry: industry,
        dataGroup: dataGroup,
        orderBy: orderBy,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
