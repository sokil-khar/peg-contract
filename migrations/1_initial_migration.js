const PeggedToken = artifacts.require("PeggedToken");
var web3 = require('web3');
// const BrainContract = artifacts.require("BrainContract");
// const PeggedToken = artifacts.require("PeggedToken");

const devWallet = '0x7cd1d5006fFc9AC095a3EcFDB31B6d6aDc128d74';
const rewardWallet = '0x2359a200F6a4c24F303bB41609d53af745012A61';
const initialTimestamp = 1640701175;
var BN = web3.utils.BN;
const initialPrice = new BN('2000000000000000000');

module.exports = function (deployer) {
  deployer.deploy(PeggedToken,devWallet,rewardWallet,initialTimestamp, initialPrice);
};