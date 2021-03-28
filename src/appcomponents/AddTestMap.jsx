import React, { useState, useContext } from "react"
import * as Yup from "yup"
import { Formik, Form, Field } from "formik"
import { useHistory, useParams } from "react-router-dom"


import React, { useState } from "react";
   
   
function AddTestMap() {

      return (
          <React.Fragment>
              <div className="container">
                  <Formik
                    initialValues={{
                        id:"",
                        entryid:""
                    }}
                    validationSchema={Yup.object().shape({
                        id: Yup.string().required("id required"),
                        entryid: Yup.string().required("Entry id required")
                    })}
                  >

                  </Formik>
              </div>
     
           </React.Fragment>
       );
}
  
  
export default AddTestMap