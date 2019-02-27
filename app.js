const { discoverGateway } = require('./mdns');
const { tui } = require('./tui');

async function init() {
  const url = await discoverGateway();
  tui(`coaps://${url.gatewayUrl}`);
}

init();
