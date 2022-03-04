import React from "react";
import { useCall, ContractCall, CallResult } from "@usedapp/core";
import { ethers } from "ethers";
import Tokes from '../abis/Tokes.json';

function useTokesBalance(
  user: string,
) {
  // @ts-ignore
  const {value, error}: CallResult | undefined[] = useCall({
      contract: new ethers.Contract(
        "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        new ethers.utils.Interface(Tokes.abi)
      ),
      method: "balanceOf",
      args: [user],
    }
  ) ?? {}
    if(error) {
      console.log(error.message)
      return undefined;
    }
    console.log("test")
  console.log(value)
  return value?.[0];
}

export default useTokesBalance;
