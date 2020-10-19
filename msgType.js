var server = require('./server')
var RongIMLib = require('./RongIMLib')
class TextMessage {
  constructor (msg) {
    this.msg = msg
    this.extra = JSON.parse(msg.content.extra)
    this.content = msg.content.content
    this.guildId = this.extra.guild_id
    this.channelId = msg.targetId
    this.userId = msg.senderUserId
  }

  /**
   * 回复消息
   * @param {string} content 内容
   */
  reply (content) {
    server.sendMessage(3, this.channelId,
      new RongIMLib.TextMessage({
        messageName: 'TextMessage',
        content: content,
        extra: JSON.stringify({
          type: '1',
          guild_id: this.guildId,
          mention: [],
          mention_all: false,
          mention_roles: [],
          mention_here: false,
          author: {
            nickname: server.user.username,
            username: server.user.username,
            identify_num: server.user.identify_num,
            avatar: server.user.avatar,
            id: server.user.id
          },
          quote: {
            create_at: this.msg.sentTime,
            author: this.extra.author,
            type: 1,
            id: this.msg.messageUId,
            rong_id: this.msg.messageUId,
            notCount: true,
            content: this.msg.content.content,
            attachments: this.msg.content,
            mention_all: this.extra.mention_all,
            mention_here: this.extra.mention_here,
            mention: this.extra.mention,
            in_group: true
          }
        }),
        mentionedInfo: {
          type: 2,
          userIdList: []
        }
      }))
      .then((e) => {})
      .catch(console.error)
  }
}

class AddReaction {
  constructor (msg) {
    this.msg = msg
    this.guildId = msg.targetId.split('_')[1]
    this.userId = msg.content.content.body.user_id
    this.channelId = msg.content.content.body.channel_id
    this.targetMessageId = msg.content.content.body.rong_id
    this.emoji = msg.content.content.body.emoji
  }
}

class RemoveReaction {
  constructor (msg) {
    this.msg = msg
    this.guildId = msg.targetId.split('_')[1]
    this.userId = msg.content.content.body.user_id
    this.channelId = msg.content.content.body.channel_id
    this.targetMessageId = msg.content.content.body.rong_id
    this.emoji = msg.content.content.body.emoji
  }
}

module.exports = {
  TextMessage, AddReaction, RemoveReaction
}
