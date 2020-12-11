const storage = require('../../storage')
const { checkSuccess } = require('./cocConsts')
const { roll } = require('../r')
module.exports = {
  description: '进行奖励骰属性检定',
  help:
    '命令格式 .rb 属性 例如:\n.rb 技术',
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
      return message.reply('使用 .help rb 查看帮助')
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
      const extra = Math.floor(Math.random() * 10)
      const value = roll(100)
      const point = Math.floor(value % 10)
      let value2 = extra * 10 + point
      if (value2 === 0) {
        value2 = 100
      }
      const finalValue = Math.min(value, value2)

      const result = checkSuccess(finalValue, player.attributes[params[0]])

      const log = `对 ${player.name || message.userId} 进行 ${params[0]} 奖励骰检定，D100=${value}，奖励骰${extra}，最终结果 ${finalValue}/${player.attributes[params[0]]}，${result.msg}`
      message.reply(log)
    } else {
      message.reply(`${player.name || message.userId} 没有 ${params[0]} 这个属性/技能值`)
    }
  }
}
