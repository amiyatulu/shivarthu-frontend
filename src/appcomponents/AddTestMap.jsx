import React, { useState, useContext } from "react"
import * as Yup from "yup"
import { Formik, Form, Field } from "formik"
import { useHistory, useParams } from "react-router-dom"
import ipfs from "../commons/ipfs"
import { SubContext } from "../commons/context/SubContext"
import { FocusError, SubmittingWheel } from "../commons/FocusWheel"
import Balance from "./Balance"
import { useSubstrate } from "./../substrate-lib"
import getFromAcct from "./GetFromAccount"

function AddTestMap(props) {
  // const [count, setCount] = useState(0);
  // const { id } = useParams()
  let history = useHistory()
  const { accountPair } = useContext(SubContext)
  const [status, setStatus] = useState("Hello")
  const [errorThrow, setErrorThrow] = useState(false)
  const [eventstatus, setEventStatus] = useState()

  const { api } = useSubstrate()

  const txResHandler = (status, events, setSubmitting) => {
    setSubmitting(true)
    if (status.isFinalized) {
      setStatus(`😉 Finalized. Block hash: ${status.asFinalized.toString()}`)
      setSubmitting(false)
    } else setStatus(`Current transaction status: ${status.type}`)
    setEventStatus("")

    if (status.isInBlock || status.isFinalized) {
      events
        // find/filter for failed events
        .filter(({ event }) => api.events.system.ExtrinsicFailed.is(event))
        // we know that data for system.ExtrinsicFailed is
        // (DispatchError, DispatchInfo)
        .forEach(
          ({
            event: {
              data: [error, info],
            },
          }) => {
            if (error.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded = api.registry.findMetaError(error.asModule)
              const { documentation, method, section } = decoded

              console.log(`${section}.${method}: ${documentation.join(" ")}`)
              setEventStatus(method)
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              console.log(error.toString())
              setEventStatus(error.toString())
            }
          }
        )
    }
  }

  const txErrHandler = (err) =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`)

  return (
    <React.Fragment>
      <div className="container">
        <Formik
          initialValues={{
            id: "",
            entryid: "",
          }}
          validationSchema={Yup.object().shape({
            id: Yup.number().required("id is required"),
            entryid: Yup.number().required("entryid is required"),
          })}
          onSubmit={async (values, actions) => {
            try {
              //   values.countvariable = count
              //   const data = await nearvar.contract. ...
              const opts = [values.id, values.entryid]
              const fromAcct = await getFromAcct(accountPair, api)

              // const opts = ['Education', 'Bhadrak', 'whatapp']

              const txExecute = api.tx.templateModule.addTestMap(...opts)
              setStatus("Sending...")

              const unsub = await txExecute
                .signAndSend(fromAcct, ({ status, events }) => {
                  txResHandler(status, events, actions.setSubmitting)
                })
                .catch(txErrHandler)

              //   await transaction(opts)

              // console.log(data)
              // history.push(`/thankyou${data.mutationoutputname}`)
              // history.goBack()
            } catch (e) {
              console.error(e)
              setErrorThrow(e.message)
            }
          }}
        >
          {({
            handleSubmit,
            handleBlur,
            handleChange,
            errors,
            touched,
            isValid,
            isSubmitting,
            values,
            setFieldValue,
            validateForm,
          }) => (
            <Form onSubmit={handleSubmit}>
              <p>{status}</p>
              <p>{eventstatus}</p>
              {errorThrow && <p>{errorThrow}</p>}

              <div className="form-group">
                <label htmlFor="id">id</label>
                {touched.id && errors.id && (
                  <p className="alert alert-danger">{errors.id}</p>
                )}

                <Field name="id" className="form-control" />
              </div>

              <div className="form-group">
                <label htmlFor="entryid">entryid</label>
                {touched.entryid && errors.entryid && (
                  <p className="alert alert-danger">{errors.entryid}</p>
                )}

                <Field name="entryid" className="form-control" />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  Submit Form
                </button>
              </div>
              <SubmittingWheel isSubmitting={isSubmitting} />
              <FocusError />
              <div>
                <Balance accountPair={accountPair} />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </React.Fragment>
  )
}

export default AddTestMap
