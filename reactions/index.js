var server = require('../server')
var map = {
  9651007314174524: {
    9668844073309392: {
      'BL6H-KDVO-95KC-JF04': {
        '✅': {
          add: {
            action: 'grantRole',
            roleId: 45609
          },
          remove: {
            action: 'revokeRole',
            roleId: 45609
          }
        }
      },
      'BL6H-LJNL-OLAC-JF04': {
        '✅': {
          add: {
            action: 'grantRole',
            roleId: 45610
          },
          remove: {
            action: 'revokeRole',
            roleId: 45610
          }
        }
      }
    }
  }
}

module.exports = function (type, message) {
  if (message.guildId in map &&
    message.channelId in map[message.guildId] &&
    message.targetMessageId in map[message.guildId][message.channelId] &&
    message.emoji.id in map[message.guildId][message.channelId][message.targetMessageId] &&
    type in map[message.guildId][message.channelId][message.targetMessageId][message.emoji.id]
  ) {
    const action = map[message.guildId][message.channelId][message.targetMessageId][message.emoji.id][type]
    switch (action.action) {
      case 'grantRole':
        server.grantRole(message.guildId, message.userId, action.roleId).then((e) => {}).catch((e) => { console.log(e.message) })
        break
      case 'revokeRole':
        server.revokeRole(message.guildId, message.userId, action.roleId).then((e) => {}).catch((e) => { console.log(e.message) })
        break
      default:
        break
    }
  }
}
