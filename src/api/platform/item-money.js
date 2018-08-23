import http from '@/utils/http'
import convert from '@/utils/model-convert'
import { SearchArgument } from '@/models/platform/item-money'
import { TransferSearchArgument, TransferFormArgument } from '@/models/platform/item-money-transfer'
import { RefundSearchArgument, RefundFormArgument } from '@/models/platform/item-money-refund'

const URL = '/rest/boss/platform/item-moneys'
const TRANSFER_LOG = '/rest/boss/platform/item-moneys/transfer'
const REFUND_LOG = '/rest/boss/platform/item-moneys/refund'

export default {
  list ({search}, cb) {
    http.get(URL, {
      params: convert.toJson(search, SearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listTransferLog ({search}, cb) {
    http.get(TRANSFER_LOG, {
      params: convert.toJson(search, TransferSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  listRefundLog ({search}, cb) {
    http.get(REFUND_LOG, {
      params: convert.toJson(search, RefundSearchArgument)
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  transfer ({form}, cb) {
    let postData = convert.toStringify(form, TransferFormArgument)
    http.post(TRANSFER_LOG, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  },
  refund ({form}, cb) {
    let postData = convert.toStringify(form, RefundFormArgument)
    http.post(REFUND_LOG, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => cb(response)).catch(trace => cb(trace.response))
  }
}
