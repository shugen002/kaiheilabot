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
    message.reply(JSON.stringify(await message.client.getGuildInfo(message.guildId)))
  }
}
