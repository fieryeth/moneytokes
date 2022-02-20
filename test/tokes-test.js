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

  it("Should deploy the Tokes contract and mint one ERC20 toke", async () => {
    const [owner, addr1] = await ethers.getSigners();
    const provider = owner.provider
    const Tokes = await ethers.getContractFactory("Tokes");
    const tokes = await Tokes.deploy()
    await tokes.deployed();

    const FakeToken = await ethers.getContractFactory("ERC20PresetFixedSupply");
    const fakeToken = await FakeToken.deploy("FakeToken", "FT", 10000, owner.address)
    await fakeToken.deployed();

    // Checks that owner has 10k FT before minting
    expect(await fakeToken.balanceOf(owner.address)).to.equal(10000);

    // Mints a Toke with 6k FT in it
    await fakeToken.approve(tokes.address, 6000);
    await tokes.mintERC20Toke(
      fakeToken.address,
      owner.address,
      6000,
      0,
    );

    // Checks that owner & Tokes contract have 4000 & 6000 FT after minting
    expect(await fakeToken.balanceOf(owner.address)).to.equal(4000);
    expect(await fakeToken.balanceOf(tokes.address)).to.equal(6000);

    // Checks owner owns the Toke
    expect(await tokes.ownerOf(0)).to.equal(owner.address);

    // Checks addr1 owns the Toke
    await tokes.transferFrom(owner.address, addr1.address, 0);
    expect(await tokes.ownerOf(0)).to.equal(addr1.address);

    // Checks addr1 redeemed the 6000 FT
    expect(await fakeToken.balanceOf(addr1.address)).to.equal(0);
    await tokes.connect(addr1).redeem(0);
    expect(await fakeToken.balanceOf(addr1.address)).to.equal(6000);

  })

  it("Should deploy the Tokes contract and count tokes", async () => {
    const [owner, addr1] = await ethers.getSigners();
    const provider = owner.provider
    const Tokes = await ethers.getContractFactory("Tokes");
    const tokes = await Tokes.deploy()
    await tokes.deployed();

    const FakeToken = await ethers.getContractFactory("ERC20PresetFixedSupply");
    const fakeToken = await FakeToken.deploy("FakeToken", "FT", 10000, owner.address)
    await fakeToken.deployed();

    // Checks that owner has 10k FT before minting
    expect(await fakeToken.balanceOf(owner.address)).to.equal(10000);

    // Mints 2 Tokes with 6k & 4k FT in it
    await fakeToken.approve(tokes.address, 10000);
    await tokes.mintERC20Toke(
      fakeToken.address,
      owner.address,
      6000,
      0,
    );

    await tokes.mintERC20Toke(
      fakeToken.address,
      owner.address,
      4000,
      0,
    );

    // Checks that owner has 2 tokes
    expect(await tokes.balanceOf(owner.address)).to.equal(2);
    expect(await tokes.tokenOfOwnerByIndex(owner.address, 0)).to.equal(0)

    await tokes.redeem(0)

    // Checks that owner has 1 tokes of id 1
    expect(await tokes.balanceOf(owner.address)).to.equal(1);
    expect(await tokes.tokenOfOwnerByIndex(owner.address, 0)).to.equal(1)
  })
})
