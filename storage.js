var fs = require('fs')
class Storage {
  constructor () {
    this.guilds = {}
    this.users = {}
    this.channels = {}
    this.server = null
    fs.mkdirSync('data/guilds', {
      recursive: true
    })
    fs.mkdirSync('data/channels', {
      recursive: true
    })
    fs.mkdirSync('data/users', {
      recursive: true
    })
  }

  getGuild (guildId) {
    if (!this.guilds[guildId]) {
      this.guilds[guildId] = new JSONStorage(`data/guilds/${guildId}.json`)
    }
    return this.guilds[guildId]
  }

  getChannel (channelId) {
    if (!this.channels[channelId]) {
      this.channels[channelId] = new JSONStorage(`data/channels/${channelId}.json`)
    }
    return this.channels[channelId]
  }

  getUser (userId) {
    if (!this.users[userId]) {
      this.users[userId] = new JSONStorage(`data/users/${userId}.json`)
    }
    return this.users[userId]
  }

  getServer () {
    if (!this.server) {
      this.server = new JSONStorage('data/server.json')
    }
    return this.server
  }
}

function JSONStorage (path) {
  var data = {}
  try {
    if (fs.existsSync(path)) {
      data = JSON.parse(fs.readFileSync(path, 'utf-8'))
    } else {
      fs.promises.writeFile(path, JSON.stringify({})).then(() => {}).catch((error) => {
        console.error('Fail to write File', path, error.message)
      })
    }
  } catch (error) {
    console.error('Fail to read File', path, error.message)
  }
  async function writeAsync () {
    fs.promises.writeFile(path, JSON.stringify(data)).then(() => {}).catch((error) => {
      console.error('Fail to write File', path, error.message)
    })
  }
  var handler = {
    set (target, key, value) {
      target[key] = value
      writeAsync()
    },
    deleteProperty (target, key) {
      delete target[key]
      writeAsync()
    },
    get (target, key) {
      switch (typeof target[key]) {
        case 'object':
          return new Proxy(target[key], handler)
        default:
          return target[key]
      }
    }
  }
  return new Proxy(data, handler)
}

module.exports = new Storage()
