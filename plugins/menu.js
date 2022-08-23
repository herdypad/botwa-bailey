exports.run = {
   usage: ['menu', 'help', 'bot'],
   async: async (m, {
      client,
      isPrefix
   }) => {
      client.reply(m.chat, `Hai ${m.pushName}  \nMenu Bot hanya bisa di Akses di\n https://play.google.com/store/apps/details?id=com.indobot.botwastikerapp`, m)
   },
   error: false
}