# MoneyTokes

This project contains a smart contract `Tokes` that allows users to
mint an NFT, called a "Toke" containing ETH that can be claimed by
whoever is the owner.

This Toke can be transferred like any other NFT but can also have
an expiration date after which its creator can redeem the funds if
they aren't already claimed by the owner.

### Usage
* `mintEtherToke(address to, uint256 expiration)`
  * mints a Toke containing `msg.value` in it and sends it to `to`
  * expiration is a Unix timestamp, 0 if the Toke can't expire
* `redeem(uint256 tokeId)`
  * burns Toke `tokeId` and sends the funds to the owner
  * can only be called by the owner or an approved address
  * doesn't work if the Toke expired
* `breakToke(uint256 tokeId)`
  * burns Toke `tokeId` but sends the funds to the creator (minter)
  * can only be called by the creator, after expiration
