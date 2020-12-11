const { rollCommand } = require('./r')
module.exports = {
  description: '等价于 ".r dn" , n默认为100',
  help:
    '命令格式： .rd n',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    params = params.filter((e) => {
      return e !== ''
    })
    if (params.length !== 0) {
      if (params[0].match(/^\d+$/) !== null) {
        const num = parseInt(params[0])
        if (num > 0 && num <= 999) {
          return message.reply(rollCommand(`d${num}`))
        }
      }
      message.reply('参数有误，自动 n=100\n' + rollCommand('d100'))
    } else {
      message.reply(rollCommand('d100'))
    }
  }
}
