// contracts/Tokes.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Tokes is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokesCounter;

    // Amount of ether held in each Ether Toke
    mapping(uint256 => uint256) private _etherTokes;

    event MintEtherToke(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount);
    event RedeemEtherToke(address indexed to, uint256 indexed tokenId, uint256 indexed amount);

    constructor() ERC721("Tokes", "Tokes") {}

    function getToke(uint256 tokeId) public view returns (address owner, uint256 value, bool isEtherToke) {
        require(_exists(tokeId), "This toke does not exist.");

        owner = ownerOf(tokeId);
        isEtherToke = false;

        if (_etherTokes[tokeId] > 0) {
            value = _etherTokes[tokeId];
            isEtherToke = true;
        }

        return (owner, value, isEtherToke);
    }

    function mintEtherToke(address to) public payable {
        require(msg.value > 0, "No ether sent");

        _etherTokes[_tokesCounter.current()] = msg.value;
        _safeMint(to, _tokesCounter.current());

        emit MintEtherToke(msg.sender, to, _tokesCounter.current(), msg.value);

        _tokesCounter.increment();
    }

    function redeem(uint256 tokeId) public {
        require(_isApprovedOrOwner(msg.sender, tokeId), "You don't have the permissions to manage this toke.");

        if (_etherTokes[tokeId] > 0) {
            uint256 value = _etherTokes[tokeId];
            (bool sent, bytes memory data) = msg.sender.call{value: value}("");
            require(sent, "Failed to send ether.");
            _burn(tokeId);
            emit RedeemEtherToke(msg.sender, tokeId, value);
        }
    }
}
