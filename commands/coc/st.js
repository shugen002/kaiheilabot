const storage = require('../../storage')
module.exports = {
  description: '设置任务属性',
  help:
    '命令格式 .st 属性数值 例如:\n.st 技术 100',
  /**
   *
   * @param {string[]} params
   * @param {{reply(content:string)=>{}}} message
   */
  exec (params, message) {
    params = params.filter((e) => {
      return e !== ''
    })
    const a = params.join(' ')
    let out = ''
    const lines = a.replace(/(\d+)/g, '$1\n').split('\n')
    let channel = storage.getChannel(message.channelId)
    if (channel.cocInheritChannel) {
      channel = storage.getChannel(channel.cocInheritChannel)
    }
    const player = channel.getUserModule('coc', message.userId)
    if (!player.attributes) {
      player.attributes = {}
    }
    lines.filter((e) => { return e.length > 0 }).forEach((e) => {
      try {
        const value = parseInt(e.match(/\d+/)[0])
        const key = e.replace(/\d/g, '')
        player.attributes[key] = value
        out = out + key + ':' + value + ' '
      } catch (error) {
        console.log(error)
      }
    })
    const log = `设定了属性值：\n ${out}`
    message.reply(log)
  }
}
