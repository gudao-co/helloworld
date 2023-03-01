下载工程后，需要先执行:  
`npm install`  
然后，创建和配置自己的 `.env` 文件  

## Hardhat 本地 web3 环境:

1、`npm init`  
2、`npm install --save-dev hardhat`  
3、`npx hardhat` 初始化 hardhat  
4、`npm install dotenv --save`  
5、创建 .env  --> .gitignore  
```
API_URL="<your-api-url>"
PRIVATE_KEY="<your-private-key>"
ETHSCAN_API_KEY="<your-api-key>"
``` 
API_URL: 可以使用 Alchemy / infura 等节点服务商，帮助我们的 dapp 和链交互  
PRIVATE_KEY: 钱包的私钥  
ETHSCAN_API_KEY: Etherscan 的私钥，用来验证合约：账户详情 -> 导出私钥  

6、创建文件目录 `mkdir contracts` && `mkdir scripts`

其他库的安装:  
安装 hardhat 部署插件: `npm install --save-dev @nomiclabs/hardhat-etherscan`  
ethers： `npm install --save-dev @nomiclabs/hardhat-ethers ethers`  

hardhat.config.js:
hardhat 文档: https://hardhat.org/tutorial/testing-contracts#writing-tests
```js
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
const { API_URL, PRIVATE_KEY, ETHSCAN_API_KEY } = process.env;
module.exports = {
   solidity: "0.8.17",
   defaultNetwork: "goerli",
   networks: {
      hardhat: {},
      goerli: {
         url: API_URL,
         accounts: [`0x${PRIVATE_KEY}`]
      }
   },

   etherscan: {
    apiKey: ETHSCAN_API_KEY, 
  },
}
```

在 scripts/ 下创建 deploy.js 部署脚本:  
```js
async function main() {
  // 使用 ethers 获取一个 合约实例
  const Contract = await ethers.getContractFactory("<contract-name>");
  // 获取一个部署对象
  const DeployContract = await Contract.deploy(<param>);
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
```  

**编译**  
`npx hardhat compile` 编译合约代码 【首次最好配置终端的科学网络】  

**部署**  
`npx hardhat --network goerli run scripts/deploy.js` 部署  

**验证**  
 `npx hardhat verify --network goerli <contract address> <constructor parameters>
<constructor parameters>` 只需为原始参数即可  