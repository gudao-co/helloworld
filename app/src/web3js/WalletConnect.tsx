import { useState } from 'react';
import Web3 from 'web3'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { setWeb3 } from '../use/useWeb3';
import { nextTick } from 'process';

function Web3jsWalletConnect() {

    let [result, setResult] = useState<string>()
    let [reason, setReason] = useState<any>()
    let [w3, setW3] = useState<Web3>()

    let connectButton = <></>

    let onConnect = () => {
        (async function () {

            // https://docs.walletconnect.com/1.0/quick-start/dapps/web3-provider
            const rpc: any = {
                '1': 'https://eth-mainnet.public.blastapi.io',
                '5': 'https://eth-goerli.public.blastapi.io'
            }

            let eth = new WalletConnectProvider({ rpc: rpc })

            await eth.enable()

            w3 = new Web3(eth as any);
            setW3(w3)
            setWeb3(w3)

            let getInfo = async () => {
                let chainId = await w3!.eth.getChainId()
                let accounts = await w3!.eth.getAccounts();
                setResult(`MetaMask Chain Id : ${chainId}\nAccount: ${accounts[0]}`)
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

        })().then(() => { }, (reason) => {
            if (reason && reason.stack) {
                nextTick(()=>{
                    setReason(reason.stack+'')
                }) 
            } else {
                setReason(reason + '')
            }
        })
    }

    if (!w3) {

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

export default Web3jsWalletConnect;
