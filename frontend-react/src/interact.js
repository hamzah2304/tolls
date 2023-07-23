import { createAlchemyWeb3 } from "@alch/alchemy-web3";

const alchemyKey =
  "wss://eth-goerli.g.alchemy.com/v2/a_RQmx-7DTHA5eMyeLmZVHNgJ15KT3i_";
console.log("alchemyKey:", alchemyKey);
const web3 = createAlchemyWeb3(alchemyKey);

// const tollsMainContractABI = require("./abi/TollsMain-abi.json");
// const tollsMainContractAddress = "0xefEDa30486F2D681EA46E745D93e5235DF65F064"; // TollsMain_Hamzah goerli

const tollsMainContractABI = require("./abi/TollsMain-abi.json");
const tollsMainContractAddress = "0x455D9f4f0457388eF54C000A6D71f65901122598"; // TollsMain goerli

const helloWorldContractABI = require("./abi/HelloWorld-abi.json");
const helloWorldContractAddress = "0xe012d539587f01d60A0161052F690c8Fc4fC47Fa"; // HelloWorld goerli

export const tollsMainContract = new web3.eth.Contract(
  tollsMainContractABI,
  tollsMainContractAddress
);

export const getUserCredit = async (account) => {
  const balance = await tollsMainContract.methods.userCredit(account).call();
  return balance;
};

export const getUserInfo = async (address) => {
  const userInfo = await tollsMainContract.methods.users(address).call();
  return userInfo;
};

export const getLandInfo = async (latitude, longitude) => {
  const landInfo = await tollsMainContract.methods
    .landAreas(latitude, longitude)
    .call();
  return landInfo;
};

export const depositTokens = async (amount, address) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (amount === "") {
    return {
      status: "❌ Amount is missing",
    };
  }
  console.log("amount:", amount);
  console.log("type of amount:", typeof amount);
  const amountBigNumber = web3.utils.toBN(amount);
  console.log("type of amountBigNumber:", typeof amountBigNumber);

  //set up transaction parameters
  const transactionParameters = {
    to: tollsMainContractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: tollsMainContract.methods.depositCredits(amountBigNumber).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

export const writeUserLocation = async (latitude, longitude, address) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (latitude === "" || longitude === "") {
    return {
      status: "❌ At least one parameter is missing",
    };
  }

  //set up transaction parameters
  const transactionParameters = {
    to: tollsMainContractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: tollsMainContract.methods
      .updateLocation(latitude, longitude)
      .encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

export const buyLand = async (latitude, longitude, address, amount_sent) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (latitude === "" || longitude === "") {
    return {
      status: "❌ At least one parameter is missing",
    };
  }

  console.log("Latitude in interact:", latitude);
  console.log("Longitude in interact:", longitude);
  const amountInWei = web3.utils.toWei(amount_sent, "ether");
  console.log("amountInWei:", amountInWei);

  //set up transaction parameters
  const transactionParameters = {
    to: tollsMainContractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    value: amountInWei,
    data: tollsMainContract.methods
      .buyLandArea(latitude, longitude)
      .encodeABI(),
  };

  console.log("transaction parameters:", transactionParameters);

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};

export const helloWorldContract = new web3.eth.Contract(
  helloWorldContractABI,
  helloWorldContractAddress
);

export const loadCurrentMessage = async () => {
  const message = await helloWorldContract.methods.message().call();
  return message;
};

export const updateMessage = async (address, message) => {
  //input error handling
  if (!window.ethereum || address === null) {
    return {
      status:
        "💡 Connect your Metamask wallet to update the message on the blockchain.",
    };
  }

  if (message.trim() === "") {
    return {
      status: "❌ Your message cannot be an empty string.",
    };
  }

  //set up transaction parameters
  const transactionParameters = {
    to: helloWorldContractAddress, // Required except during contract publications.
    from: address, // must match user's active address.
    data: helloWorldContract.methods.update(message).encodeABI(),
  };

  //sign the transaction
  try {
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    return {
      status: (
        <span>
          ✅{" "}
          <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>
            View the status of your transaction on Etherscan!
          </a>
          <br />
          ℹ️ Once the transaction is verified by the network, the message will
          be updated automatically.
        </span>
      ),
    };
  } catch (error) {
    return {
      status: "😥 " + error.message,
    };
  }
};
