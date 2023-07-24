const Web3 = require('web3');
const Checkin = artifacts.require("Checkin");

const sepoliaNodeUrl = 'https://sepolia.infura.io/v3/'; 
module.exports = async function (deployer, network, accounts) {
  if (network === 'sepolia') {
    const web3 = new Web3(new Web3.providers.HttpProvider(sepoliaNodeUrl));

    Checkin.setProvider(web3.currentProvider);

    await deployer.deploy(Checkin);
  } else {
    await deployer.deploy(Checkin);
  }
};
