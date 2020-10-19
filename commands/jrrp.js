var { RollFormat } = require('./r')
var storage = require('../storage')
module.exports = {
  description: '今日人品',
  help:
    '命令格式： .jrrp',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    const user = storage.getUser(message.userId)

    if (!user.jrrp) {
      const result = RollFormat('1d100')
      user.jrrp = {
        value: result.value,
        time: Date.now()
      }
      message.reply(`今天的人品是：${result.value} ，不管今天的人品怎么样，明天我也要看到你活力四射的样子哦！`)
    } else {
      const lasttime = new Date(user.jrrp.time)
      if (lasttime.getDate() !== (new Date()).getDate()) {
        const result = RollFormat('1d100')
        user.jrrp = {
          value: result.value,
          time: Date.now()
        }
        message.reply(`今天的人品是：${result.value} ，不管今天的人品怎么样，明天我也要看到你活力四射的样子哦！`)
      } else {
        message.reply(`今天的人品是：${user.jrrp.value} ，不管今天的人品怎么样，明天我也要看到你活力四射的样子哦！`)
      }
    }
  }
}
