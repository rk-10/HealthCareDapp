/**
 * Created by rk on 25/09/18.
 */

const HealthCare = artifacts.require("HealthCareRecords");

contract("HealthCare tests", function (accounts) {
    it("Owner is account 0", function () {
        return HealthCare.deployed()
            .then((Instance) => {
                return Instance.owner();
            })
            .then((_owner) => {
                assert.equal(_owner, accounts[0]);
            })
    });

    it("owner changed", function () {
        return HealthCare.deployed()
            .then((Instance) => {
                return Instance.changeOwner(accounts[2]);
            })
            .then((changed) => {
                assert.equal(changed, true);
            })
    });
});