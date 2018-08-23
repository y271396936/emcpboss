import http from '@/utils/http'
import Qs from 'qs'

const URL = '/rest/boss/report/effect-reports/daily-data'
const DOWNLOAD_URL = '/rest/boss/report/effect-reports/files'

export default {
  list ({date, regulatorDepartmentId, regulator, page, pageSize}, cb) {
    http.get(URL, {
      params: {
        year: date.split('-')[0],
        month: date.split('-')[1],
        regulatorDepartmentId: regulatorDepartmentId,
        regulator: regulator,
        page: page,
        pageSize: pageSize
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  download ({date, type, regulatorDepartmentId, fileGenre}, cb) {
    let year = date.split('-')[0]
    let month = date.split('-')[1]
    let postData = Qs.stringify({
      year: year,
      month: month,
      type: type,
      regulatorDepartmentId: regulatorDepartmentId,
      fileGenre: fileGenre
    })
    http.post(DOWNLOAD_URL, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
