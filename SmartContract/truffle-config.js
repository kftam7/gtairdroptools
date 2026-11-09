const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
require('dotenv').config({ path: '/home/ubuntu/github/Airdrop-Smart-Contract/.env' });
//const mnemonic = process.env.SEEDPHRASE;
const mnemonic = "believe shuffle secret find shop slogan universe clarify ask blossom alter hammer";

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  plugins: [
    'truffle-plugin-verify'
  ],
  api_keys: {
    bscscan: "FMHIDF3JI4TMMEZAGD7MNNC8QJ77CCVUAR",
    polygonscan: "JNYQPA4N9G54WMQ8NGM5US8EQU2YPG6BWF"
  },
  networks: {
   development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*"
   },
   test: {
     host: "127.0.0.1",
     port: 7545,
     network_id: "*"
   },
   testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    polytestnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://rpc-mumbai.maticvigil.com/`),
      network_id: 80001,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: false,
      gas: 8000000,
      gasPrice: 50000000000
    },
   polytestnet2: {
      provider: () => new HDWalletProvider(mnemonic, `https://speedy-nodes-nyc.moralis.io/a8c3dc14defcde7f869d6c43/polygon/mumbai`),
      network_id: 80001,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: false,
      gas: 7721975,
      gasPrice: 80000000000
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "^0.7",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
  
};
