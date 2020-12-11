const storage = require('../../storage')
const { checkSuccess } = require('./cocConsts')
const { roll, RollFormat } = require('../r')
module.exports = {
  description: '进行san检定',
  help:
    '命令格式 .sc 成功dice表达式/失败dice表达式 例如:\n.sc 1d10/1d100',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    params = params.filter((e) => {
      return e !== ''
    })
    if (params.length === 0 || params[0].split('/').length !== 2 || params[0].split('/').filter((e) => { return e.length > 0 }).length !== 2) {
      return message.reply('使用 .help sc 查看帮助')
    }
    let channel = storage.getChannel(message.channelId)
    if (channel.cocInheritChannel) {
      channel = storage.getChannel(channel.cocInheritChannel)
    }
    const player = channel.getUserModule('coc', message.userId)
    if (!player.attributes) {
      player.attributes = {}
    }

    if (player.attributes.san !== undefined) {
      const line = params[0].split('/')
      const successroll = line[0]
      const failroll = line[1]
      const successRollResult = RollFormat(successroll)
      let failRollResult = RollFormat(failroll)

      const value = roll(100)
      const checkResult = checkSuccess(value, player.attributes.san)
      const oldsan = player.attributes.san
      const playername = player.name || message.userId
      let out = ''
      if (checkResult.success) {
        player.attributes.san = player.attributes.san - successRollResult.value

        out = `${playername} 的San Check\n1D100=${value}/${oldsan} ${checkResult.msg}\n${playername}的san值减少${successRollResult.value}，剩余${player.attributes.san}`
      } else {
        if (checkResult.msg !== '大失败') {
          player.attributes.san = player.attributes.san - failRollResult.value
          out = `${playername} 的San Check\n1D100=${value}/${oldsan} ${checkResult.msg}\n${playername}的san值减少${failRollResult.value}，剩余${player.attributes.san}`
        } else {
          failRollResult = RollFormat(failroll, true)
          player.attributes.san = player.attributes.san - failRollResult.value
          out = `${playername} 的San Check\n1D100=${value}/${oldsan} ${checkResult.msg}\n${playername}的san值减少${failRollResult.value}，剩余${player.attributes.san}`
        }
      }
      message.reply(out)
    } else {
      message.reply(`${player.name || message.userId} 没有 san 这个属性/技能值`)
    }
  }
}
