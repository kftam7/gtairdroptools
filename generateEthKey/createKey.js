const { utils } = require('ethers');

const mnemonic = 'love zebra frog bronze joy spirit term tone puzzle alert gloom seven';
const hdNode = utils.HDNode.fromMnemonic(mnemonic);
const noOfAddress = 500;

console.log("Mnemonic: ", mnemonic);
console.log("address|publicKey|privateKey");
for (var i =0; i < noOfAddress; i++){
Account = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
console.log(Account.address, "|", Account.publicKey, "|", Account.privateKey);
}
