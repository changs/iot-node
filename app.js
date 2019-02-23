var mdns = require('mdns-js');

function discoverGateway() {
  var browser = mdns.createBrowser();
  return new Promise((resolve, reject) => {
    const mdnsTimeout = 3000;
    browser.on('update', function (data) {
      if (data.hasOwnProperty('fullname')) {
        browser.stop();
        console.log(data.addresses[0]);
        const gatewayUrl = data.addresses[0] + ':5684'
        resolve({
          gatewayUrl
        });
      }
    });
    browser.on('ready', function () {
      browser.discover();
    });
  })
}

async function init() {
  const urlR = discoverGateway().then(r => r);
  const url = await urlR;
  require('./tradfri').start("coaps://" + url.gatewayUrl);
}

init();