import React, {useEffect} from "react";
import useTokesBalance from "../hooks/useTokesBalance";
import {CircularProgress} from "@mui/material";

interface ITokesInfo {
  user: string;
  stopLooking: (numberOfTokes: number) => void;
  chainName: string;
}

const TokesBalance = (props: ITokesInfo) => {
  const numberOfTokes = useTokesBalance(props.user);

  useEffect(() => {
    if(numberOfTokes) {
      props.stopLooking(numberOfTokes.toNumber());
    }
  }, [numberOfTokes])

  return (
    <div>
      {!numberOfTokes ? (
        <div>
          <p style={{fontSize: "30px", fontWeight: "lighter"}}>Checking for Tokes...</p>
          <CircularProgress size="100px" color="warning" style={{marginTop: "80px"}} />
        </div>
      ) : (
        <div>
          <p style={{fontSize: "30px", fontWeight: "lighter"}}>
            You have {numberOfTokes && numberOfTokes.toNumber()} tokes on {props.chainName}.
          </p>
          {numberOfTokes.toNumber() === 0 && <p style={{fontSize: "30px", fontWeight: "lighter"}}>Create one ;)</p>}
        </div>
      )}
    </div>
  )
}

export default TokesBalance;
