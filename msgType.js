var server = require('./server')
var RongIMLib = require('./RongIMLib')
var RongIMClient = RongIMLib.RongIMClient
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
    sendMessage(this.channelId,
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
            nickname: 'I am a ROBOT',
            username: 'I am a ROBOT',
            identify_num: '4844',
            avatar: 'https://img.kaiheila.cn/avatars/2020-10/9Kc27NEcZt08c08c.jpg/icon',
            id: '1795611792'
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

function sendMessage (channelId, textMessage) {
  return new Promise((resolve, reject) => {
    RongIMClient.getInstance().sendMessage(
      3,
      channelId,
      textMessage, {
        onSuccess: resolve,
        onError: reject
      },
      false,
      'Push 显示内容',
      'Push 通知时附加信息',
      null, {}
    )
  })
}

module.exports = {
  TextMessage
}
