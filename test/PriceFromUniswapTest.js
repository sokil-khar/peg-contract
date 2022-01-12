const Token = artifacts.require("PeggedToken");
var Web3 = require('web3');
var BN = Web3.utils.BN;

const web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

const exchangeABI = [
  {
    name: "TokenPurchase",
    inputs: [
      { type: "address", name: "buyer", indexed: true },
      { type: "uint256", name: "eth_sold", indexed: true },
      { type: "uint256", name: "tokens_bought", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "EthPurchase",
    inputs: [
      { type: "address", name: "buyer", indexed: true },
      { type: "uint256", name: "tokens_sold", indexed: true },
      { type: "uint256", name: "eth_bought", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "AddLiquidity",
    inputs: [
      { type: "address", name: "provider", indexed: true },
      { type: "uint256", name: "eth_amount", indexed: true },
      { type: "uint256", name: "token_amount", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "RemoveLiquidity",
    inputs: [
      { type: "address", name: "provider", indexed: true },
      { type: "uint256", name: "eth_amount", indexed: true },
      { type: "uint256", name: "token_amount", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "Transfer",
    inputs: [
      { type: "address", name: "_from", indexed: true },
      { type: "address", name: "_to", indexed: true },
      { type: "uint256", name: "_value", indexed: false },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "Approval",
    inputs: [
      { type: "address", name: "_owner", indexed: true },
      { type: "address", name: "_spender", indexed: true },
      { type: "uint256", name: "_value", indexed: false },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "setup",
    outputs: [],
    inputs: [{ type: "address", name: "token_addr" }],
    constant: false,
    payable: false,
    type: "function",
    gas: 175875,
  },
  {
    name: "addLiquidity",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "min_liquidity" },
      { type: "uint256", name: "max_tokens" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 82605,
  },
  {
    name: "removeLiquidity",
    outputs: [
      { type: "uint256", name: "out" },
      { type: "uint256", name: "out" },
    ],
    inputs: [
      { type: "uint256", name: "amount" },
      { type: "uint256", name: "min_eth" },
      { type: "uint256", name: "min_tokens" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 116814,
  },
  {
    name: "__default__",
    outputs: [],
    inputs: [],
    constant: false,
    payable: true,
    type: "function",
  },
  {
    name: "ethToTokenSwapInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "min_tokens" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 12757,
  },
  {
    name: "ethToTokenTransferInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "min_tokens" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 12965,
  },
  {
    name: "ethToTokenSwapOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 50455,
  },
  {
    name: "ethToTokenTransferOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
    ],
    constant: false,
    payable: true,
    type: "function",
    gas: 50663,
  },
  {
    name: "tokenToEthSwapInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_eth" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 47503,
  },
  {
    name: "tokenToEthTransferInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_eth" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 47712,
  },
  {
    name: "tokenToEthSwapOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "eth_bought" },
      { type: "uint256", name: "max_tokens" },
      { type: "uint256", name: "deadline" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 50175,
  },
  {
    name: "tokenToEthTransferOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "eth_bought" },
      { type: "uint256", name: "max_tokens" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 50384,
  },
  {
    name: "tokenToTokenSwapInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_tokens_bought" },
      { type: "uint256", name: "min_eth_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "token_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 51007,
  },
  {
    name: "tokenToTokenTransferInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_tokens_bought" },
      { type: "uint256", name: "min_eth_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
      { type: "address", name: "token_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 51098,
  },
  {
    name: "tokenToTokenSwapOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "max_tokens_sold" },
      { type: "uint256", name: "max_eth_sold" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "token_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 54928,
  },
  {
    name: "tokenToTokenTransferOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "max_tokens_sold" },
      { type: "uint256", name: "max_eth_sold" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
      { type: "address", name: "token_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 55019,
  },
  {
    name: "tokenToExchangeSwapInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_tokens_bought" },
      { type: "uint256", name: "min_eth_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "exchange_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 49342,
  },
  {
    name: "tokenToExchangeTransferInput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_sold" },
      { type: "uint256", name: "min_tokens_bought" },
      { type: "uint256", name: "min_eth_bought" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
      { type: "address", name: "exchange_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 49532,
  },
  {
    name: "tokenToExchangeSwapOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "max_tokens_sold" },
      { type: "uint256", name: "max_eth_sold" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "exchange_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 53233,
  },
  {
    name: "tokenToExchangeTransferOutput",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "uint256", name: "tokens_bought" },
      { type: "uint256", name: "max_tokens_sold" },
      { type: "uint256", name: "max_eth_sold" },
      { type: "uint256", name: "deadline" },
      { type: "address", name: "recipient" },
      { type: "address", name: "exchange_addr" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 53423,
  },
  {
    name: "getEthToTokenInputPrice",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "uint256", name: "eth_sold" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 5542,
  },
  {
    name: "getEthToTokenOutputPrice",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "uint256", name: "tokens_bought" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 6872,
  },
  {
    name: "getTokenToEthInputPrice",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "uint256", name: "tokens_sold" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 5637,
  },
  {
    name: "getTokenToEthOutputPrice",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "uint256", name: "eth_bought" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 6897,
  },
  {
    name: "tokenAddress",
    outputs: [{ type: "address", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1413,
  },
  {
    name: "factoryAddress",
    outputs: [{ type: "address", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1443,
  },
  {
    name: "balanceOf",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [{ type: "address", name: "_owner" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 1645,
  },
  {
    name: "transfer",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_to" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 75034,
  },
  {
    name: "transferFrom",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_from" },
      { type: "address", name: "_to" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 110907,
  },
  {
    name: "approve",
    outputs: [{ type: "bool", name: "out" }],
    inputs: [
      { type: "address", name: "_spender" },
      { type: "uint256", name: "_value" },
    ],
    constant: false,
    payable: false,
    type: "function",
    gas: 38769,
  },
  {
    name: "allowance",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [
      { type: "address", name: "_owner" },
      { type: "address", name: "_spender" },
    ],
    constant: true,
    payable: false,
    type: "function",
    gas: 1925,
  },
  {
    name: "name",
    outputs: [{ type: "bytes32", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1623,
  },
  {
    name: "symbol",
    outputs: [{ type: "bytes32", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1653,
  },
  {
    name: "decimals",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1683,
  },
  {
    name: "totalSupply",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 1713,
  },
];

// uniswap contract factory in mainnet
// const factoryAddress = "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95";
const factoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const factoryABI = [
  {
    name: "NewExchange",
    inputs: [
      { type: "address", name: "token", indexed: true },
      { type: "address", name: "exchange", indexed: true },
    ],
    anonymous: false,
    type: "event",
  },
  {
    name: "initializeFactory",
    outputs: [],
    inputs: [{ type: "address", name: "template" }],
    constant: false,
    payable: false,
    type: "function",
    gas: 35725,
  },
  {
    name: "createExchange",
    outputs: [{ type: "address", name: "out" }],
    inputs: [{ type: "address", name: "token" }],
    constant: false,
    payable: false,
    type: "function",
    gas: 187911,
  },
  {
    name: "getExchange",
    outputs: [{ type: "address", name: "out" }],
    inputs: [{ type: "address", name: "token" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 715,
  },
  {
    name: "getToken",
    outputs: [{ type: "address", name: "out" }],
    inputs: [{ type: "address", name: "exchange" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 745,
  },
  {
    name: "getTokenWithId",
    outputs: [{ type: "address", name: "out" }],
    inputs: [{ type: "uint256", name: "token_id" }],
    constant: true,
    payable: false,
    type: "function",
    gas: 736,
  },
  {
    name: "exchangeTemplate",
    outputs: [{ type: "address", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 633,
  },
  {
    name: "tokenCount",
    outputs: [{ type: "uint256", name: "out" }],
    inputs: [],
    constant: true,
    payable: false,
    type: "function",
    gas: 663,
  },
];
const factoryContract = new web3.eth.Contract(factoryABI, factoryAddress);

contract('PeggedToken sell token', function (accounts) {
  it("get price from token", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.getTokenPrice('0xb20bd5d04be54f870d5c0d3ca85d82b34b836405', 1);
    }).then(function (result) {
      let price = new BN(result);
      assert.equal(price.sub(new BN('1000000000000000000')).abs().lt(new BN('10000000000000000')), true, 'get price not correct. DAI always sam USDT');
    })
  });
});

contract('LiquidityPool Uniswap', function (accounts) {
  it("create LP Uniswap", function () {
    // create exchange
    var token;
    return Token.deployed().then(async function (instance) {
      token = instance;
      let tokenAddress = token.address;
      //get exchange
      var exchangeAddress = await factoryContract.methods.getExchange(tokenAddress).call();
      console.log('create exchange sent:' + exchangeAddress);
      if (exchangeAddress == '0x0000000000000000000000000000000000000000') {
        //create exchange
        console.log('create exchange sent from tokenaddress:'+tokenAddress);
        try {
          await factoryContract.methods.createExchange(tokenAddress).send( {from: accounts[0], gas: "1000000"});
        } catch (error) {
          console.log('error:'+error);
        }
        
      }
      exchangeAddress = await factoryContract.methods.getExchange(tokenAddress).call();
      assert.equal(exchangeAddress != '0x0000000000000000000000000000000000000000', true, 'create exchange for token error');

      console.log('Exchange address:' + exchangeAddress);
      const exchangeContract = new web3.eth.Contract(exchangeABI, exchangeAddress);
      await exchangeContract.methods
        .addLiquidity(100, 100000, Math.floor(Date.now() / 1000) + 1200)
        .send({ value: 1 });

      const tokenReserve = await tokenContract.methods.balanceOf(exchangeAddress);
      console.log('tokenReserve:' + JSON.stringify(tokenReserve));
    })
  });

})

