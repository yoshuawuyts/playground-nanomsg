// http://zguide.zeromq.org/page:all#header-11

const nano = require('nanomsg')

const req = nano.socket('req')
const rep = nano.socket('rep')

var addr = 'tcp://127.0.0.1:7789'
req.bind(addr)
rep.connect(addr)

rep.on('data', function (data) {
  console.log(String(data))
  rep.close()
  req.close()
})

req.send('hello world')
