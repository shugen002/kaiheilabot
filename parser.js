
class Parser {
  constructor (client) {
    this.client = client
  }

  parse (e) {
    let result = null
    switch (e.type) {
      case 'CHANNEL_MSG':
        result = new TextMessage(e)
        break

      default:
        return e
        break
    }
    result.client = this.client
    return result
  }
}
class TextMessage {
  constructor (msg) {
    this.type = msg.type
    this.msg = msg
    msg.content = JSON.parse(msg.content)
    this.extra = JSON.parse(msg.content.extra)
    this.content = msg.content.content
    this.guildId = this.extra.guild_id
    this.channelId = msg.toUserId
    this.userId = msg.fromUserId
  }

  /**
   * 回复消息
   * @param {string} content 内容
   */
  reply (content) {
    if (!this.client) {
      console.warn('DO NOT TRY TO REPLY NO CLIENT MESSAGE')
      return
    }
    this.client.sendGroupMessage(this.channelId,
      {
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
            nickname: this.client.user.username,
            username: this.client.user.username,
            identify_num: this.client.user.identify_num,
            avatar: this.client.user.avatar,
            id: this.client.user.id
          },
          quote: {
            create_at: this.msg.sentTime,
            author: this.extra.author,
            type: 1,
            id: this.extra.local_id,
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
      })
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
  Parser,
  TextMessage,
  AddReaction,
  RemoveReaction
}
