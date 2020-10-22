var storage = require('../../storage')
module.exports = {
  description: '设置继承频道',
  help:
    'inherit #频道名',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  async exec (params, message) {
    if (!message.isAdmin) {
      return message.reply('????你在干什么')
    }
    params = params.filter((e) => { return e !== '' })
    if (typeof params[0] === 'string' && params[0].match(/^#channel:\d+;$/)) {
      const channel = storage.getChannel(message.channelId)
      channel.cocInheritChannel = params[0].match(/^#channel:(\d+);$/)[1]
      message.reply(`设置继承成功 ${params[0]}`)
    } else {
      message.reply('????你在干什么')
    }
  }
}
