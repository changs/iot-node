const coap = require('node-coap-client').CoapClient;
require('dotenv').load();

class Tradfri {
  constructor(gatewayUrl) {
    coap.setSecurityParams(gatewayUrl, {
      psk: {
        'IDENTITY': process.env.PSK
      }
    });
    this.gatewayUrl = gatewayUrl;
    this.percent = this.getBrightness();
  }

  getBrightness() {
    coap.request(
      this.gatewayUrl + '/15001/65537',
      'get'
    ).then(response => {
      this.percent = JSON.parse(response.payload.toString())['3311'][0]['5851'] / 254;
    }).catch(err => { console.log('ERROR'); }
    );
  }
  sendPut(payload) {
    coap
      .request(
        this.gatewayUrl + '/15001/65537',
        'put',
        Buffer.from(JSON.stringify(payload))
      )
      .catch(err => { console.log('ERROR'); }
      );
  }
}

// const gatewayUrl = 'coaps://192.168.0.17:5684'


module.exports.Tradfri = Tradfri;