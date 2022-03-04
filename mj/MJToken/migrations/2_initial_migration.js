let MJContract = artifacts.require("MJContract");

module.exports = function(deployer) {
    deployer.deploy(MJContract, "MJExampleToken", "MJJ", 18, 1000);
};