const Token = artifacts.require("PeggedToken");

contract('PeggedToken sell token', function (accounts) {
  it("Sell token with/without tax success", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.addToApplyTaxList(accounts[9]);
    }).then(function (result) {
      return token.isApplyTaxList.call(accounts[9]);
    }).then(function (result) {
      assert.equal(result,true,"addApply tax error");
      return token.addToIgnoreTaxList(accounts[1]);
    }).then(function (result){
      return token.isIgnoreTaxList.call(accounts[1]);
    }).then(function (result){
      assert.equal(result,true,"add ignore tax error");
      return token.transfer(accounts[2],100000, {from: accounts[0]})
    }).then(function (result){
      return token.balanceOf(accounts[2]);
    }).then(function (result){
      assert.equal(result.toNumber(),100000,"transfer from ignore tax keep ori value");
      return token.transfer(accounts[9], 10000, {from: accounts[2]});
    }).then(function (result){
      return token.balanceOf(accounts[9]);
    }).then(function (result){
      assert.equal(result.toNumber() < 10000 * 90/100, true, 'apply tax fail');
      console.log("balance receive:"+result.toNumber());
      return token.balanceOf(accounts[0]);
    }).then(function (result){
      assert.equal(result.toNumber() > 700000, true, 'apply tax to dev fail');
      console.log("balance receive:"+result.toNumber());
      return token.balanceOf(accounts[1]);
    }).then(function (result){
      assert.equal(result.toNumber() > 200000, true, 'apply tax to reward fail');
      console.log("balance receive:"+result.toNumber());
    })
  });
});

contract('PeggedToken buy token', function (accounts) {
  it("Buy token with/without reward success", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.addToApplyTaxList(accounts[9]);
    }).then(function (result) {
      return token.isApplyTaxList.call(accounts[9]);
    }).then(function (result) {
      assert.equal(result,true,"addApply tax error");
      return token.addToIgnoreTaxList(accounts[1]);
    }).then(function (result){
      return token.isIgnoreTaxList.call(accounts[1]);
    }).then(function (result){
      assert.equal(result,true,"add ignore tax error");
      return token.transfer(accounts[9],100000, {from: accounts[0]})
    }).then(function (result){
      return token.balanceOf(accounts[9]);
    }).then(function (result){
      assert.equal(result.toNumber(),100000,"transfer from ignore tax keep ori value");
      return token.transfer(accounts[2], 10000, {from: accounts[9]});
    }).then(function (result){
      return token.balanceOf(accounts[2]);
    }).then(function (result){
      assert.equal(result.toNumber() > 10000 * 105/100, true, 'apply reward fail');
      console.log("balance receive:"+result.toNumber());
      return token.balanceOf(accounts[0]);
    }).then(function (result){
      assert.equal(result.toNumber() == 700000, true, 'require dev wallet not change');
      console.log("balance receive:"+result.toNumber());
      return token.balanceOf(accounts[1]);
    }).then(function (result){
      assert.equal(result.toNumber() < 200000, true, 'reward to buyer fail');
      console.log("balance receive:"+result.toNumber());
    })
  });
});

