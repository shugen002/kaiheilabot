var r = require('./r')
var jrrp = require('./jrrp')
var enable = require('./enable')
var setAdmin = require('./setAdmin')
var addChannel = require('./addChannel.js')
var ti = require('./coc/ti')
var li = require('./coc/li')
var rd10 = require('./rd10')
var rd100 = require('./rd100')
var rd = require('./rd')
var st = require('./coc/st')
var ra = require('./coc/ra')
var cocname = require('./coc/cocname')
var coc7 = require('./coc/coc7')
var inherit = require('./coc/inherit')
var rb = require('./coc/rb')
var rp = require('./coc/rp')
var sc = require('./coc/sc')
// var dump = require('./dump')
const storage = require('../storage')
const server = require('../server')
module.exports = async function (message) {
  const guild = storage.getGuild(message.guildId)
  if (!guild.admin) {
    const guildInfo = await server.getGuildInfo(message.guildId)
    guild.admin = [guildInfo.user_id]
    guild.owner = guildInfo.user_id
  }
  if (guild.admin.includes(message.userId)) {
    message.isAdmin = true
  }

  const channel = storage.getChannel(message.channelId)
  var line = message.content.split(' ')
  var command = line.shift().split('')
  command.shift()
  command = command.join('')
  if (guild.enable && guild.allowChannel && guild.allowChannel.includes(message.channelId)) {

  } else if (message.isAdmin && (command === 'enable')) {

  } else if (guild.enable && message.isAdmin && (command === 'addChannel')) {

  } else {
    return
  }
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
  rd,
  st,
  ra,
  cocname,
  coc7,
  // dump,
  inherit,
  rb,
  rp,
  sc,
  enable,
  setAdmin,
  addChannel
}
