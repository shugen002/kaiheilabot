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
    const guild = storage.getGuild(message.guildId)
    guild.enable = true
    return message.reply('此服务器已启用')
  }
}
