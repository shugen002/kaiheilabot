const { roll } = require('../r')
module.exports = {
  description: '获取基础属性',
  help:
    '命令格式： .coc7',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    let num = 1
    if (params[0] && params[0].match(/\d+/)) {
      num = Math.max(1, Math.min(parseInt(params[0]), 10))
    }
    let out = ''
    for (let index = 0; index < num; index++) {
      out += `力量:${5 * (roll(6) + roll(6) + roll(6))} 体质:${5 * (roll(6) + roll(6) + roll(6))} 体型:${5 * (roll(6) + roll(6) + 6)} 敏捷:${5 * (roll(6) + roll(6) + roll(6))} 外貌:${5 * (roll(6) + roll(6) + roll(6))} 智力:${5 * (roll(6) + roll(6) + 6)} 意志:${5 * (roll(6) + roll(6) + roll(6))} 教育:${5 * (roll(6) + roll(6) + 6)} 幸运:${5 * (roll(6) + roll(6) + roll(6))}\n`
    }
    message.reply(out)
  }
}
