const hre = require("hardhat");

async function main() {
  const tollContractFactory = await hre.ethers.getContractFactory("Toll");
  const tollContract = await tollContractFactory.deploy();

  await tollContract.deployed();

  console.log("Toll deployed to:", tollContract.address);

  await tollContract.deployTransaction.wait(6);

  await hre.run("verify:verify", {
    address: tollContract.address,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
