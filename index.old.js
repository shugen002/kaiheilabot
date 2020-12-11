// patch nodejs for RongIMLib
global.window = global
global.WebSocket = require('ws')
global.location = {
  protocol: 'https:'
}
global.document = {
  documentElement: {}
}
global.navigator = {
  userAgent: ''
}
global.ActiveXObject = () => {
  return {}
}
const wrtc = require('wrtc')
Object.assign(global, wrtc)

const RongIMLib = require('./RongIMLib')
const RongIMClient = RongIMLib.RongIMClient

const {
  EventEmitter
} = require('events')
const {
  TextMessage, AddReaction, RemoveReaction
} = require('./msgType')
const eventBus = new EventEmitter()

RongIMClient.setOnReceiveMessageListener({
  onReceived: (...args) => {
    if (!args[0].offLineMessage) {
      const msg = args[0]
      if (msg.messageType === 'TextMessage' && msg.objectName === 'RC:TxtMsg') {
        if (msg.conversationType === 3 && typeof msg.content.content === 'string') {
          eventBus.emit('message', new TextMessage(msg))
        }
        if (msg.conversationType === 3 && typeof msg.content.content === 'object') {
          if (msg.content.content.type === 'add_reaction') {
            eventBus.emit('addReaction', new AddReaction(msg))
          } else if (msg.content.content.type === 'delete_reaction') {
            eventBus.emit('removeReaction', new RemoveReaction(msg))
          }
        }
      }
    }
  }
})

const server = require('./server')
server.connect()

const Commands = require('./commands')
eventBus.on('message', (e) => {
  if (e.content.startsWith('.') || e.content.startsWith('。')) {
    Commands(e)
  }
})

const Reactions = require('./reactions')
eventBus.on('addReaction', (e) => {
  Reactions('add', e)
})
eventBus.on('removeReaction', (e) => {
  Reactions('remove', e)
})
const Client = require('./KaiheilaClient')
