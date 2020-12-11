const storage = require('../../storage')
const { checkSuccess } = require('./cocConsts')
const { roll } = require('../r')
module.exports = {
  description: '进行属性检定',
  help:
    '命令格式 .ra 属性 例如:\n.ra 技术',
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
      return message.reply('使用 .help ra 查看帮助')
    }
    let channel = storage.getChannel(message.channelId)
    if (channel.cocInheritChannel) {
      channel = storage.getChannel(channel.cocInheritChannel)
    }
    const player = channel.getUserModule('coc', message.userId)
    if (!player.attributes) {
      player.attributes = {}
    }
    // @ts-ignore
    if (player.attributes[params[0]] !== undefined) {
      const value = roll(100)
      // @ts-ignore
      const result = checkSuccess(value, player.attributes[params[0]])
      // @ts-ignore
      const log = `对 ${player.name || message.userId} 进行 ${params[0]} 检定，D100=${value}/${player.attributes[params[0]]}，${result.msg}`
      message.reply(log)
    } else {
      message.reply(`${player.name || message.userId} 没有 ${params[0]} 这个属性/技能值`)
    }
  }
}
