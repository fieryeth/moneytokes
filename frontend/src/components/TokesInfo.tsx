import React, {useEffect} from "react";
import {Box, Button, CircularProgress} from "@mui/material";
import {ethers} from "ethers"
import useTokesInfo from "../hooks/useTokesInfo";
import Expiration from "./Expiration";

interface ITokesInfo {
  user: string;
  tokeId: number;
}

const TokesInfo = (props: ITokesInfo) => {
  const tokeInfo = useTokesInfo(props.user, props.tokeId);

  return (
    <div>
      {!tokeInfo ? (
        <div>
          <CircularProgress size="100px" color="warning" style={{marginTop: "80px"}} />
        </div>
      ) : (
        <Box sx={tokeStyle}>
          {tokeInfo[1][2].toString() === ethers.constants.AddressZero ? (
            <div>
              <p style={{fontSize: "30px", fontWeight: "bold"}}>ETH</p>
              <p style={{fontSize: "50px", fontWeight: "lighter", marginBottom: "20px"}}>
                {tokeInfo && ethers.utils.formatEther(tokeInfo[1][0])}
              </p>
            </div>
          ) : (
            <p>Not Ether</p>
          )}
          <Expiration timestamp={parseInt(tokeInfo[1][1].toString())} />
          <Box sx={{display: "flex", width: "15rem", justifyContent: "space-evenly"}}>
            <Button variant="outlined">Claim</Button>
            <Button variant="outlined">Send</Button>
          </Box>
        </Box>
      )}
    </div>
  )
}

const tokeStyle = {
  border: "solid black 3px",
  backgroundColor: "#FDD9A9",
  borderRadius: "25px",
  paddingLeft: "1rem",
  paddingRight: "1rem",
  paddingBottom: "1rem"
}

export default TokesInfo;
