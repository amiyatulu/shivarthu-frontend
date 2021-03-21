import React, { useState } from "react"
import CreateDepartmentButton from "./CreateDepartmentButton"
import { useSubstrate } from "./../substrate-lib"

function CreateDepartmentForm() {
  const [accountAddress, setAccountAddress] = useState(
    "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY"
  )
  const { keyring, keyringState } = useSubstrate()
  const [status, setStatus] = useState("Hello")
  const accountPair =
    accountAddress &&
    keyringState === "READY" &&
    keyring.getPair(accountAddress)
  return (
    <React.Fragment>
      <div className="container">
        <div>{status}</div>
        <div>
          <CreateDepartmentButton
            accountPair={accountPair}
            setStatus={setStatus}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

export default CreateDepartmentForm
