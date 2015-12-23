// http://zguide.zeromq.org/page:all#header-14
const nano = require('nanomsg')
const pbuf = require('pbs')

// create sockets
const pub = nano.socket('pub')
const sub = nano.socket('sub')

// bind sockets to network
const addr = 'tcp://127.0.0.1:5556'
pub.bind(addr)
sub.connect(addr)

// create schema
const messages = pbuf(`
  message Climate {
    repeated Weather weather = 1;

    message Weather {
      required string city = 2;
      required uint32 temperature = 3;
      required string unit = 4;
    }
  }
`)

// create schema encode / decode
const encoder = messages.Climate.encode()
const decoder = messages.Climate.decode()

// bind decoder to socket
sub.pipe(decoder)
decoder.weather(function (weather, cb) {
  process.stdout.write(JSON.stringify(weather) + '\n')
  cb()
  pub.close()
  sub.close()
})

decoder.on('finish', function () {
  process.stdout.write('finished\n')
})

// bind encoder to socket
encoder.pipe(pub)
encoder.weather({
  city: 'Sydney',
  temperature: 32,
  unit: 'celcius'
})
encoder.finalize()
