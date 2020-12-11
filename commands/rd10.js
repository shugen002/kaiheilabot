const { rollCommand } = require('./r')
module.exports = {
  description: '等价于.r d10',
  help:
    '命令格式： .rd10',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    message.reply(rollCommand('d10'))
  }
}
