var { RollFormat } = require('./r')
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
    const result = RollFormat('1d100')
    message.reply(`今天的人品是：${result.value} ，不管今天的人品怎么样，明天我也要看到你活力四射的样子哦！`)
  }
}
