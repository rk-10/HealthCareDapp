const ethers = require('ethers');
const Web3 = require('web3');
const providers = ethers.providers;
const utils = ethers.utils;
const Wallet = ethers.Wallet;

let provider = new providers.JsonRpcProvider(process.env.INFURA);
let web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA));


exports.getTransactionCount_ = (address) => {
    // returns a promise
    return web3.eth.getTransactionCount(address);
};

exports.getCurrentGasPrice = () => {
    // returns a promise
    return provider.getGasPrice();
};

exports.parseValue = (value) => {
    return utils.parseEther(value);
};

exports.getFixedGasPrice = () => {
    return utils.bigNumberify("20000000000");
};

exports.getWeb3ContractInstance = (ABI, contractAddress) => {
    return new web3.eth.Contract(ABI, contractAddress);
};

exports.getEthersContractInstance = (ABI, contractAddress, wallet) => {
  return new ethers.Contract(contractAddress, ABI, wallet);
}

exports.getWallet = (privateKey) => {
    return new Wallet(privateKey);
};

exports.getWalletWithProvider = (privateKey) => {
  return new Wallet(privateKey, provider);
}

exports.getWeb3Provider = () => {
    return web3;
};

exports.getEtherProvider = () => {
    return provider;
};