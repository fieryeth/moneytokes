import React from 'react';
import './App.css';
import {Button, ButtonGroup, CircularProgress} from "@mui/material";
import {useEthers} from "@usedapp/core";

const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
    address.length
  )}`;
};

function App() {
  const {activateBrowserWallet, account} = useEthers();

  return (
    <div className="App">
      {!account ? (
        <div style={{marginTop: "300px"}}>
          <p style={{fontSize: "30px", fontWeight: "lighter"}}>Please connect to your Web3 wallet</p>
          <Button variant="outlined" onClick={() => activateBrowserWallet()}>Connect Wallet</Button>
        </div>
      ) : (
        <div style={{marginTop: "100px"}}>
          <p style={{fontSize: "40px", fontWeight: "lighter"}}>Welcome, {shortenAddress(account)}</p>
          <p style={{fontSize: "30px", fontWeight: "lighter"}}>Checking for Tokes...</p>
          <CircularProgress size="100px" color="warning" style={{marginTop: "80px"}} />
        </div>
      )}
    </div>
  );
}

export default App;
