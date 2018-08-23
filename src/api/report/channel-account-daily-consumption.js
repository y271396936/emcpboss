/**
 *Created by Heqi on 2018/1/3.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/report/channel-account-daily-consumption'
import { MonthSearchArgument } from '@/models/report/channel-account-month-consumption'

const PLATFORM_URL = '/rest/boss/report/daily-consumptions/account-platform-consumptions'
const DEVICE_URL = '/rest/boss/report/daily-consumptions/account-device-consumptions'
const MONTH_URL = '/rest/boss/report/channel-account-consumptions/month-data'

export default {
  listPlatformConsumption ({search}, cb) {
    http.get(PLATFORM_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listDeviceConsumption ({search}, cb) {
    http.get(DEVICE_URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listMonthConsumption ({search}, cb) {
    http.get(MONTH_URL, {
      params: convert.toJson(search, MonthSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
