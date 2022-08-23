exports.run = {
    usage: ['clear', 'clr', 'hapusall'],
    async: async (m, {
       client,
       isPrefix
    }) => {
        // const jid = '6282217417425@s.whatsapp.net' // can also be a group
        // const response = await client.sendMessage(jid, { text: 'hello!' }) // send a message
        // sends a message to delete the given message
        // this deletes the message for everyone
        // await client.sendMessage(jid, { delete: response.key })

       client.reply(m.chat, `Hai ${m.pushName}  \nHapus Sukses`, m)

        const jid = client.chats.all();
        await client.chatModify(jid, 'clear', {
            iincludeStarred: false
        })

    


        const response = await client.sendMessage(jid, { text: 'hello!' }) // send a message

    },
    error: false
 }



//  if (/group|gc/i.test(args[0])) chats = conn.chats.array.filter(v => v.jid.endsWith('g.us') && !v.pin).map(v => v.jid)
//         else if (/chat|private/i.test(args[0])) chats = conn.chats.array.filter(v => v.jid.endsWith('.net') && !v.pin).map(v => v.jid)
//         else if (/all/i.test(args[0])) chats = conn.chats.array.filter(v => v.jid && !v.pin).map(v => v.jid)
//         else chats = [m.chat]