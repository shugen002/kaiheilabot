const WebSocket = require('ws')
const axios = require('axios')
const zlib = require('zlib')
const { EventEmitter } = require('events')
const { Parser } = require('./parser')

const CMD = { msg: 0, hs: 1, ping: 2, pong: 3, resume: 4, reconnect: 5, resumeack: 6 }

class KaiheilaClient extends EventEmitter {
  constructor (config = {}) {
    super()
    this.axios = axios.create({
      baseURL: 'https://www.kaiheila.cn/',
      headers: {
        cookie: config.cookie
      }
    })
    this.__interval = null
    this.connection = null
    this.user = {}
    this.parser = new Parser(this)
    this.getUserState().then((e) => {
      console.log(e.user)
      this.user = e.user
      this.proxyUrl = e.proxy_url
      this.rongToken = e.rong_token
      this.connection = new WebSocket(this.proxyUrl)
      this.connection.on('open', this.__onOpen.bind(this, this.connection))
      this.connection.on('error', this.__onError.bind(this, this.connection))
      this.connection.on('message', this.__onMessage.bind(this, this.connection))
      this.connection.on('close', this.__onClose.bind(this, this.connection))
      if (!this.timerA) {
        this.doTickA()
        this.timerA = setInterval(this.doTickA.bind(this), 6e4)
      }
      if (!this.timerB) {
        this.doTickB()
        this.timerB = setInterval(this.doTickB.bind(this), 12e4)
      }
      this.axios.patch('/api/v2/games/activity/18771')
    })
  }

  async getUserState () {
    const res = await this.axios.get('/api/v2/user/user-state')
    this.user = res.data
    return this.user
  }

  async sendGroupMessage (channelId, text) {
    this.axios.post(`/api/v2/channels/${channelId}/message`, JSON.stringify({
      content: JSON.stringify(text),
      objectName: 1,
      auth: this.connectData.sessionId
    }), {
      headers: {
        'content-type': 'application/json'
      }
    })
  }

  async getGuildInfo (guildId) {
    return (await this.axios.get(`/api/v2/guilds/${guildId}`)).data
  }

  __onMessage (connection, data) {
    try {
      const packet = zlib.inflateSync(data).toString('utf8')
      const packetData = JSON.parse(packet)
      switch (packetData.s) {
        case CMD.hs:
          this.connectData = packetData.d || {}
          break
        case CMD.msg:
          if (packetData.sn !== connection.sn) {
            connection.sn = packetData.sn
            this.emit('message', this.parser.parse(packetData.d))
          }
          break
        case CMD.ping:
        case CMD.pong:
          break
        default:
          console.error(packetData)
          break
      }
    } catch (error) {
      console.error(error)
    }
  }

  __onError (connection, error) {
    this.emit('error', error)
  }

  __onOpen (connection) {
    connection.sn = 0
    this.__ping()
    this.__interval = setInterval(this.__ping.bind(this), 30000)
    this.emit('connected')
  }

  __onClose (connection) {
    if (this.connection === connection) {
      clearInterval(this.__interval)
      this.emit('close')
    }
  }

  __ping () {
    this.connection.send(JSON.stringify({ s: CMD.ping, sn: this.connection.sn || 0 }))
  }

  async doTickA () {
    return (await this.axios.get('/api/v2/channels/sync-time')).data
  }

  async doTickB () {
    return (await this.axios.get('/api/v2/user/heartbeat')).data
  }
}

module.exports = KaiheilaClient
