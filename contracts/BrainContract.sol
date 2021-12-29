// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library SafeMath {
    /**
     * @dev Returns the addition of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryAdd(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            uint256 c = a + b;
            if (c < a) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the substraction of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function trySub(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            if (b > a) return (false, 0);
            return (true, a - b);
        }
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, with an overflow flag.
     *
     * _Available since v3.4._
     */
    function tryMul(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
            // benefit is lost if 'b' is also tested.
            // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
            if (a == 0) return (true, 0);
            uint256 c = a * b;
            if (c / a != b) return (false, 0);
            return (true, c);
        }
    }

    /**
     * @dev Returns the division of two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryDiv(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a / b);
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers, with a division by zero flag.
     *
     * _Available since v3.4._
     */
    function tryMod(uint256 a, uint256 b)
        internal
        pure
        returns (bool, uint256)
    {
        unchecked {
            if (b == 0) return (false, 0);
            return (true, a % b);
        }
    }

    /**
     * @dev Returns the addition of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `+` operator.
     *
     * Requirements:
     *
     * - Addition cannot overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        return a + b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting on
     * overflow (when the result is negative).
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        return a - b;
    }

    /**
     * @dev Returns the multiplication of two unsigned integers, reverting on
     * overflow.
     *
     * Counterpart to Solidity's `*` operator.
     *
     * Requirements:
     *
     * - Multiplication cannot overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator.
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting when dividing by zero.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        return a % b;
    }

    /**
     * @dev Returns the subtraction of two unsigned integers, reverting with custom message on
     * overflow (when the result is negative).
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {trySub}.
     *
     * Counterpart to Solidity's `-` operator.
     *
     * Requirements:
     *
     * - Subtraction cannot overflow.
     */
    function sub(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b <= a, errorMessage);
            return a - b;
        }
    }

    /**
     * @dev Returns the integer division of two unsigned integers, reverting with custom message on
     * division by zero. The result is rounded towards zero.
     *
     * Counterpart to Solidity's `/` operator. Note: this function uses a
     * `revert` opcode (which leaves remaining gas untouched) while Solidity
     * uses an invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function div(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a / b;
        }
    }

    /**
     * @dev Returns the remainder of dividing two unsigned integers. (unsigned integer modulo),
     * reverting with custom message when dividing by zero.
     *
     * CAUTION: This function is deprecated because it requires allocating memory for the error
     * message unnecessarily. For custom revert reasons use {tryMod}.
     *
     * Counterpart to Solidity's `%` operator. This function uses a `revert`
     * opcode (which leaves remaining gas untouched) while Solidity uses an
     * invalid opcode to revert (consuming all remaining gas).
     *
     * Requirements:
     *
     * - The divisor cannot be zero.
     */
    function mod(
        uint256 a,
        uint256 b,
        string memory errorMessage
    ) internal pure returns (uint256) {
        unchecked {
            require(b > 0, errorMessage);
            return a % b;
        }
    }
}

contract BrainContract {
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
    constructor(uint256 _initialTime, uint256 _initialPrice) {
        //price feed initialPrice
        priceFeed = AggregatorV3Interface(
            0x777A68032a88E5A84678A77Af2CD65A7b3c0775a
        );
        //assign token deployed contract to variable
        initialTime = _initialTime;
        initialPrice = _initialPrice;
    }

    function changePriceFeedAddress(address priceFeedAddress)
        public
        returns (bool)
    {
        priceFeed = AggregatorV3Interface(priceFeedAddress);
        return true;
    }

    function changeInitialTimestamp(uint256 _initialTimestamp) public returns (bool) {
        initialTime = _initialTimestamp;
        return true;
    }

    function changeInitialPeggedPrice(uint256 _initialPrice) public returns (bool) {
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
        uint256 daysFromBegin = ceil(
            (currentTime - initialTime) / SECOND_PER_DAY,
            1
        );
        uint256 peggedPrice = uint256(
            initialPrice +
                SafeMath.div(SafeMath.mul(perPrice, daysFromBegin), 100) +
                SafeMath.mul(
                    SafeMath.mul(perPrice, daysFromBegin),
                    daysFromBegin + 1
                ) /
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
