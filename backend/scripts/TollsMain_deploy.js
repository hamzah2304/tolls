const { ethers } = require("hardhat");

async function main() {
  const tollsMainContractFactory = await hre.ethers.getContractFactory(
    "TollsMain"
  );
  const tollsMainContract = await tollsMainContractFactory.deploy();

  await tollsMainContract.deployed();

  console.log("TollsMain deployed to:", tollsMainContract.address);

  await tollsMainContract.deployTransaction.wait(6);

  await hre.run("verify:verify", {
    address: tollsMainContract.address,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
