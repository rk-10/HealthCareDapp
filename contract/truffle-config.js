const HDWalletProvider = require("truffle-hdwallet-provider");
const ganacheMnemonic = "ganache mnemonic";
const ganacheProvider = "http://127.0.0.1:port/";
const ropstenMnemonic = "ropsten mnemonic";
const ropstenProvider = "ropsten infura provider";

module.exports = {
    networks: {
        ropsten: {
            provider: function() {
                return new HDWalletProvider(ropstenMnemonic, ropstenProvider);
            },
            network_id: '3',
        },
        test: {
            provider: function() {
                return new HDWalletProvider(ganacheMnemonic, ganacheProvider);
            },
            network_id: 5777,
        },
    },
    solc: {
        optimizer: {
            enabled: false,
            runs: 200
        }
    },
    mocha: {
        useColors: true
    }
};
