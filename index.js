const KaiheilaClient = require('./KaiheilaClient')
const client = new KaiheilaClient({
  cookie: process.env.cookie
})
const Commands = require('./commands')
client.on('message', e => {
  switch (e.type) {
    case 'CHANNEL_MSG':
      if (e.content.startsWith('.') || e.content.startsWith('。')) {
        Commands(e)
      }
      break

    default:
      break
  }
})
