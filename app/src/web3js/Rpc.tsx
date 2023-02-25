import { useState } from 'react'
import Web3 from 'web3'
import { setWeb3 } from '../use/useWeb3'

function Web3jsRpc() {

    let [result, setResult] = useState<string>()
    let [reason, setReason] = useState<any>()
    let [loading, setLoading] = useState(false)

    if (!loading) {
        setLoading(true);
        (async function () {

            // 直接使用以太坊 RPC 地址
            // https://chainlist.org/
            // https://infura.io/

            let w3 = new Web3("https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
            let r = await w3!.eth.getChainId();
            setResult('Chain Id :' + r)
            setWeb3(w3)

        })().then(() => { }, setReason)
    }

    return (
        <div>
            <pre>{reason}</pre>
            <pre>{result}</pre>
        </div>
    );
}

export default Web3jsRpc;
