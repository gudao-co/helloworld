下载工程后，需要先执行:  
`npm install`  
然后，创建和配置自己的 `.env` 文件  

> 钱包里保持充足的测试币 > 1 GoerliETH

## 一：编写部署 NFT 合约
1> `npm install @openzeppelin/contracts` 基础库  
2> `npm install @alch/alchemy-web3`     web3 mint nft

合约代码:   
```js
// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;  // 0.8.0 < 0.9.0

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("MyTestNFT", "NFT") {}

    function mintNFT(address recipient, string memory tokenURI)
        public onlyOwner
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }
}
```  

修改 `deploy.js` 为部署 'MyNFT'

**编译**  
`npx hardhat compile` 编译合约代码 【首次最好配置终端的科学网络】  

**部署**  
`npx hardhat --network goerli run scripts/deploy.js` 部署  

**验证**  
 `npx hardhat verify --network goerli <contract address>`

## 二：上传 图片 / metadata 到 IPFS 上

这里用 Pinata: https://app.pinata.cloud/  

1、上传一张图片到 IPFS 上  
2、新建 nft-metadata.json 文件:  
```json
{
    "attributes": [
      {
        "trait_type": "Breed",
        "value": "Maltipoo"
      },
      {
        "trait_type": "Eye color",
        "value": "Mocha"
      }
    ],
    "description": "The world's most adorable and sensitive pup.",
    "image": "ipfs://QmTNL3LvbwDogM4UQp43HrFRyDARLXFSN3xGRGuijzT2Vq",
    "name": "Profile"
  }
  
```  
3、上传 nft-metadata.json 文件到 IPFS

验证 CID 是否正确：https://gateway.pinata.cloud/ipfs/<CID>  
metadata.json 文件格式：https://docs.opensea.io/docs/metadata-standards



## 三：编写 mint 脚本  

1、将 PUBLIC_KEY 加到 .env 中，表示要讲 nft mint 给谁  
2、编写 nft-mint.js 脚本:   
```js  
require("dotenv").config()
const API_URL = process.env.API_URL
const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY

const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const contractAddress = "0x25fBCeAa008Cff7Ec0A318E56Ec4d6A0B89Cc2aa"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce

  // the transaction
  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
  
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log(" Promise failed:", err)
    })
}
  
mintNFT("ipfs://<your-metadata-CID>");
```  
  
3、执行脚本：`node scripts/mint-nft.js`
