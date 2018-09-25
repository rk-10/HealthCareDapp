/**
 * Created by rk on 25/09/18.
 */

const HealthCare = artifacts.require("HealthCareRecords");

contract("HealthCare tests", function (accounts) {
    it("First test", function () {
        return HealthCare.deployed()
            .then((Instance) => {
                return Instance.owner();
            })
            .then((_owner) => {
                assert.equal(_owner, accounts[0]);
            })
    });
});