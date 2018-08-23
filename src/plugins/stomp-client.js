import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

let stompClient = null
let endPoint = null

const init = () => {
  if (endPoint === null || typeof endPoint !== 'string' ||
    endPoint.length < 1) {
    throw new Error({
      name: 'Plugins StompClient Error',
      message: 'The `serverEndPoint` must be a string.'
    })
  }

  // 是否已初始化
  if (stompClient !== null) {
    return stompClient
  }

  const socket = new SockJS(endPoint)
  const client = Stomp.over(socket)

  // 关闭 debug
  client.debug = false

  return client
}

// connect(headers, connectCallback)
// connect(headers, connectCallback, errorCallback)
// connect(login, passCode, connectCallback)
// connect(login, passCode, connectCallback, errorCallback)
// connect(login, passCode, connectCallback, errorCallback, host)
const connect = (...args) => {
  if (stompClient === null) {
    stompClient = init()
  }

  stompClient.connect(...args)
}

// disconnect(disconnectCallback, headers={})
const disconnect = (callback, headers = {}) => {
  if (stompClient !== null) {
    stompClient.disconnect(callback, headers)
  }
}

// send(destination, body='', headers={})
const send = (destination, body = '', headers = {}) => {
  if (stompClient === null) {
    stompClient = init()
  }

  stompClient.send(destination, body, headers)
}

// subscribe(destination, callback, headers={})
const subscribe = (destination, callback, headers = {}) => {
  if (stompClient === null) {
    stompClient = init()
  }

  stompClient.subscribe(destination, callback, headers)
}

export default {
  install (Vue, {serverEndPoint}) {
    endPoint = serverEndPoint

    Vue.prototype.$stompClient = {
      connect: connect,
      send: send,
      subscribe: subscribe,
      disconnect: disconnect
    }
  }
}
