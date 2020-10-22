var server = require('../server')
module.exports = {
  description: 'dump',
  help:
    'dump',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  async exec (params, message) {
    message.reply(JSON.stringify(await server.getGuildInfo(message.guildId)))
  }
}
