// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./PeggedToken.sol";

contract RewardContract {

  //assign Token contract to variable
  PeggedToken private token;

  //add mappings
  uint totalReward;

  //add events

  //pass as constructor argument deployed Token contract
  constructor(PeggedToken _token) {
    //assign token deployed contract to variable
    token = _token;
  }

  function tax() public {
    
  }

  function reward() public {
    
  }

}