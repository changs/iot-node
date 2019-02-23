const CLI = require('clui'),
  clear = CLI.Clear,
  clc = require('cli-color'),
  Line = CLI.Line,
  Progress = CLI.Progress,
  coap = require('node-coap-client').CoapClient;
 
require('dotenv').load();

var percent = 0

// var mdns = require('mdns-server')({
//   reuseAddr: true, // in case other mdns service is running
//   loopback: true,  // receive our own mdns messages
//   noInit: true     // do not initialize on creation
// })

coap.setSecurityParams('coaps://192.168.0.17:5684',
  {
    psk: {
      'IDENTITY': process.env.PSK
    }
  }
);
coap
  .request(
    'coaps://192.168.0.17:5684/15001/65537',
    'get'
  )
  .then(response => {
    percent = JSON.parse(response.payload.toString())['3311'][0]['5851'] / 254;
  })
  .catch(err => { console.log('ERROR'); }
  );

function sendPut(payload) {
  coap
    .request(
      'coaps://192.168.0.17:5684/15001/65537',
      'put',
      Buffer.from(JSON.stringify(payload))
    )
    .catch(err => { console.log('ERROR'); }
    );
}
function drawProgress() {
  // clear()

  var blankLine = new Line().fill().output();

  var headers = new Line()
    .padding(2)
    .column('Item', 20, [clc.cyan])
    .column('Progress', 40, [clc.cyan])
    .fill()
    .output();

  blankLine.output();

  var thisPercentBar = new Progress(20);
  var percentLine = new Line()
    .padding(2)
    .column('Item %', 20, [clc.yellow])
    .column(thisPercentBar.update(percent), 40)
    .fill()
    .output()

  blankLine.output();
}

var statusTimer = setInterval(drawProgress, 1000);

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  }
  switch (key.name) {
    case 'up':
      percent += 0.05;
      var payload = {
        '3311': [
          {
            '5850': 1,
            '5851': parseInt(percent * 254)
          }
        ]
      };
      sendPut(payload);
      break;
    case 'down':
      percent -= 0.05;
      var payload = {
        '3311': [
          {
            '5850': 1,
            '5851': parseInt(percent * 254)
          }
        ]
      };
      sendPut(payload);
      break;
    case 'left':
      console.log(percent);
      break;
    case 'right':
      console.log('right');
      break;
  }
});

console.log('...');