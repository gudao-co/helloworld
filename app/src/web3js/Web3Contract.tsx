import useWeb3 from "../use/useWeb3"
import Web3 from "web3"
import MockERC20_ABI from "./MockERC20_ABI"
import { MockERC20 } from "./MockERC20"
import { useState } from "react"
import BigNumber from "bignumber.js"

function Web3Contract() {

    const [w3,] = useWeb3()
    const [balance, setBalance] = useState<string>()
    const [symbol, setSymbol] = useState<string>()
    const [transactionHash, setTransactionHash] = useState<string>()

    if (w3) {

        let contract = new w3.eth.Contract(MockERC20_ABI as any, "0xC7a8130e609a7F4E0107D2a6c4dD9dF7485a150a")
        let erc20 = contract.methods as MockERC20;

        let getBalance = async () => {
            let accounts = await w3.eth.getAccounts()
            let decimals = await erc20.decimals().call()
            let v = await erc20.balanceOf(accounts[0]).call()
            setBalance(BigNumber(v).dividedBy(BigNumber(10).pow(BigNumber(decimals))).toString())
        }

        (async function () {

            let symbol = await erc20.symbol().call()

            setSymbol(symbol)

            if (balance === undefined) {
                await getBalance()
            }

        })()

        let mint = () => {
            (async function () {

                let accounts = await w3.eth.getAccounts()
                let decimals = await erc20.decimals().call()
                erc20.mint(accounts[0], BigNumber(100).multipliedBy(BigNumber(10).pow(BigNumber(decimals))).toFixed())
                    .send({ from: accounts[0] })
                    .on('transactionHash', (hash) => {
                        setTransactionHash(hash)
                    })
                    .then(() => {
                        console.info('mint ok')
                        return getBalance()
                    })

            })()
        }

        return <div>
            <pre>Balance: {balance} {symbol}</pre>
            <pre>TransactionHash: {transactionHash}</pre>
            <button onClick={mint}>mint</button>
        </div>
    }

    return <></>
}

export default Web3Contract
