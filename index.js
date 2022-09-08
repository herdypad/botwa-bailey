console.log('Mulai Bot . . .')
let {
    spawn: spawn
} = require('child_process'), path = require('path'), CFonts = require('cfonts')

function start() {
	let args = [path.join(__dirname, 'client.js'), ...process.argv.slice(2)]
	let p = spawn(process.argv[0], args, { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] })
	.on('message', data => {
		if (data == 'reset') {
			console.log('Restarting...')
			p.kill()
			start()
			delete p
		}
	})
	.on('exit', code => {
		console.error('Exited with code:', code)
		if (code == 1) start()
	})
}

start()