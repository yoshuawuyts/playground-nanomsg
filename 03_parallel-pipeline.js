// http://zguide.zeromq.org/page:all#header-15
// supercomputer architecture

const nano = require('nanomsg')

const addr1 = 'tcp://127.0.0.1:5556'
const addr2 = 'tcp://127.0.0.1:5557'

sink()

var i = 0
while (i < 100) {
  worker(i)
  i++
}

setTimeout(function () {
  ventilator()
}, 5000)

// create a data creator
function ventilator () {
  // send 100 tasks
  var i = 0
  var msecTotal = 0
  const push = nano.socket('push')
  push.bind(addr1)
  while (i < 100) {
    var workload = Math.abs(Math.round(Math.random() * 100)) + 1
    msecTotal += workload
    push.send(workload.toString())
    i += 1
  }
  console.log('Total expected:', msecTotal, 'msec')
}

// create a data transform
function worker (num) {
  const pull = nano.socket('pull')
  pull.connect(addr1)
  pull.on('data', function (data) {
    const push = nano.socket('push')
    push.bind(addr2)

    push.send(String(data))
  })
}

// create a data aggregator
function sink () {
  var i = 0
  var start = Date.now()

  const pull = nano.socket('pull')
  pull.connect(addr2)
  pull.on('data', function (data) {
    console.log('data', String(data))
    i += 1
    process.stdout.write(i % 10 === 0 ? ':' : '.')
    if (i === 100) {
      console.log('closed')
      pull.close()
      const elapsed = Date.now - start
      console.log('Total elapsed: ' + elapsed)
    }
  })
}
