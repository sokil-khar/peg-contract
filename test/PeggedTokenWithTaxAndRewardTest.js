const Token = artifacts.require("PeggedToken");

contract('PeggedToken getPeggedPrice', function (accounts) {
  it("first day peggedPrice", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.getPeggedPrice.call();
    }).then(function (result) {
      console.log("balance:" + result);
    })
  });
});

contract('BrainContract', function (accounts) {
  it("first day getTaxPercent", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.getTaxPercent.call(-30);
    }).then(function (result) {
      console.log("result:"+JSON.stringify(result[0].toNumber()/result[1].toNumber()));
      console.log('diff:'+Math.abs(result[0].toNumber()/result[1].toNumber() - (0.93674**-30+3)));
      assert.equal(Math.abs(result[0].toNumber()/result[1].toNumber() - (0.93674**-30+3)) <= 0.0001, true, 'getTaxPercent success');
    })
  });
});

contract('BrainContract Deposit Reward', function (accounts) {
  it("first day getTaxPercent", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.deposit(accounts[1], 100000);
    }).then(function (result){
      return token.approve(accounts[0],800000,{from:[accounts[1]]})
    }).then(function (result){
      return token.depositWithReward(accounts[2],100);
    }).then(function (result) {
      // console.log("result:"+JSON.stringify(result));
      return token.balanceOf(accounts[2]);
    }).then(function (result){
      console.log('receive:'+result.toNumber());
      assert.equal(result.toNumber() - 10 > 0,true,'Receive reward success');
    })
  });
});