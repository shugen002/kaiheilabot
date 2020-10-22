var server = require('../server')
var storage = require('../storage')
module.exports = {
  description: 'setAdmin',
  help:
    'setAdmin',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  async exec (params, message) {
    if (!message.isAdmin) {
      return
    }
    if (params.length === 0 || !message.extra.mention || message.extra.mention.length <= 0) {
      return message.reply('参数有误')
    }
    const guild = storage.getGuild(message.guildId)
    if (guild.admin.includes(message.extra.mention[0])) {
      return message.reply('nothing happen')
    } else {
      guild.admin.push(message.extra.mention[0])
    }
  }
}
