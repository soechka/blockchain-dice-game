// contracts/BettinGame.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

error OutOfBalance();

contract BettingGame {
    address payable owner;
    /// Using event helps to decrease gas usage
    event DicesRolled(address indexed _from, uint dice1, uint dice2);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor () { 
        owner = payable(msg.sender); 
    }

    /// It's better to use Chainlink for randomness
    function rollDices(bool isEven) external payable returns (uint32 dice1, uint32 dice2) {
        if (msg.value * 2 > address(this).balance) {
            revert OutOfBalance();
        }

        dice1 = uint32(block.difficulty % 6) + 1;
        dice2 = uint32(block.timestamp % 6) + 1;
        
        if (isEven && (dice1 + dice2) % 2 == 0) {
            (bool success, ) = payable(msg.sender).call{value: msg.value * 2}("");
            require(success);
        } else if (!isEven && (dice1 + dice2) % 2 == 1) {
            (bool success, ) = payable(msg.sender).call{value: msg.value * 2}("");
            require(success);
        }

        emit DicesRolled(msg.sender, dice1, dice2);
    }

    function withdraw(uint32 amount) external onlyOwner {
        if (amount > address(this).balance) {
            revert OutOfBalance();
        }
        (bool success, ) = owner.call{value: amount}("");
        require(success);
    }

    receive() external payable {
    }
}