## Deploy token to kovan testnet
### 1. Prepeare
Step 1: Prepare environment value
- Create .env file in root folder with content
~~~
privateKeys='privatekey of metamask account using to deploy token - owner of token'
INFURA_API_KEY='example'
# create project in kovan testnet and get API key from https://infura.io/dashboard
~~~
Step 2: Prepeare some ETH GWEN in kovan testnet to deploy token - free from this link
 https://faucets.chain.link/

Step 3: Change parameters to deploy token in file 1_initial_migration.js

+ const devWallet = 'address of dev wallet';
+ const rewardWallet = 'address of dev wallet';
+ const pairFeedPrice = 'address of pair DAI-Fleep pair' ==> We will update this address after having LP, so can push any address;
+ const initialTimestamp = 1640701175; ==> initial timestamp apply for pegged price
+ const initialPrice = new BN('2000000000000000000')
 => initial price pegged (price at from initialTimestamp) * 10**18 (because smart contract do not support float number - so if price of token is 1.5$, price of token will using 10 decimals  1.5 * 10^18)
### 2. Deploy token
In root folder, run command to deploy token to kovan testnet
~~~
truffle migrate --network kovan

truffle run verify FleepToken --network kovan
~~~
After deploy token, the address of token save in src/abis.networks.42.address
- Import this address to metamask wallet to see token
- Create LP Pool from DAI to FLEEP, go to kovan.etherscan.io to search the deployer wallet to find addess of pair token (DAI-FLEEP) create before
EX: 0xB633a0903326b4C51Adc270793213fF43b25f6b9
### 3. Start web and test with account metamask
~~~
npm start
~~~
- Add LP Pool address to applyTaxList and test transfer and transferFrom function
- setPairForPrice: with input is address of PAIR DAI and FLEEP create before
- setUseFeedPrice(true): to apply tax with feedPrice from pair

### 4. Some common function
#### 4.1 Change pegged rate 
~~~
setRate(uint256 _A, uint256 _perA, uint256 _B, uint256 _perB))
~~~
Because smart contract not support float number, so we need to set increase price of day x  with formula:
~~~
increase day (x) = x * A/perA + B/perB
~~~
After using this function, x will be reset to 0, initialPeggedPrice = current Pegged Price
#### 4.2 Set Pair address for calculate price of token and calculate maxSellable 
~~~
setPairForPrice(address _pairFeedPrice, bool _isToken0)
+ First parameter is address of pair DAO - FLEEP
+ Second parameter is false (just pass true of pair is FLEEP - DAO)

setUseFeedPrice(bool _useFeedPrice)
=> Using for enable apply pegged Price, apply tax and apply maxSellable
+ Only enable if have address of pair DAO - FLEEP 
~~~

