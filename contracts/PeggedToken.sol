// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PeggedToken is ERC20 {
    address public owner = msg.sender;
    address public devWallet;
    address public rewardWallet;

    modifier restricted() {
        require(
            msg.sender == owner,
            "This function is restricted to the contract's owner"
        );
        _;
    }

    constructor(
        address _devWallet,
        address _rewardWallet,
        uint256 _initialTime,
        uint256 _initialPrice
    ) payable ERC20("Pegged Token", "PEGD") {
        //initital total supply is 800.000 tokens
        _mint(msg.sender, 800000);
        devWallet = _devWallet;
        rewardWallet = _rewardWallet;

        //data feed
        priceFeed = AggregatorV3Interface(
            0x777A68032a88E5A84678A77Af2CD65A7b3c0775a
        );
        //assign token deployed contract to variable
        initialTime = _initialTime;
        initialPrice = _initialPrice;
    }

    function deposit(address receiver, uint256 amount) public returns (bool) {
        // require(msg.value >= 1e16,'Error, deposit must be >= 0.01 ETH');
        return transfer(receiver, amount);
    }

    function withdraw(uint256 amount) public returns (bool) {
        //account withdraw will back to dev wallet
        //TODO transfer to reward wallet with formula
        return transfer(devWallet, amount);
    }

    function depositWithReward(address receiver, uint256 amount) public
        returns (bool)
    {
        (uint256 pct, uint256 base) = getRewardPercent(-30);
        require(transfer(receiver, amount) == true);
        //bonus from rewardWallet
        require(transferFrom(rewardWallet, receiver, amount * pct / base) == true);
        return true;
    }

    function withdrawWithTax(uint256 amount) public returns (bool) {
        //account withdraw will back to dev wallet
        return transfer(devWallet, amount);
    }

    // function getPeggedPrice() public view returns (uint256){
    //   return brainContract.getPeggedPrice();
    // }

    //tax, reward calculate function
    //Price Feed
    AggregatorV3Interface internal priceFeed;

    uint256 initialTime;
    uint256 initialPrice; // 2$
    uint256 perPrice = 1 * 10**18;

    //add mappings

    //add events

    //pass as constructor argument deployed Token contract
    /**
     * Network: Kovan
     * Aggregator: DAI/USD
     * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
     */
    // constructor(uint256 _initialTime, uint256 _initialPrice) {
    //     //price feed initialPrice
        
    // }

    function changePriceFeedAddress(address priceFeedAddress)
        public
        returns (bool)
    {
        priceFeed = AggregatorV3Interface(priceFeedAddress);
        return true;
    }

    function changeInitialTimestamp(uint256 _initialTimestamp)
        public
        returns (bool)
    {
        initialTime = _initialTimestamp;
        return true;
    }

    function changeInitialPeggedPrice(uint256 _initialPrice)
        public
        returns (bool)
    {
        initialPrice = _initialPrice;
        return true;
    }

    uint256 SECOND_PER_DAY = 86400; //24 * 60 * 60;

    /**
     * Returns the latest price
     */
    function getLatestPrice() public view returns (int256) {
        (
            ,
            // uint80 roundID,
            int256 price, // uint256 startedAt, // uint256 timeStamp, // uint80 answeredInRound
            ,
            ,

        ) = priceFeed.latestRoundData();
        return price;
    }

    /**
     pegged price increase by day: 0.0002X+0.01 (x is number of day from initialDay)
     ==> pegged_price_n = initial_price + n * (0.01) + (n*(n+1)/2 * 0.0002)
     */
    function getPeggedPrice() public view returns (uint256) {
        uint256 currentTime = block.timestamp;
        if (currentTime <= initialTime) {
            return initialPrice;
        }
        uint256 daysFromBegin = ceil((currentTime - initialTime) / SECOND_PER_DAY,1);
        uint256 peggedPrice = uint256(
            initialPrice +
                (perPrice * daysFromBegin) /
                100 +
                (perPrice * daysFromBegin * (daysFromBegin + 1)) /
                10000
        );
        return (peggedPrice);
    }

    /**
    return deviant of price - beetween current price and pegged price
     */
    function getDeviant() public view returns (int256) {
        //   return getTimestamp();
        int256 peggedPrice = int256(getPeggedPrice());
        int256 currentPrice = int256(getLatestPrice());
        return ((currentPrice - peggedPrice) * 100) / peggedPrice;
    }

    uint256 DEVIDE_STEP = 5;

    function getTaxPercent(int256 deviant)
        public
        view
        returns (uint256, uint256)
    {
        // 0.93859 ^ -5 = 138645146889 / 10 ** 11
        //tax : 0.93674^{x}+3

        if (deviant < 0) {
            uint256 uDeviant = uint256(-deviant);
            uint256 step = uDeviant / DEVIDE_STEP;
            uint256 resident = uDeviant - step * DEVIDE_STEP;
            uint256 j = 0;
            uint256 percent = 10**18;
            // return 9 ** uDeviant;
            for (j = 0; j < step; j += 1) {
                //for loop example
                percent = (percent * 138645146889) / 10**11;
            }
            percent = (percent * (100000**resident)) / (93674**resident);
            return (percent / (10**14) + 3 * 10000, 10**4);
        } else {
            return (0, 10**4);
        }
    }

    function getRewardPercent(int256 deviant)
        public
        view
        returns (uint256, uint256)
    {
        //1.0654279291277341544231240477738 = 1/0.93859 ~ 1.0654
        // 0.93859 ^ -10 = 1.8846936700630545738235994788055 ~ 188469367 / 10**8
        // 0.93859 ^ -5 = 137284145846 / 10 ** 11
        // 0.93859 ** x = (1/(0.93859))^ (-x) = (1 + 0.0654279291277341544231240477738) ^ -x ~ = 1 + (-x) *  0.0654279291277341544231240477738
        //reward : 0.93859 ^ -x + 0.2

        if (deviant < 0) {
            uint256 uDeviant = uint256(-deviant);
            uint256 step = uDeviant / DEVIDE_STEP;
            uint256 resident = uDeviant - step * DEVIDE_STEP;
            uint256 j = 0;
            uint256 percent = 10**18;
            // return 9 ** uDeviant;
            for (j = 0; j < step; j += 1) {
                //for loop example
                percent = (percent * 137284145846) / 10**11;
            }
            percent = (percent * (100000**resident)) / (93859**resident);
            return (percent / (10**14) + 2000, 10**4);
        } else {
            return (0, 10**4);
        }
    }

    function getBuyerRewardPercent(int256 deviant)
        public
        view
        returns (uint256, uint256)
    {
        // 0.947 ^ -5 = 1.31295579684  / 10 ** 11
        //reward : 0.947^{x}+0.05

        if (deviant < 0) {
            uint256 uDeviant = uint256(-deviant);
            uint256 step = uDeviant / DEVIDE_STEP;
            uint256 resident = uDeviant - step * DEVIDE_STEP;
            uint256 j = 0;
            uint256 percent = 10**18;
            // return 9 ** uDeviant;
            for (j = 0; j < step; j += 1) {
                //for loop example
                percent = (percent * 131295579684) / 10**11;
            }
            percent = (percent * (1000**resident)) / (947**resident);
            return (percent / (10**14) + 500, 10**4);
        } else {
            return (0, 10**4);
        }
    }

    // internal function
    function ceil(uint256 a, uint256 m) internal pure returns (uint256) {
        return ((a + m - 1) / m) * m;
    }
}
