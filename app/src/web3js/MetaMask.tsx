import { useState } from 'react';
import Web3 from 'web3'
import { setWeb3 } from '../use/useWeb3';

function Web3jsMetaMask() {

    let [result, setResult] = useState<string>()
    let [reason, setReason] = useState<any>()
    let [loading, setLoading] = useState(false)
    let [account, setAccount] = useState<string>()
    let [w3, setW3] = useState<Web3>()

    if (!loading) {
        setLoading(true);
        (async function () {

            // MetaMask
            // https://docs.metamask.io/guide/getting-started.html

            if (typeof (window as any).ethereum !== 'undefined') {
                console.log('MetaMask is installed!');
                let eth = (window as any).ethereum
                w3 = new Web3(eth);
                setW3(w3)
                setWeb3(w3)

                let getInfo = async () => {
                    let chainId = await w3!.eth.getChainId()
                    setResult('MetaMask Chain Id :' + chainId)
                    let accounts = await w3!.eth.getAccounts();
                    setResult(`MetaMask Chain Id : ${chainId}\nAccount: ${accounts[0]}`)
                    setAccount(accounts[0])
                }

                await getInfo()

                eth.on('accountsChanged', () => {
                    console.info('accountsChanged')
                    getInfo().then(() => { }, setReason)
                })
                eth.on('disconnect', () => {
                    console.info('disconnect')
                })
                eth.on('connect', () => {
                    console.info('connect')
                })
                eth.on('chainChanged', () => {
                    console.info('chainChanged')
                    getInfo().then(() => { }, setReason)
                })
            } else {
                setResult('Install MetaMask : https://metamask.io/')
            }


        })().then(() => { }, setReason)
    }

    let connectButton = <></>

    let onConnect = () => {
        (async function () {
            let accounts = await w3!.eth.requestAccounts()
            if (accounts[0]) {
                setAccount(accounts[0])
            }
        })().then(() => { }, setReason)
    }

    if (!account && w3) {

        connectButton = <button onClick={onConnect}>Connect Wallet</button>
    }

    return (
        <div>
            <pre>{reason}</pre>
            <pre>{result}</pre>
            {connectButton}
        </div>
    );
}

export default Web3jsMetaMask;
