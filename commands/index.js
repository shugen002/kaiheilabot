const r = require('./r')
const jrrp = require('./jrrp')
const enable = require('./enable')
const setAdmin = require('./setAdmin')
const addChannel = require('./addChannel.js')
const ti = require('./coc/ti')
const li = require('./coc/li')
const rd10 = require('./rd10')
const rd100 = require('./rd100')
const rd = require('./rd')
const st = require('./coc/st')
const ra = require('./coc/ra')
const cocname = require('./coc/cocname')
const coc7 = require('./coc/coc7')
const inherit = require('./coc/inherit')
const rb = require('./coc/rb')
const rp = require('./coc/rp')
const sc = require('./coc/sc')
// var dump = require('./dump')
const storage = require('../storage')

module.exports = async function (message) {
  const guild = storage.getGuild(message.guildId)
  if (!guild.admin) {
    const guildInfo = await this.msg.getGuildInfo(message.guildId)
    guild.admin = [guildInfo.user_id]
    guild.owner = guildInfo.user_id
  }
  if (guild.admin.includes(message.userId)) {
    message.isAdmin = true
  }

  const channel = storage.getChannel(message.channelId)
  const line = message.content.split(' ')
  let command = line.shift().split('')
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
        const result = []
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
