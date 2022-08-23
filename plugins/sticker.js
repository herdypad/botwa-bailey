exports.run = {
   usage: ['s', 'sk', 'stiker', 'sticker', 'sgif'],
   async: async (m, {
      client,
      text,
      isPrefix,
      command
   }) => {
      try {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            if (/video/.test(type)) {
               if (q.seconds > 10) return client.reply(m.chat, Func.texted('bold', `Durasi video maksimal 10 detik.`), m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: 'No Bot Wa',
                  author: '6285158870125'
               })
            } else if (/image/.test(type)) {
               return await client.sendSticker(m.chat, img, m, {
                  packname: 'by',
                  author: 'neoxr'
               })
            }
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await q.download()
               if (!img) return client.reply(m.chat, global.status.wrong, m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: 'No Bot Wa',
                  author: '6285158870125'
               })
            } else if (/video/.test(mime)) {
               if ((q.msg || q).seconds > 10) return client.reply(m.chat, Func.texted('bold', `Durasi video maksimal 10 detik.`), m)
               let img = await q.download()
               if (!img) return client.reply(m.chat, global.status.wrong, m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: 'No Bot Wa',
                  author: '6285158870125'
               })
            } else client.reply(m.chat, Func.texted('bold', `Gambar Atau Video Nya mana`), m)
         }

         // let chats
         // for (let id of chats) {
         //    await conn.modifyChat(id, ('delete'), {
         //       includeStarred: false
         //     })
         //  }

         await client.sendMessage(m.chat, { clear: response.key })
          
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}