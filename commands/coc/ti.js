const { roll } = require('../r')
const { ti, phobia, mania } = require('./cocConsts')
module.exports = {
  description: '疯狂发作-临时症状',
  help:
    '命令格式： .ti',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    const value = roll(10)
    let out = `疯狂发作-临时症状: \n1D10=${value}\n症状: \n${ti[value - 1].replace('{1}', '' + roll(10))}`
    if (value === 9) {
      const value2 = roll(100)
      out = `${out}\n1D100=${value2}\n恐惧症：\n${phobia[value2 - 2]}`
    } else if (value === 10) {
      const value3 = roll(100)
      out = `${out}\n1D100=${value3}\n躁狂症：\n${mania[value3 - 2]}`
    }
    message.reply(out)
  }
}
