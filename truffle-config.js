const HDWalletProvider = require('@truffle/hdwallet-provider');
const path = require('path');

const infuraKey = process.env.INFURA_KEY;
const mnemonic = process.env.MNEMONIC;

module.exports = {
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  networks: {
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/' + infuraKey)
      },
      network_id: 4,
    },
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: 5777
    }
  }
};
