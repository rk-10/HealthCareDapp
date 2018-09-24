/**
 * Created by rk on 24/09/18.
 */


const healthcare = artifacts.require("HealthCareRecords");

module.exports = function(deployer) {
    deployer.deploy(healthcare);
};