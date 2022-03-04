// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Luke {
    string lukeMessage;

    function setLukeMessage(string memory x) public {
        lukeMessage = x;
    }

    function getLukeMessage() public view returns (string memory) {
        return lukeMessage;
    }
}