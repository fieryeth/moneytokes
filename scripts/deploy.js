async function main () {
  const Tokes = await ethers.getContractFactory('Tokes');
  console.log('Deploying Tokes...');
  const tokes = await Tokes.deploy();
  await tokes.deployed();
  console.log('Tokes deployed to:', tokes.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
