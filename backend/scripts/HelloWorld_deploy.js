const hre = require("hardhat");

async function main() {
  const helloWorldContractFactory = await hre.ethers.getContractFactory(
    "HelloWorld"
  );
  const helloWorldContract = await helloWorldContractFactory.deploy(
    "Hello World!"
  );

  await helloWorldContract.deployed();

  console.log("Hello World deployed to:", helloWorldContract.address);

  await helloWorldContract.deployTransaction.wait(6);

  await hre.run("verify:verify", {
    address: helloWorldContract.address,
    constructorArguments: ["Hello World!"],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
