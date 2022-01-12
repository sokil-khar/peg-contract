const FleepToken = artifacts.require("FleepToken");
var web3 = require('web3');
var BN = web3.utils.BN;

const devWallet = '0x97a5FEdC2C8C16BFA34195488c147b983e61f57E';
const rewardWallet = '0xf22FE68f2046fc370c730d3510BEeeC5ee1812A6';
//fake using data of DAI - USDC 
// const pairFeedPrice = '0xAE461cA67B15dc8dc81CE7615e0320dA1A9aB8D5';
const initialTimestamp = 1640701175;
const initialPrice = new BN('2000000000000000000');

module.exports = function (deployer) {
  // address _devWallet,
  // address _rewardWallet,
  // address _pairFeedPrice,
  // bool _isToken0,
  // uint256 _initialTime,
  // uint256 _initialPrice
  deployer.deploy(FleepToken,devWallet,rewardWallet,initialTimestamp, initialPrice);
};