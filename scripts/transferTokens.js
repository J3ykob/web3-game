const { ethers } = require("hardhat");



const main = async () => {

    const [owner, addr1] = await ethers.getSigners();
    console.log(addr1);
    const alfaAccess = await ethers.getContractAt("AlfaAccess", "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575", addr1);
    

   

    const result = await alfaAccess.connect(addr1).getStats(1);
    console.log(result)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
