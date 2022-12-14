// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const AlfaAccess = await hre.ethers.getContractFactory("AlfaAccess");
  const alfaAccess = await AlfaAccess.deploy("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 1);

  await alfaAccess.deployed();

  console.log("AlfaAccess NFT deployed to:", alfaAccess.address);

  for(let i=0;i<5;i++){
    const token = await alfaAccess.createToken();
  }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
