import { nextTick } from "process";
import { Dispatch, SetStateAction, useState } from "react";
import Web3 from "web3";

let _st: [Web3 | undefined, Dispatch<SetStateAction<Web3 | undefined>>]

export function setWeb3(v: Web3 | undefined) {
    if (_st) {
        nextTick(() => {
            _st[1](v)
        })
    }
}

export default function useWeb3(): [Web3 | undefined, Dispatch<SetStateAction<Web3 | undefined>>] {
    _st = useState()
    return _st;
}