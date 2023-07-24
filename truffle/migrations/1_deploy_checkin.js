const Checkin = artifacts.require("Checkin");

module.exports =  (deployer) => {
   deployer.deploy(Checkin);
};