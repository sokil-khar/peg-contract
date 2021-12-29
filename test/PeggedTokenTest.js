const Token = artifacts.require("PeggedToken");

contract('PeggedToken', function (accounts) {
  it("should assert true", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.totalSupply.call();
    }).then(function (result) {
      assert.equal(result.toNumber(), 800000, 'total supply is wrong');
      return token.balanceOf.call(accounts[0]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 800000, 'deployer need hold all tokens');
    })
  });
  it("symbol token success", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.symbol.call();
    }).then(function (result) {
      assert.equal(result, "PEGD", 'symbol token wrong');
    })
  });
  it("named token success", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.name.call();
    }).then(function (result) {
      assert.equal(result, "Pegged Token", 'Named token wrong');
    })
  });
  it("should transfer right token", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.transfer(accounts[1], 400000);
    }).then(function () {
      return token.balanceOf.call(accounts[0]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 400000, 'accounts[0] balance is wrong');
      return token.balanceOf.call(accounts[1]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 400000, 'accounts[1] balance is wrong');
    })
  });

  it("should give accounts[1] authority to spend account[0]'s token", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.approve(accounts[1], 200000);
    }).then(function () {
      return token.allowance.call(accounts[0], accounts[1]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 200000, 'allowance is wrong');
      return token.transferFrom(accounts[0], accounts[2], 200000, { from: accounts[1] });
    }).then(function () {
      return token.balanceOf.call(accounts[0]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 200000, 'accounts[0] balance is wrong');
      return token.balanceOf.call(accounts[1]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 400000, 'accounts[1] balance is wrong');
      return token.balanceOf.call(accounts[2]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 200000, 'accounts[2] balance is wrong');
      return token.allowance.call(accounts[0], accounts[1]);
    }).then(function (result) {
      //use almost all allowance
      assert.equal(result.toNumber(), 0, 'allowance is wrong');
    });
  });

  it("should thow VMException", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.allowance.call(accounts[0], accounts[1]);
    }).then(function (result) {
      //use almost all allowance
      assert.equal(result.toNumber(), 0, 'allowance is wrong');
      return token.transferFrom(accounts[0], accounts[2], 200000, { from: accounts[1] });
    }).then(function (result) {
      assert.error('Should raise exception');
    }).catch(function (error) {
      assert.include(
        error.message,
        'transfer amount exceeds allowance',
      )
    });
  });

});

contract('PeggedToken Deposit', function (accounts) {
  it("should assert true", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.deposit(accounts[0], 100000);
    }).then(function (result) {
      // console.log("result:"+JSON.stringify(result));
      // assert.equal(result.toNumber(), 800000, 'total supply is wrong');
      return token.balanceOf.call(accounts[0]);
    })
      .then(function (result) {
        assert.equal(result.toNumber(), 800000, 'self transfer dont change token number');
        token.deposit(accounts[2], 100000);
      })
      .then(function (result) {
        // console.log("result:"+JSON.stringify(result));
        // assert.equal(result.toNumber(), 800000, 'total supply is wrong');
        return token.balanceOf.call(accounts[2]);
      })
      .then(function (result) {
        assert.equal(result.toNumber(), 100000, 'Receive enough balance');
      })
  });
});

contract('PeggedToken Withdraw', function (accounts) {
  it("withdraw success", function () {
    var token;
    return Token.deployed().then(function (instance) {
      token = instance;
      return token.balanceOf.call(accounts[0]);
    }).then(function (result) {
      // console.log("balance:" + result.toNumber());
      return token.withdraw(result.toNumber(), { from: accounts[0] });
      // assert.equal(result.toNumber(), 800000, 'total supply is wrong');
    }).then(function (result) {
      // assert.equal(result, "true", 'Withdraw success');
      return token.balanceOf.call(accounts[0]);
    }).then(function (result){
      assert.equal(result.toNumber(), 800000, 'withdraw to same dev wallet so dont change token hold');  
      return token.deposit(accounts[1], 100000);
    }).then(function (result) {
      return token.balanceOf.call(accounts[1]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 100000, 'deposit success');
      return token.withdraw(50000, {from: accounts[1]});
    }).then(function (result) {
      return token.balanceOf.call(accounts[1]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 50000, 'deposit success');
      return token.balanceOf.call(accounts[0]);
    }).then(function (result) {
      assert.equal(result.toNumber(), 750000, 'withdraw success');
      return token.balanceOf.call(accounts[0]);
    })
  });
});