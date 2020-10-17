var axios = require('axios').create({
  baseURL: 'https://www.kaiheila.cn/',
  headers: {
    cookie: process.env.cookie
  }
})
var RongIMLib = require('./RongIMLib')
var RongIMClient = RongIMLib.RongIMClient

var server = {}
var timerA = null
var timerB = null
server.connect = async () => {
  var res = await axios
    .get('/api/v2/user/user-state', {
    })
  server.user = res.data.user
  var data = res.data
  RongIMClient.connect(data.rong_token, {
    onSuccess: (...args) => {
      console.log('ConnectSuccess', ...args)
      if (!timerA) {
        server.doTickA()
        timerA = setInterval(server.doTickA, 6e4)
      }
      if (!timerB) {
        server.doTickB()
        timerA = setInterval(server.doTickB, 12e4)
      }
      axios.patch('/api/v2/games/activity/18771')
    },
    onTokenIncorrect: (...args) => {
      console.log('ConnectTokenIncorrect', ...args)
    },
    onError: (...args) => {
      console.log('ConnectError', ...args)
    }
  })
}
server.getUserInfo = async () => {
  var res = await axios.get('/api/v2/user/user-state')
  server.user = res.data.user
  return server.user
}
server.getGuilds = async () => {
  var res = await axios.get('/api/v2/guilds')
  server.guilds = res.data
  return server.guilds
}
server.sendMessage = (type, channelId, textMessage) => {
  return new Promise((resolve, reject) => {
    RongIMClient.getInstance().sendMessage(
      type,
      channelId,
      textMessage, {
        onSuccess: resolve,
        onError: reject
      },
      false,
      'Push 显示内容',
      'Push 通知时附加信息',
      null, {}
    )
  })
}

server.grantRole = (guildId, userId, roleId) => {
  return axios.patch(`/api/v2/guild-roles/grant/${guildId.toString()}`, JSON.stringify({
    user_id: userId.toString(),
    role_id: roleId
  }), {
    headers: {
      'content-type': 'application/json'
    }
  })
}

server.revokeRole = (guildId, userId, roleId) => {
  return axios.patch(`/api/v2/guild-roles/revoke/${guildId.toString()}`, JSON.stringify({
    user_id: userId.toString(),
    role_id: roleId
  }), {
    headers: {
      'content-type': 'application/json'
    }
  })
}
server.doTickA = async () => {
  return (await axios.get('/api/v2/channels/sync-time')).data
}
server.doTickB = async () => {
  return (await axios.get('/api/v2/user/heartbeat')).data
}
module.exports = server
