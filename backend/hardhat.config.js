require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const { ALCHEMY_API_URL, PRIVATE_KEY, POLYGONSCAN_API_KEY } = process.env;

module.exports = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },
  allowUnlimitedContractSize: true,
  networks: {
    hardhat: {},
    polygon: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
    },
    mumbai: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_API_KEY}`,
    },
  },
  etherscan: {
    apiKey: {
      //ethereum
      // mainnet: ETHERSCAN_API_KEY,
      // goerli: ETHERSCAN_API_KEY,
      //polygon
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
    },
  },
};
