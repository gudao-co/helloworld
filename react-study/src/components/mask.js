import React from 'react';
import Web3 from 'web3';

class Mask extends React.Component {
  constructor() {
    super();
    this.state = {
      account: '',
    }
  }
  // 点击事件
  async handlerClick() {
    // Web3 实例化
    const web3 = new Web3(
      Web3.givenProvider || 'http://localhost:7545'
    );
    const accounts = await web3.eth.requestAccounts();
    // 设置 account 状态
    this.setState({
      account: accounts[0],
    });
  }
  // return dom 元素
  render() {
    return (
      <div className="container">
        <button className="btn" onClick={() => { this.handlerClick() }}>点击获取钱包账号</button>
        <h2 className="account-desc">当前钱包账号是：<span className="account-text">{ this.state.account }</span></h2>
      </div>
    )
  }
}


export default Mask;