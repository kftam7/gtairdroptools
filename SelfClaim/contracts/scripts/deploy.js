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
  const MerkleClaimERC20 = await ethers.getContractFactory('MerkleClaimERC20');

  // Deploy the contract
  console.log('Deploying MerkleClaimERC20...');
  const merkleClaimERC20 = await MerkleClaimERC20.deploy("AirdropTest", "AT", 18, "0xb4315d6b717329e31575bf95c7b84b799af63d1a4fe0e7c8ea8b59499b6a2106");
  await merkleClaimERC20.deployed();
  console.log(`MerkleClaimERC20 deployed to: ${merkleClaimERC20.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });