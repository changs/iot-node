const mdns = require('mdns-js');

function discoverGateway() {
  const browser = mdns.createBrowser();
  return new Promise((resolve, reject) => {
    browser.on('update', (data) => {
      if ('fullname' in data) {
        browser.stop();
        const gatewayUrl = `${data.addresses[0]}:5684`;
        resolve({
          gatewayUrl,
        });
      }
    });
    browser.on('ready', () => {
      browser.discover();
    });
  });
}

module.exports.discoverGateway = discoverGateway;
