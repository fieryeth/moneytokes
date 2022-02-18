// contracts/Tokes.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Tokes is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokesCounter;

    struct Toke {
        uint256 value;
        uint256 expiration;
        address token;
    }

    // Amount of ether held in each Ether Toke
    mapping(uint256 => Toke) private _tokes;

    event MintEtherToke(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount, uint256 expiration);
    event RedeemEtherToke(address indexed to, uint256 indexed tokenId, uint256 indexed amount);

    constructor() ERC721("Tokes", "Tokes") {}

    function getToke(uint256 tokeId) public view returns (address owner, uint256 value, bool isEtherToke) {
        require(_exists(tokeId), "This toke does not exist.");

        if (_tokes[tokeId].token == address(0)) {
            return (ownerOf(tokeId), _tokes[tokeId].value, true);
        }

    }

    function mintEtherToke(address to, uint256 expiration) public payable {
        require(msg.value > 0, "No ether sent");

        _tokes[_tokesCounter.current()] = Toke({value: msg.value, expiration: expiration, token: address(0)});
        _safeMint(to, _tokesCounter.current());

        emit MintEtherToke(msg.sender, to, _tokesCounter.current(), msg.value, expiration);

        _tokesCounter.increment();
    }

    function redeem(uint256 tokeId) public {
        require(_isApprovedOrOwner(msg.sender, tokeId), "You don't have the permissions to manage this toke.");

        if (_tokes[tokeId].token == address(0)) {
            uint256 value = _tokes[tokeId].value;
            (bool sent, bytes memory data) = msg.sender.call{value: value}("");
            require(sent, "Failed to send ether.");
            _burn(tokeId);
            delete _tokes[tokeId];
            emit RedeemEtherToke(msg.sender, tokeId, value);
        }
    }
}
