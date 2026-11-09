// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const { ethers } = require("hardhat");

async function main() {

  // Get the contract owner
  const contractOwner = await ethers.getSigners();
  console.log(`Deploying contract from: ${contractOwner[0].address}`);

  // Hardhat helper to get the ethers contractFactory object
  const MerkleClaim = await ethers.getContractFactory('MerkleClaim');

  // Deploy the contract
  console.log('Deploying MerkleClaim...');
  //const merkleClaim = await MerkleClaim.deploy("0xaCBd2B83C7C962d6c5aAa94cE7bb9c1C18fbA882", "0xb4315d6b717329e31575bf95c7b84b799af63d1a4fe0e7c8ea8b59499b6a2106");
  const merkleClaim = await MerkleClaim.deploy("0xaCBd2B83C7C962d6c5aAa94cE7bb9c1C18fbA882", "0xaaabf369913835d6ce465993dc45ee132c3540044907476d23af063af80f4930", "1672502400", "1688140800");
  await merkleClaim.deployed();
  console.log(`MerkleClaim deployed to: ${merkleClaim.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });