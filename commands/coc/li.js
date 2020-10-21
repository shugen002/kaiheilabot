var { roll } = require('../r')
var { li, phobia, mania } = require('./cocConsts')
module.exports = {
  description: '疯狂发作-临时症状',
  help:
    '命令格式： .li',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    var value = roll(10)
    var out = `疯狂发作-总结症状: \n1D10=${value}\n症状: \n${li[value - 1].replace('{1}', '' + roll(10))}`
    if (value === 9) {
      var value2 = roll(100)
      out = `${out}\n1D100=${value2}\n恐惧症：\n${phobia[value2 - 2]}`
    } else if (value === 10) {
      var value3 = roll(100)
      out = `${out}\n1D100=${value3}\n躁狂症：\n${mania[value3 - 2]}`
    }
    message.reply(out)
  }
}
