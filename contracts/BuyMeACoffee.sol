// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMeACoffee {
    //event to emit when a memo is created
    event newMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //memo struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    //list of all memos
    Memo[] memos;

    //address of contract deployer
    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    /**
     * @dev buy a coffe for contract owner
     * @param _name name for coffe buyer
     * @param _message  a nice message from the coffe buyer
     */
    function buyCoffe(string memory _name, string memory _message) public payable {
        require(msg.value > 0, 'cant buyt coffe with 0 eth');

      //add memo to storage
       memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        //emit a log event when a new memo is created
        emit newMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }

    /**
     * @dev send the balance to the owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    }

    /**
     * @dev retrive all the memos
     */
    function getMemos () public view returns(Memo [] memory) {
        return memos;
    }
  
}
