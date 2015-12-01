const nano = require('nanomsg')

const push = nano.socket('push')
const pull = nano.socket('pull')
const pub = nano.socket('pub')
const sub = nano.socket('sub')

pull.connect('tcp://127.0.0.1:4444')
sub.connect('tcp://127.0.0.1:3333')
push.bind('tcp://127.0.0.1:4444')
pub.bind('tcp://127.0.0.1:3333')

// setEncoding formats inbound message type
sub.setEncoding('utf8')

sub.on('data', function (msg) {
  console.log(msg)
})

// pipe readable sockets to any writable socket or stream
pull.pipe(pub)

setInterval(function () {
  push.send('hello from a push socket!')
}, 100)
