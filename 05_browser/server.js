var nano = require('nanomsg')
var pair = nano.socket('pub')

pair.bind('ws://127.0.0.1:7789')
setInterval(function () {
  pair.send('hello you' + '')
  console.log('sent')
}, 1000)

require('http').createServer(function (req, res) {
  require('fs').createReadStream('index.html').pipe(res)
}).listen(3000)
