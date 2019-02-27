const CLI = require('clui');
const clc = require('cli-color');
const readline = require('readline');
const { Tradfri } = require('./tradfri');

const { Line, Progress } = CLI;

function start(gatewayUrl) {
  const client = new Tradfri(gatewayUrl);
  function drawProgress() {
    CLI.Clear();

    const blankLine = new Line().fill().output();

    new Line()
      .padding(2)
      .column(`Connected to GW: ${gatewayUrl}`)
      .fill()
      .output();

    blankLine.output();

    new Line()
      .padding(2)
      .column('Bulb', 20, [clc.cyan])
      .column('Brightness', 40, [clc.cyan])
      .fill()
      .output();

    blankLine.output();

    const thisPercentBar = new Progress(20);
    new Line()
      .padding(2)
      .column('Bulb 1', 20, [clc.yellow])
      .column(thisPercentBar.update(client.percent), 40)
      .fill()
      .output();

    blankLine.output();
  }

  setInterval(drawProgress, 1000);

  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
      process.exit();
    }
    let payload = {};
    switch (key.name) {
      case 'up':
        client.percent += 0.05;
        payload = {
          3311: [
            {
              5850: 1,
              5851: parseInt((client.percent * 254), 10),
            },
          ],
        };
        client.sendPut(payload);
        break;
      case 'down':
        client.percent -= 0.05;
        payload = {
          3311: [
            {
              5850: 1,
              5851: parseInt((client.percent * 254), 10),
            },
          ],
        };
        client.sendPut(payload);
        break;
      default:
        break;
    }
  });
}

module.exports.tui = start;
