import React, { useEffect, useState } from "react";

interface IExpiration {
  timestamp: number;
}

const Expiration = (props: IExpiration) => {
  const [timeDelta, setTimeDelta] = useState(0);

  useEffect(() => {
    if(props.timestamp !== 0) {
      setTimeDelta(
        new Date(props.timestamp).getTime() - ((new Date().getTime()) / 1000)
      )
      setInterval(() => setTimeDelta(new Date(props.timestamp).getTime() - ((new Date().getTime()) / 1000)), 1000)
    }
  }, [])

  return (
    <div style={{marginBottom: "15px", fontSize: "1.3rem"}}>
      {timeDelta < 0 ? <div>Expired</div> : (
        <div>
          {timeDelta === 0 ? (
            <div>No Expiry</div>
          ) : (
            <div>
              Expires in {new Date(timeDelta * 1000).toISOString().substr(11, 8)}
            </div>
          )}
        </div>
      )}
    </div>
    
  )
}

export default Expiration;