const Migrations = artifacts.require("Migrations");
const Luke = artifacts.require("Luke");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Luke);
};
