require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");

const { ALCHEMY_API_URL, PRIVATE_KEY, POLYGONSCAN_API_KEY, ETHERSCAN_API_KEY, GNOSIS_API_KEY, INFURA_API_KEY, LINEA_API_KEY } =
  process.env;

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
    zkEVM: {
      url: `https://rpc.public.zkevm-test.net`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    mumbai: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.MUMBAI_ALCHEMY_API_KEY}`,
    },
    goerli: {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: `https://eth-goerli.g.alchemy.com/v2/${process.env.GOERLI_ALCHEMY_API_KEY}`,
    },
    "mantle-testnet": {
      accounts: [`${process.env.PRIVATE_KEY}`],
      url: "https://rpc.testnet.mantle.xyz/",
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    neonlabs: {
      url: "https://devnet.neonevm.org",
      accounts: [`${process.env.PRIVATE_KEY}`],
      network_id: 245022926,
      chainId: 245022926,
      allowUnlimitedContractSize: false,
      timeout: 1000000,
      isFork: true
    },
    linea: {
      url: `https://linea-goerli.infura.io/v3//${process.env.INFURA_API_KEY}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    customChains:[
      // {
      //   network: "chiado",
      //   chainId: 10200,
      //   urls: {
      //     apiURL: "https://blockscout.com/gnosis/chiado/api",
      //     browserURL: "https://blockscout.com/gnosis/chiado",
      //   },
      // },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
        },
      },
      {
        network: "linea",
        chainId: 59140,
        urls: {
          apiURL: "https://goerli.lineascan.build/apis#contracts",
          browserURL: "https://goerli.lineascan.build/"
        }
      }
    ]
    apiKey: {
      //ethereum
      mainnet: ETHERSCAN_API_KEY,
      goerli: ETHERSCAN_API_KEY,
      //polygon
      polygon: POLYGONSCAN_API_KEY,
      polygonMumbai: POLYGONSCAN_API_KEY,
      // chiado: "your key", couldn't get api key cos error loading page for api 
      gnosis: GNOSISSCAN_API_KEY,
      linea: LINEA_API_KEY
  },
};
