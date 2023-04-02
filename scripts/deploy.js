const hre = require("hardhat");

async function main(){
  //get the contract to deploy
  const BuyMeACoffe = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffe = await BuyMeACoffe.deploy();
  await buyMeACoffe.deployed();

  console.log("deployed ", buyMeACoffe.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });