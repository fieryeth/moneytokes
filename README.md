# MoneyTokes

This project contains a smart contract `Tokes` that allows users to
mint an NFT, called a "Toke" containing ETH that can be claimed by
whoever is the owner.

This Toke can be transferred like any other NFT but can also have
an expiration date after which its creator can redeem the funds if
they aren't already claimed by the owner.

### Usage
* `mintEtherToke(address to, uint256 expiration)`
  * mints a Toke containing `msg.value` and sends it to `to`
  * expiration is a Unix timestamp, 0 if the Toke can't expire
  * emits `MintEtherToke(from, to, tokeId, amount, expiration)` 
* `mintERC20Toke(address token, address to, uint256 amount, uint256 expiration)`
  * mints a Toke containing `amount` of `token` and sends it to `to`
  * expiration is a Unix timestamp, 0 if the Toke can't expire
  * emits `MintERC20Toke(from, to, tokeId, token, amount, expiration)`
* `redeem(uint256 tokeId)`
  * burns Toke `tokeId` and sends the funds to the owner
  * can only be called by the owner or an approved address
  * doesn't work if the Toke expired
  * emits `RedeemToke(to, tokeId)`
* `breakToke(uint256 tokeId)`
  * burns Toke `tokeId` but sends the funds to the creator (minter)
  * can only be called by the creator, after expiration
  * emits `RedeemToke(to, tokeId)`
