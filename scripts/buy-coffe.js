// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
// const hre = require("hardhat");
const {ethers} = require("hardhat")
// import {ethers} from "hardhat"


async function getBalance(address){
  const balanceBigInt = await ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
  let idx = 0;
  for(const address of addresses){
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

async function printMemos(memos){
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper},(${tipperAddress}) said: "${message}"`);
  }
}

async function main() {
  //get example accounts
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  //get the contract to deploy
  const BuyMeACoffe = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffe = await BuyMeACoffe.deploy();
  await buyMeACoffe.deployed();

  console.log("Buy me a coffe deployed ", buyMeACoffe.address);

  //check the balances before coffee purchase
  const addresses = [owner.address, tipper.address, buyMeACoffe.address];
  console.log("== start ==");
  await printBalances(addresses);

  //buy the owner some coffees
  const tip = {value: hre.ethers.utils.parseEther("1")}
  await buyMeACoffe.connect(tipper).buyCoffe("Alberina", "message", tip);
  await buyMeACoffe.connect(tipper2).buyCoffe("Albeirna 1", "message 1", tip);
  await buyMeACoffe.connect(tipper3).buyCoffe("Alberina 2", "message 2", tip);

  //check the balance after the purchase
  console.log("== bought coffee ==");
  await printBalances(addresses);

  //withdraw funds
  await buyMeACoffe.connect(owner).withdrawTips();

  //after withdraw
  console.log("== after withdraw ==");
  await printBalances(addresses);

  //print memos
  console.log("== memos ==");
  const memos = await buyMeACoffe.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
