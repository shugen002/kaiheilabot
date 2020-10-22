var server = require('../../server')
var storage = require('../../storage')
module.exports = {
  description: '设置名字',
  help:
    '命令格式 .cocname 名字',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    params = params.filter((e) => {
      return e !== ''
    })
    if (params.length === 0) {
      return message.reply('使用 .help cocname 查看帮助')
    }
    let channel = storage.getChannel(message.channelId)
    if (channel.cocInheritChannel) {
      channel = storage.getChannel(channel.cocInheritChannel)
    }
    const player = channel.getUserModule('coc', message.userId)
    player.name = params[0]
    message.reply(`${params[0]} 名字已设定`)
  }
}
