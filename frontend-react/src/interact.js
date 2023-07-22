import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const alchemyKey =
  "https://eth-goerli.g.alchemy.com/v2/a_RQmx-7DTHA5eMyeLmZVHNgJ15KT3i_";
console.log("alchemyKey:", alchemyKey);
const web3 = createAlchemyWeb3(alchemyKey);

const tollsMainContractABI = require("./abi/TollsMain-abi.json");
const tollsMainCoontractAddress = "0xefEDa30486F2D681EA46E745D93e5235DF65F064"; // TollsMain goerli
const helloWorldContractABI = require("./abi/HelloWorld-abi.json");
const helloWorldContractAddress = "0xe012d539587f01d60A0161052F690c8Fc4fC47Fa"; // HelloWorld goerli

export const tollsMainContract = new web3.eth.Contract(
  tollsMainContractABI,
  tollsMainCoontractAddress
);

export const getUserCredit = async (account) => {
  const balance = await tollsMainContract.methods.userCredit(account).call();
  return balance;
};

export const helloWorldContract = new web3.eth.Contract(
  helloWorldContractABI,
  helloWorldContractAddress
);

export const loadCurrentMessage = async () => {
  const message = await helloWorldContract.methods.message().call();
  return message;
};
