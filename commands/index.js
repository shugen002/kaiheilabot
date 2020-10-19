var server = require('../server')
var allowChannel = ['1689186694180743']
var r = require('./r')
var jrrp = require('./jrrp')
var ti = require('./ti')
var li = require('./li')
var rd10 = require('./rd10')
var rd100 = require('./rd100')
var rd = require('./rd')
module.exports = function (message) {
  if (!allowChannel.includes(message.channelId)) {
    return
  }
  var line = message.content.split(' ')
  var command = line.shift().split('')
  command.shift()
  command = command.join('')
  if (commands[command]) {
    commands[command].exec(line, message)
  }
}
var commands = {
  help: {
    description: '帮助',
    exec (params, msg) {
      params = params.filter((e) => {
        return e !== ''
      })
      if (params.length === 0) {
        var result = []
        for (const command in commands) {
          if (commands[command]) {
            result.push(`.${command.toString()} ${commands[command].description}`)
          }
        }
        msg.reply(result.join('\n'))
      } else {
        if (commands[params[0]]) {
          msg.reply(commands[params[0]].help || commands[params[0]].description || '没有任何帮助信息诶')
        } else {
          msg.reply('没有此条命令')
        }
      }
    }
  },
  r,
  jrrp,
  ti,
  li,
  rd10,
  rd100,
  rd
}
