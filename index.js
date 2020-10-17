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
var wrtc = require('wrtc')
Object.assign(global, wrtc)

var RongIMLib = require('./RongIMLib')
var RongIMClient = RongIMLib.RongIMClient

var {
  EventEmitter
} = require('events')
const {
  TextMessage, AddReaction, RemoveReaction
} = require('./msgType')
var eventBus = new EventEmitter()

RongIMClient.init('qd46yzrfqp4qf')

RongIMClient.registerMessageType(
  'SightMessage',
  'RC:SightMsg',
  new RongIMLib.MessageTag(true, true),
  ['name', 'size', 'fileType', 'sightUrl', 'width', 'height', 'extra']
)
RongIMClient.registerMessageType(
  'custom',
  'custom',
  new RongIMLib.MessageTag(true, true),
  ['content']
)
RongIMClient.registerMessageType(
  'VideoMsg',
  'KH:VideoMsg',
  new RongIMLib.MessageTag(true, true),
  ['content', 'extra']
)
RongIMClient.registerMessageType(
  'WelcomeMsg',
  'KH:WelcomeMsg',
  new RongIMLib.MessageTag(true, true),
  ['content', 'extra']
)
RongIMClient.registerMessageType(
  'AudioMsg',
  'KH:AudioMsg',
  new RongIMLib.MessageTag(true, true),
  ['content', 'duration', 'voice', 'extra']
)
RongIMClient.setConnectionStatusListener({
  onChanged: (...args) => {
    console.log('ConnectionStatusChanged', ...args)
  }
})
RongIMClient.setOnReceiveMessageListener({
  onReceived: (...args) => {
    if (args[1] === 0) {
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

var server = require('./server')
server.connect()

var Commands = require('./commands')
eventBus.on('message', (e) => {
  if (e.content.startsWith('.') || e.content.startsWith('。')) {
    Commands(e)
  }
})

var Reactions = require('./reactions')
eventBus.on('addReaction', (e) => {
  Reactions('add', e)
})
eventBus.on('removeReaction', (e) => {
  Reactions('remove', e)
})
