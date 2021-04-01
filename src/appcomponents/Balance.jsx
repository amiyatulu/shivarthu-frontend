import React, { useState, useEffect } from "react"
import { useSubstrate } from "./../substrate-lib"
import { bnToBn } from "@polkadot/util"

function Balance({ accountPair = null }) {
  const { api } = useSubstrate()
  const [balance, setBalance] = useState(null)
  useEffect(() => {
    async function callbalance() {
      if (accountPair) {
        console.log(accountPair)   
        const account = await api.query.system.account(accountPair.address)
        setBalance(account.data.free.toHuman())
        const dm = bnToBn(account.data.free)
        console.log(dm.toString())
      }

      //
      //
    }
    callbalance()
  }, [api, accountPair])
  return <React.Fragment>{balance}</React.Fragment>
}

export default Balance
