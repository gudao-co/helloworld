// SPDX-License-Identifier: GPL-3.0
// 开源许可标识符 SPDX

pragma solidity ^0.8.0;  // 0.8.0 < 0.9.0

// OpenZeppelin 开源的标准库
// github :  https://github.com/OpenZeppelin/openzeppelin-contracts
// webseite: https://www.openzeppelin.com/

// 1. Ethereum Foundation 以太坊基础库
// 2. 提供安全审查 风险管理服务，保证开放金融的可靠性
// 3. 使用 Solidity 开发的工具模块
// 4. 支持常见的 ERC20  ERC721  ERC1155

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyNewToken2 is ERC20 {  // is 继承自 ERC20

    // 部署合约的时候 只执行一次
    // 代币名称：MyNewToken
    // 代币符号：MNN
    constructor() ERC20("MyToken2", "MUN") {

        // 1. msg.sender 当前与合约交互的账户地址

        // 2. Solidity EVM 不支持 浮点数，只能使用整数代替
        // 2.1> EVM 字宽 256-bit，可以支持 256 位的整数,
        // 2.2> 10^18 wei = 10^9 Gwei = 1 ETH
        // 2.3> 利用更多的位数，避免使用小数, 例如 4 * 10^16 = 0.04 ETH
        // 2.4> 代码里使用 10 ** 18 表示 10^18

        // 下边代码表示初始铸造 1000 个 MTN 币
        _mint(msg.sender, 1000 * 10 ** 18);
    }

}