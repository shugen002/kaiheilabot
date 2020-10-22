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
      this.guilds[guildId] = new JSONStorage(`data/guilds/${guildId}`)
    }
    return this.guilds[guildId]
  }

  getChannel (channelId) {
    if (!this.channels[channelId]) {
      this.channels[channelId] = new JSONStorage(`data/channels/${channelId}`)
    }
    return this.channels[channelId]
  }

  getUser (userId) {
    if (!this.users[userId]) {
      this.users[userId] = new JSONStorage(`data/users/${userId}`)
    }
    return this.users[userId]
  }

  getServer () {
    if (!this.server) {
      this.server = new JSONStorage('data/server')
    }
    return this.server
  }
}

function JSONStorage (path) {
  var module = {}
  var data = {
    getUserModule (moduleName, userId) {
      if (!module[moduleName]) {
        module[moduleName] = {}
        try {
          fs.mkdirSync(`${path}/${moduleName}`, { recursive: true })
        } catch (error) {
          console.log(error)
        }
      }
      if (!module[moduleName][userId]) {
        module[moduleName][userId] = new JSONStorage(`${path}/${moduleName}/${userId}`)
      }
      return module[moduleName][userId]
    }
  }
  try {
    if (fs.existsSync(path + '.json')) {
      Object.assign(data, JSON.parse(fs.readFileSync(path + '.json', 'utf-8')))
    } else {
      fs.promises.writeFile(path + '.json', JSON.stringify({})).then(() => {}).catch((error) => {
        console.error('Fail to write File', path + '.json', error.message)
      })
    }
  } catch (error) {
    console.error('Fail to read File', path + '.json', error.message)
  }
  async function writeAsync () {
    fs.promises.writeFile(path + '.json', JSON.stringify(data)).then(() => {}).catch((error) => {
      console.error('Fail to write File', path + '.json', error.message)
    })
  }
  var handler = {
    set (target, key, value) {
      target[key] = value
      writeAsync()
      return true
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
