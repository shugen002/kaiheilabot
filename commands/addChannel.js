var server = require('../server')
const storage = require('../storage')
module.exports = {
  description: 'enable',
  help:
    'enable',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  async exec (params, message) {
    if (!message.isAdmin) {
      return
    }
    const guild = storage.getGuild(message.guildId)
    if (guild.allowChannel) {
      if (!guild.allowChannel.includes(message.channelId)) {
        guild.allowChannel.push(message.channelId)
      }
    } else {
      guild.allowChannel = [message.channelId]
    }
    return message.reply('此频道已启用')
  }
}
