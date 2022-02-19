const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Tokes", () => {
  it("Should deploy the Tokes contract and mint one ether toke", async () => {
    const [owner, addr1] = await ethers.getSigners();
    const provider = owner.provider
    const Tokes = await ethers.getContractFactory("Tokes");
    const tokes = await Tokes.deploy()
    await tokes.deployed();

    // Checks owner has ~10k ETH
    expect(parseFloat(ethers.utils.formatEther(await provider.getBalance(owner.address)))).to.greaterThan(9999)

    // Mints a Toke with 10 ETH in it
    await tokes.mintEtherToke(
      owner.address,
      0,
      {value: ethers.utils.parseEther("10.0")}
    );

    // Checks owner has 10 ETH less than before minting
    expect(parseFloat(ethers.utils.formatEther(await provider.getBalance(owner.address)))).to.lessThan(9990)

    // Checks the Tokes contracts has 10 ETH in it
    expect(parseFloat(ethers.utils.formatEther(await provider.getBalance(tokes.address)))).to.equal(10)

    // Checks owner owns the Toke
    expect(await tokes.ownerOf(0)).to.equal(owner.address);

    // Checks addr1 owns the Toke
    await tokes.transferFrom(owner.address, addr1.address, 0);
    expect(await tokes.ownerOf(0)).to.equal(addr1.address);

    // Checks addr1 redeemed the ETH
    await tokes.connect(addr1).redeem(0);
    expect(parseFloat(ethers.utils.formatEther(await provider.getBalance(addr1.address)))).to.greaterThan(10009)

  })
})
