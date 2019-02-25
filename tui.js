function start(gatewayUrl) {
  const CLI = require('clui'),
    clear = CLI.Clear,
    clc = require('cli-color'),
    Line = CLI.Line,
    Progress = CLI.Progress,
    Tradfri = require('./tradfri').Tradfri;

  const client = new Tradfri(gatewayUrl);
  function drawProgress() {
    clear();

    var blankLine = new Line().fill().output();

    var headline = new Line()
      .padding(2)
      .column("Connected to GW: " + gatewayUrl)
      .fill()
      .output();
    
    blankLine.output();

    var headers = new Line()
      .padding(2)
      .column('Bulb', 20, [clc.cyan])
      .column('Brightness', 40, [clc.cyan])
      .fill()
      .output();

    blankLine.output();

    var thisPercentBar = new Progress(20);
    var percentLine = new Line()
      .padding(2)
      .column('Bulb 1', 20, [clc.yellow])
      .column(thisPercentBar.update(client.percent), 40)
      .fill()
      .output();

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
        client.percent += 0.05;
        var payload = {
          '3311': [
            {
              '5850': 1,
              '5851': parseInt(client.percent * 254)
            }
          ]
        };
        client.sendPut(payload);
        break;
      case 'down':
        client.percent -= 0.05;
        var payload = {
          '3311': [
            {
              '5850': 1,
              '5851': parseInt(client.percent * 254)
            }
          ]
        };
        client.sendPut(payload);
        break;
    }
  });
}

module, exports.start = start;