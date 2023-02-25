
import './App.css';
import useWeb3 from './use/useWeb3';
// import Web3jsWalletConnect from './web3js/WalletConnect';
import Web3Contract from './web3js/Web3Contract';
import Web3jsMetaMask from './web3js/MetaMask';
// import Web3jsWalletConnect2 from './web3js/WalletConnect2';
// import Web3jsRpc from './web3js/Rpc';

function App() {

  const [w3] = useWeb3()

  if (w3) {
    console.info('Web3 OK')
  }

  return (
    <div className="App">
      {/* <Web3jsRpc></Web3jsRpc> */}
      <Web3jsMetaMask></Web3jsMetaMask>
      {/* <Web3jsWalletConnect2></Web3jsWalletConnect2> */}
      {/* <Web3jsWalletConnect></Web3jsWalletConnect> */}
      <Web3Contract></Web3Contract>
    </div>
  );
}

export default App;
