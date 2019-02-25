const discoverGateway = require('./mdns').discoverGateway
async function init() {
  const urlR = discoverGateway().then(r => r);
  const url = await urlR;
  require('./tui').start("coaps://" + url.gatewayUrl);
}

init();