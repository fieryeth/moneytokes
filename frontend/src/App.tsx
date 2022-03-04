import React, {useState} from 'react';
import './App.css';
import {Button, ButtonGroup, CircularProgress} from "@mui/material";
import {ethers} from "ethers";
import {ChainId, useEthers} from "@usedapp/core";
import TokesBalance from "./components/TokesBalance";
import TokesInfo from "./components/TokesInfo";
import { Box } from '@mui/material';

const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};

const getChainName = (chainId: ChainId | undefined) => {
  if (chainId === ChainId.Mainnet) {
    return "Ethereum"
  } else if(chainId === ChainId.Hardhat) {
    return "Localhost";
  } else {
    return "Unknown Network";
  }
}

function App() {
  const {activateBrowserWallet, account, chainId} = useEthers();
  const [numberOfTokes, setNumberOfTokes] = useState(0);

  const handleStopLooking = (_numberOfTokes: number) => {
    setNumberOfTokes(_numberOfTokes)
  }

  return (
    <div className="App">
      {!account ? (
        <div style={{marginTop: "300px"}}>
          <p style={{fontSize: "30px", fontWeight: "lighter"}}>
            Please connect to your Web3 wallet
          </p>
          <Button variant="outlined" onClick={() => activateBrowserWallet()}>
            Connect Wallet
          </Button>
        </div>
      ) : (
        <div style={{marginTop: "100px"}}>
          <p style={{fontSize: "40px", fontWeight: "lighter"}}>
            Welcome, {shortenAddress(account)}
          </p>
          <TokesBalance
            user={ethers.utils.getAddress(account)}
            stopLooking={handleStopLooking}
            chainName={getChainName(chainId)}
          />
          {numberOfTokes > 0 ? (
            <Box sx={tokesStyle}>
              {[...Array(numberOfTokes).keys()].map((id => (<TokesInfo
                key={id}
                user={ethers.utils.getAddress(account)}
                tokeId={id} />)))}
            </Box>
          ) : (
            <></>
          )}
        </div>
      )}
    </div>
  );
}

const tokesStyle = {
  display: "flex",
  justifyContent: "space-evenly",
  flexWrap: "wrap",
  width: "60%",
  margin: "auto",
  marginTop: "5rem"
}

export default App;
