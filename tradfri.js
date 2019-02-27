const coap = require('node-coap-client').CoapClient;
require('dotenv').load();

class Tradfri {
  constructor(gatewayUrl) {
    coap.setSecurityParams(gatewayUrl, {
      psk: {
        IDENTITY: process.env.PSK,
      },
    });
    this.gatewayUrl = gatewayUrl;
    this.percent = this.getBrightness();
  }

  getBrightness() {
    coap.request(
      `${this.gatewayUrl}/15001/65537`,
      'get',
    ).then((response) => {
      this.percent = JSON.parse(response.payload.toString())['3311'][0]['5851'] / 254;
    }).catch((err) => { console.log(err); });
  }

  sendPut(payload) {
    coap
      .request(
        `${this.gatewayUrl}/15001/65537`,
        'put',
        Buffer.from(JSON.stringify(payload)),
      )
      .catch((err) => { console.log(err); });
  }
}

module.exports.Tradfri = Tradfri;
