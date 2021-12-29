const BrainContract = artifacts.require("./BrainContract");
const PeggedToken = artifacts.require("./PeggedToken");
// require('chai')
//   .use(require('chai-as-promised'))
//   .should()

contract("BrainContract", accounts => {
  let brainContract;
  let peggedToken;
  let initialPrice = 2;
  let decimal =  10**18;
  beforeEach(async () => {
    let time = Math.round(new Date().getTime()/1000);
    console.log('initial time:'+time);
    peggedToken =  await PeggedToken.new();
    brainContract = await BrainContract.new(peggedToken.address,time - 1000,initialPrice);
    // dbank = await DecentralizedBank.new(token.address)
    // await token.passMinterRole(dbank.address, {from: deployer})
  })
  


  describe('testing token contract...', () => {
    describe('success', () => {
      it("get last price success", async function() {
        let price = await brainContract.getLatestPrice();
        console.log("price receive:"+Number(price));
      })
      // it('get day 0 price success', async () => {
      //   expect(await brainContract.getPeggedPrice()).to.be.eq(initialPrice);
      // })
      it('success', async ()=>{
        let price = await brainContract.getPeggedPrice();
        console.log('decimal:'+(decimal * initialPrice));
        console.log('await brainContract.getPeggedPrice():'+price);
        expect(Number(price)).eq((decimal * initialPrice),"pegged price diff");
      })
      it('getRewardPct', async ()=>{
        const expert = {
          reward: 68945,
          base: 10000
        }
        var res = await brainContract.getRewardPercent(-30);
            console.log('x return:'+JSON.stringify(Number(res[0])));
            console.log('x return:'+JSON.stringify(Number(res[1])));
            expect(Number(res[0])).eq(expert.reward,'reward wrong');
            expect(Number(res[1])).eq(expert.base,'reward base wrong');
      })
      it('getTaxPercent', async ()=>{
        const expert = {
          reward: 101027,
          base: 10000
        }
        
        var res = await brainContract.getTaxPercent(-30);
            console.log('x return:'+JSON.stringify(Number(res[0])));
            console.log('x return:'+JSON.stringify(Number(res[1])));
            expect(Number(res[0])).eq(expert.reward,'tax wrong');
            expect(Number(res[1])).eq(expert.base,'tax base wrong');
      })
      it('getBuyerRewardPercent', async ()=>{
        const expert = {
          reward: 51727,
          base: 10000
        }
        //5.1727
        
        var res = await brainContract.getBuyerRewardPercent(-30);
            console.log('x return:'+JSON.stringify(Number(res[0])));
            console.log('x return:'+JSON.stringify(Number(res[1])));
            expect(Number(res[0])).eq(expert.reward,'buyer reward wrong');
            expect(Number(res[1])).eq(expert.base,'buyer reward base wrong');
      })
      

    })
  })
});

async function tryCatch(promise, message) {
  try {
      await promise;
      throw null;
  }
  catch (error) {
      assert(error, "Expected an error but did not get one");
      assert(error.message.startsWith(PREFIX + message), "Expected an error starting with '" + PREFIX + message + "' but got '" + error.message + "' instead");
  }
};