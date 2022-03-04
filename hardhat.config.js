/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: "0.8.12",

  networks: {
    hardhat: {
      mining: {
        auto: false,
        interval: 1000
      }
    }
  }
};
