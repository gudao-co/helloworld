import { useState } from 'react';
import Web3 from 'web3'
import { Web3Modal } from "@web3modal/standalone";
import UniversalProvider from "@walletconnect/universal-provider";
import { setWeb3 } from '../use/useWeb3';

function Web3jsWalletConnect2() {

    let [result, setResult] = useState<string>()
    let [reason, setReason] = useState<any>()
    let [account, setAccount] = useState<string>()
    let [w3, setW3] = useState<Web3>()

    let connectButton = <></>

    let onConnect = () => {
        (async function () {

            // WalletConnect
            // https://docs.walletconnect.com/2.0/web3modal/standalone/installation#obtain-project-id

            const chains: string[] = ['eip155:1']

            const rpcs: any = {
                'eip155:1': 'https://eth-mainnet.public.blastapi.io',
                'eip155:5': 'https://eth-goerli.public.blastapi.io'
            }

            // https://cloud.walletconnect.com/

            const projectId = '84af2a3930f88dac9bb7b8c4528ad4a7'

            const web3Modal = new Web3Modal({
                walletConnectVersion: 2,
                projectId: projectId,
                standaloneChains: chains,
            });

            let eth = await UniversalProvider.init({
                projectId: projectId,
            });

            eth.on("display_uri", async (uri: string) => {
                console.info(uri)
                web3Modal.openModal({ uri });
            });

            let connected = false;

            await Promise.race([new Promise<any>((resolve, reject) => {
                web3Modal.subscribeModal((s) => {
                    console.info('web3Modal.subscribeModal', s)
                    if (!s.open && !connected) {
                        reject('User canceled')
                    }
                })
            }), eth.connect({
                namespaces: {
                    eip155: {
                        methods: [
                            "eth_sendTransaction",
                            "eth_signTransaction",
                            "eth_sign",
                            "personal_sign",
                            "eth_signTypedData",
                        ],
                        chains: chains,
                        events: ["chainChanged", "accountsChanged"],
                        rpcMap: rpcs,
                    },
                },
            })])

            connected = true;

            web3Modal.closeModal();

            await eth.enable();

            w3 = new Web3(eth);
            setW3(w3)
            setWeb3(w3)

            let getInfo = async () => {
                let chainId = await w3!.eth.getChainId()
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

        })().then(() => { }, setReason)
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

export default Web3jsWalletConnect2;
