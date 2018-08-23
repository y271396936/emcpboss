/**
 *Created by Heqi on 2017/12/30.
 */

import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { ItemSearchArgument } from '@/models/report/item-daily-consumption'
import { DeviceSearchArgument } from '@/models/report/item-device-daily-consumption'
import { PlanSearchArgument } from '@/models/report/item-plan-daily-consumption'

const ITEM_URL = '/rest/boss/report/daily-consumptions/item-consumptions'
const PLATFORM_URL = '/rest/boss/report/daily-consumptions/item-platform-consumptions'
const DEVICE_URL = '/rest/boss/report/daily-consumptions/item-device-consumptions'
const PLAN_URL = '/rest/boss/report/daily-consumptions/item-plan-consumptions'

export default {
  listItemConsumption ({search}, cb) {
    http.get(ITEM_URL, {
      params: convert.toJson(search, ItemSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listPlatformConsumption ({search}, cb) {
    http.get(PLATFORM_URL, {
      params: convert.toJson(search, DeviceSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listDeviceConsumption ({search}, cb) {
    http.get(DEVICE_URL, {
      params: convert.toJson(search, DeviceSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listPlanConsumption ({search}, cb) {
    http.get(PLAN_URL, {
      params: convert.toJson(search, PlanSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
