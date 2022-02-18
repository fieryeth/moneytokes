// contracts/Tokes.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Tokes is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokesCounter;

    // Amount of ether held in each Ether Toke
    mapping(uint256 => Toke) private _tokes;

    struct Toke {
        uint256 value;
        uint256 expiration;
        address token;
        address creator;
    }

    modifier onlyCreator(uint256 tokeId) {
        require(msg.sender == _tokes[tokeId].creator, "You are not the creator of this toke.");
        _;
    }

    event MintEtherToke(address indexed from, address indexed to, uint256 indexed tokenId, uint256 amount, uint256 expiration);
    event RedeemToke(address indexed to, uint256 indexed tokenId);
    event BreakToke(address indexed creator, uint256 indexed tokenId);

    constructor() ERC721("Tokes", "Tokes") {}

    function getToke(uint256 tokeId) public view returns(address owner, uint256 value, bool isEtherToke, uint256 expiration) {
        require(_exists(tokeId), "This toke does not exist.");

        if (_tokes[tokeId].token == address(0)) {
            return (ownerOf(tokeId), _tokes[tokeId].value, true, _tokes[tokeId].expiration);
        }

    }

    function notExpired(uint256 tokeId) internal view returns(bool) {
        uint256 expiration = _tokes[tokeId].expiration;
        if(expiration == 0 || expiration > block.timestamp) {
            return true;
        }
        return false;
    }

    function mintEtherToke(address to, uint256 expiration) public payable {
        require(msg.value > 0, "No ether sent");

        _tokes[_tokesCounter.current()] = Toke({
            value: msg.value,
            expiration: expiration,
            token: address(0),
            creator: msg.sender
        });
        _safeMint(to, _tokesCounter.current());

        emit MintEtherToke(msg.sender, to, _tokesCounter.current(), msg.value, expiration);

        _tokesCounter.increment();
    }

    function _redeem(uint256 tokeId) internal {
        // If this is an ether toke
        if (_tokes[tokeId].token == address(0)) {
            uint256 value = _tokes[tokeId].value;
            (bool sent, bytes memory data) = msg.sender.call{value: value}("");
            require(sent, "Failed to send ether.");
            _burn(tokeId);
            delete _tokes[tokeId];
            emit RedeemToke(msg.sender, tokeId);
        }
    }

    function redeem(uint256 tokeId) public {
        require(_isApprovedOrOwner(msg.sender, tokeId), "You don't have the permissions to manage this toke.");
        require(notExpired(tokeId), "This toke expired.");

        _redeem(tokeId);
    }

    function breakToke(uint256 tokeId) public onlyCreator(tokeId) {
        require(!notExpired(tokeId), "This toke has not expired.");

        _redeem(tokeId);
    }
}
