var RongIMLib = require('./RongIMLib')
var RongIMClient = RongIMLib.RongIMClient
function patchRongIMClient() {
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
    },
  })
}
module.exports = {
  patchRongIMClient,
}
