module.exports = {
  description: '最基础的roll点命令',
  help:
    '命令格式： .r dice表达式\n1、基础用法\n> .r 数量d面数\n投出 数量 枚 面数 面的骰子\n例如:\n> 3d6\n< 投出了 3d6 骰子，结果: (6+6+5) = 17\n投出了 3 枚 6 面的骰子得到结果 17\n\n2、叠加用法\n可以使用+-进行加减计算\n> .r 数量①d面数①+数量②d面数②-数量③d面数③\n投出 数量① 枚 面数① 面的骰子 得到 a\n投出 数量② 枚 面数② 面的骰子 得到 b\n投出 数量③ 枚 面数③ 面的骰子 得到 c\n最终结果 a+b-c\n例如：\n> .r 3d6+4d6+6d10+7d100\n< 投出了 3d6+4d6+6d10+7d100 骰子，结果: (6+6+5)+(6+5+3+4)+(6+10+6+2+10+5)+(11+17+91+16+82+28+62) = 381\n\n3、常数\n例如:\n> .r 1+1\n< 投出了 1+1 骰子，结果: 1+1 = 2\n\n4、当数量为1时，可以省略\n> .r d6\n< 投出了 d6 骰子，结果: (4) = 4',
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
      message.reply('使用 .help r 查看帮助')
    } else {
      message.reply(rollCommand(params[0]))
    }
  },
  roll,
  RollFormat,
  rollCommand
}

function rollCommand (format) {
  const result = RollFormat(format)
  if (result.success) {
    return `投出了 ${format} 骰子，结果: ${result.form} = ${result.value}`
  } else {
    return `执行中发生错误: ${result.reason}`
  }
}
function roll (max) {
  return Math.floor(Math.random() * max + 1)
}

function RollFormat (input, maxValue = false) {
  var result = {
    success: false,
    value: 0,
    form: '',
    reason: ''
  }
  input = input.toLowerCase()
  if (input.match(/^[1234567890d+-]+$/) == null) {
    result.success = false
    result.reason = '错误的格式'
    return result
  }
  if (input.length > 100) {
    result.success = false
    result.reason = '过长的输入'
    return result
  }
  input = input.split('+').join(' + ')
    .split('-').join(' - ')
    .replace(/ {2,}/g, ' ').split(' ')
  try {
    const form = input.map((e) => {
      if (e === '+') {
        return {
          type: 'plus'
        }
      } else if (e === '-') {
        return {
          type: 'minus'
        }
      } else if (e === '') {
        throw new Error('错误的格式')
      }
      const dice = e.split('d')
      if (dice.length === 1) {
        return {
          type: 'const',
          value: parseInt(dice)
        }
      } else if (dice.length === 2) {
        if (dice[0] === '') {
          dice[0] = '1'
        }
        if (dice[1] === '') {
          throw new Error('错误的格式')
        }
        if (dice[0].length > 3 || dice[1].length > 3) {
          throw new Error('过大的数字')
        }
        const num = parseInt(dice[0])
        const max = parseInt(dice[1])
        if (num === 0 || max === 0) {
          throw new Error('错误的格式')
        }
        return {
          type: 'dice',
          num,
          max
        }
      } else {
        throw new Error('错误的格式')
      }
    })
    var last = { type: '' }
    var value = 0
    var totaldice = 0
    for (let index = 0; index < form.length; index++) {
      const element = form[index]
      if (element.type === last.type) {
        throw new Error('错误的格式')
      }
      switch (element.type) {
        case 'minus':
        case 'plus':
          if (last.type === 'minus' || last.type === 'plus') {
            throw new Error('错误的格式')
          }
          break
        case 'const':
          if (last.type === 'minus') {
            result.form = result.form + `-${element.value}`
            value = value - element.value
          } else {
            if (result.form === '') {
              result.form = result.form + element.value
            } else {
              result.form = result.form + `+${element.value}`
            }
            value = value + element.value
          }
          break
        case 'dice':
          if (element.num > 100 || element.max > 999) {
            throw new Error('骰子面数过多或骰子数量过多')
          }
          totaldice += element.num * element.max
          if (totaldice > 100000000) {
            throw new Error('骰子总面数过多')
          }
          var dices = []
          for (let i = 0; i < element.num; i++) {
            dices.push(roll(element.max))
          }
          var text = dices.join('+')
          var totalDice = 0
          dices.forEach((e) => { totalDice += e })
          if (last.type === 'minus') {
            result.form = result.form + `-(${text})`
            value = value - totalDice
          } else {
            if (result.form === '') {
              result.form = result.form + `(${text})`
            } else {
              result.form = result.form + `+(${text})`
            }
            value = value + totalDice
          }
          break
        default:
          throw new Error('错误的格式')
      }
      last = element
    }
    result.value = value
    result.success = true
  } catch (error) {
    result.form = ''
    result.success = false
    result.reason = error.message
  }
  return result
}
