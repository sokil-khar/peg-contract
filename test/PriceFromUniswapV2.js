const Token = artifacts.require("PeggedToken");

// const { ChainId, Fetcher, WETH, Route, Trade, TokenAmount, TradeType } = require ('@uniswap/sdk');
// const ethers = require('ethers');  

// const url = 'HTTP://127.0.0.1:7545';
// const customHttpProvider = new ethers.providers.JsonRpcProvider(url);
// const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
// const chainId = ChainId.MAINNET;

// const init = async () => {
// 	const dai = await Fetcher.fetchTokenData(chainId, tokenAddress, customHttpProvider);
// 	const weth = WETH[chainId];
// 	const pair = await Fetcher.fetchPairData(dai, weth, customHttpProvider);
// 	const route = new Route([pair], weth);
// 	const trade = new Trade(route, new TokenAmount(weth, '100000000000000000'), TradeType.EXACT_INPUT);
// 	console.log("Mid Price WETH --> DAI:", route.midPrice.toSignificant(6));
// 	console.log("Mid Price DAI --> WETH:", route.midPrice.invert().toSignificant(6));
// 	console.log("-".repeat(45));
// 	console.log("Execution Price WETH --> DAI:", trade.executionPrice.toSignificant(6));
// 	console.log("Mid Price after trade WETH --> DAI:", trade.nextMidPrice.toSignificant(6));

  

// }


// contract('LiquidityPool Uniswap', function (accounts) {
//   it("create LP Uniswap", async function () {
//     await init();
//   })
// });




var Web3 = require('web3');
var BN = Web3.utils.BN;

const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

const UniswapV2FactoryABI = require("@uniswap/v2-core/build/UniswapV2Factory.json").abi;
const uniswapV2Address = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const uniswapV2factoryContract = new web3.eth.Contract(UniswapV2FactoryABI, uniswapV2Address);


// var uniswapV2Router =   '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
const  daiToken = '0x6b175474e89094c44da98b954eedeac495271d0f';

contract('LiquidityPool Uniswap', function (accounts) {
  it("create LP Uniswap", function () {
    // create exchange
    var token;
    return Token.deployed().then(async function (instance) {
      token = instance;
      let tokenAddress = token.address;
      console.log('tokenAddress:'+tokenAddress);
      console.log('balance of fleep:'+ (await token.balanceOf(accounts[0])));
      console.log('eth of user:' + (await web3.eth.getBalance(accounts[0])));

      await uniswapV2factoryContract.methods.createPair(tokenAddress,'0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2').send({from: accounts[0]});
      // await uniswapV2factoryContract.methods.createPair(tokenAddress,daiToken).call({from: accounts[0]});

      // let pairAdd = await token.createPair1({from: accounts[0]});
      // console.log('pairAdd found:'+JSON.stringify(pairAdd));
      // //get exchange
      // var pairAddress = await uniswapV2factoryContract.methods.getPair(tokenAddress,daiToken).call();
      // console.log('pairAddress found:'+pairAddress);
      // var allPairLength = await uniswapV2factoryContract.methods.allPairsLength().call();
      // console.log('allPairLength found:'+allPairLength);
      
      // if (pairAddress == '0x0000000000000000000000000000000000000000') {
        // await uniswapV2factoryContract.methods.createPair(tokenAddress,daiToken).call({from: accounts[0], gas: '1000000'});
      // }

      // var exchangeAddress = await uniswapV2factoryContract.methods.createPair(tokenAddress,daiToken).call();
      // console.log('create exchange sent:' + exchangeAddress);
      // if (exchangeAddress == '0x0000000000000000000000000000000000000000') {
      //   //create exchange
      //   console.log('create exchange sent from tokenaddress:'+tokenAddress);
      //   try {
      //     await factoryContract.methods.createExchange(tokenAddress).send( {from: accounts[0], gas: "1000000"});
      //   } catch (error) {
      //     console.log('error:'+error);
      //   }
        
      // }
      // exchangeAddress = await factoryContract.methods.getExchange(tokenAddress).call();
      // assert.equal(exchangeAddress != '0x0000000000000000000000000000000000000000', true, 'create exchange for token error');

      // console.log('Exchange address:' + exchangeAddress);
      // const exchangeContract = new web3.eth.Contract(exchangeABI, exchangeAddress);
      // await exchangeContract.methods
      //   .addLiquidity(100, 100000, Math.floor(Date.now() / 1000) + 1200)
      //   .send({ value: 1 });

      // const tokenReserve = await tokenContract.methods.balanceOf(exchangeAddress);
      // console.log('tokenReserve:' + JSON.stringify(tokenReserve));
    })
  });

})

