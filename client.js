const { useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@adiwajshing/baileys')
const session = process.argv[2] ? process.argv[2] + '.json' : 'session.json'
const { state } = useSingleFileAuthState(session)


const pino = require('pino'), path = require('path'), fs = require('fs'), colors = require('@colors/colors/safe'), qrcode = require('qrcode-terminal')


const spinnies = new (require('spinnies'))()


const { Socket, Serialize, Scandir } = require('./system/extra')
global.neoxr = new (require('./system/map'))
global.Exif = new (require('./system/exif'))
global.Func = new (require('./system/function'))



const removeAuth = () => {
   try {
      fs.unlinkSync('./' + session)
   } catch (err) {
      console.log('File Already Deleted')
   }
}

const connect = async () => {
   setInterval(removeAuth, 1000 * 60 * 30)



   global.client = Socket({
      logger: pino({
         level: 'silent'
      }),
      printQRInTerminal: true,
      markOnlineOnConnect: false,
      browser: ['@Herdy', 'Chrome', '1.0.0'],
      auth: state,
      ...fetchLatestBaileysVersion()
   })
  

   client.ev.on('connection.update', async (update) => {
      const {
         connection,
         lastDisconnect,
         qr
      } = update
      if (lastDisconnect == 'undefined' && qr != 'undefined') {
         qrcode.generate(qr, {
            small: true
         })
      }
      if (connection === 'connecting') spinnies.add('start', {
         text: 'Connecting . . .'
      })
      if (connection === 'open') {
         spinnies.succeed('start', {
            text: `Connected, you login as ${client.user.name}`
         })
      }
      if (connection === 'close') lastDisconnect.error.output.statusCode !== DisconnectReason.loggedOut ? connect() : spinnies.fail('start', {
         text: `Can't connect to Web Socket`
      })
   })

   client.ev.on('messages.upsert', async chatUpdate => {
      try {
         m = chatUpdate.messages[0]
         if (!m.message) return
         Serialize(client, m)
         Scandir('./plugins').then(files => {
            global.client.plugins = Object.fromEntries(files.filter(v => v.endsWith('.js')).map(file => [path.basename(file).replace('.js', ''), require(file)]))
         }).catch(e => console.error(e))
         require('./system/config'), require('./handler')(client, m)
      } catch (e) {
         console.log(e)
      }
   })
   
   client.ev.on('contacts.update', update => {
      for (let contact of update) {
         let id = client.decodeJid(contact.id)
         
      }
   })

   client.ev.on('group-participants.update', async (room) => {
      let meta = await (await client.groupMetadata(room.id))
      let member = room.participants[0]
      let text_welcome = `Thank you +tag for joining into +grup group.`
      let text_left = `+tag left from this group for no apparent reason.`
      let groupSet = global.db.groups[room.id]
      if (room.action == 'add') {
         if (groupSet.localonly) {
            if (typeof global.db.users[member] != 'undefined' && !global.db.users[member].whitelist && !member.startsWith('62') || !member.startsWith('62')) {
               client.reply(room.id, Func.texted('bold', `Sorry @${member.split`@`[0]}, this group is only for indonesian people and you will removed automatically.`))
               client.updateBlockStatus(member, 'block')
               return await Func.delay(2000).then(() => client.groupParticipantsUpdate(room.id, [member], 'remove'))
            }
         }
         let txt = (groupSet.text_welcome != '' ? groupSet.text_welcome : text_welcome).replace('+tag', `@${member.split`@`[0]}`).replace('+grup', `${meta.subject}`)
         if (groupSet.welcome) client.reply(room.id, txt, null)
      } else if (room.action == 'remove') {
         let txt = (groupSet.text_left != '' ? groupSet.text_left : text_left).replace('+tag', `@${member.split`@`[0]}`).replace('+grup', `${meta.subject}`)
         if (groupSet.left) client.reply(room.id, txt, null)
      }
   })

   client.ws.on('CB:call', async json => {
      if (json.content[0].tag == 'offer') {
         let object = json.content[0].attrs['call-creator']

      }
   })

   return client
}

connect().catch(() => connect())