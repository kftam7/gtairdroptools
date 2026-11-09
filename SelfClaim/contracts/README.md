# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```
--------------
- Compile
npx hardhat compile

- Deploy local
npx hardhat node
npx hardhat run --network localhost scripts/deploymerkle.js

- Deploy public
npx hardhat run scripts/deploymerkle.js --network polytestnet

- Verify

npx hardhat verify --network polytestnet {contract_address} {constructor args}

e.g. npx hardhat verify --network polytestnet 0x55e1eaD9BBd1775558A3F1FE4591F6339545B85f "0xaCBd2B83C7C962d6c5aAa94cE7bb9c1C18fbA882" "0xaaabf369913835d6ce465993dc45ee132c3540044907476d23af063af80f4930" "1672502400" "1688140800"