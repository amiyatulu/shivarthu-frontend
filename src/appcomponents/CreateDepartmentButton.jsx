import React, { useState } from "react"
import { useSubstrate } from "./../substrate-lib"
import getFromAcct from "./GetFromAccount"

function CreateDepartmentButton({
  accountPair = null,
  setStatus
}) {
  const { api } = useSubstrate()

  const txResHandler = ({ status }) =>
    status.isFinalized
      ? setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
      : setStatus(`Current transaction status: ${status.type}`)

  const txErrHandler = (err) =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`)



  const signedTx = async () => {
    const fromAcct = await getFromAcct(accountPair)

    const opts = ['Education', 'Bhadrak', 'whatapp']

    const txExecute = api.tx.templateModule.createDeparment(...opts)

    const unsub = await txExecute
      .signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler)
  }

  const transaction = async () => {
    setStatus("Sending...")
    signedTx()
  }

  return (
    <React.Fragment>
      <button
        type="button"
        className="btn btn-primary"
        type="submit"
        onClick={transaction}
      >
        Create Department
      </button>
    </React.Fragment>
  )
}

export default CreateDepartmentButton
