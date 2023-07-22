const { ethers } = require("hardhat");

async function main() {
  const RegularContract = await ethers.getContractFactory("TollsMain");
  const regularContract = await RegularContract.deploy();
  await regularContract.deployed();

  console.log("TollsMain deployed to:", regularContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


