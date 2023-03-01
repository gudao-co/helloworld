async function main() {
    // 使用 ethers 获取一个 合约实例
    const Contract = await ethers.getContractFactory("MyNFT");
    // 获取一个部署对象
    const DeployContract = await Contract.deploy();
    // 部署，会返回一个 Promise<Contract>
    await DeployContract.deployed();
  
    console.log(
      `Contract deployed to: \n 
    https://goerli.etherscan.io/address/${DeployContract.address}`,
  
    );
  }
    
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });