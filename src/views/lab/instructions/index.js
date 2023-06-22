import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

const Instructions = () => {
  return (
    <>
      <CRow>
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Instructions</strong>
            </CCardHeader>
            <CCardBody>
              <h2>The system has the following functions:</h2>
              <p>
                Department management, hospital bed management, patient management, account
                management, system management (PC terminal) <b>Health monitoring:</b> Android
                terminal, patient information,
              </p>
              <p>
                <b>Department management:</b> maintenance of departments, such as adding, modifying,
                deleting, and displaying Departments are divided into two types, internal
                departments and external departments. The internal department is the department that
                actually exists in the hospital. There is only one external department. If the blood
                glucose monitoring equipment is sold and the patient is added, the designated
                department is the external department.
              </p>
              <p>
                <b>Hospital bed management:</b> manage the hospital beds under the department, such
                as adding, modifying, deleting and displaying The hospital bed belongs to a certain
                department <b>Patient management:</b> patient maintenance, addition, modification,
                display A patient belongs to a certain department, but does not necessarily have a
                hospital bed. For example, if a blood glucose monitoring device is sold, the user
                needs to be added as a patient. At this time, the patient's department is an
                external department, and the bed number is empty.
                <b>Account management:</b> management of users who can log in to the system. There
                are two types of accounts, hospital accounts and external accounts. The hospital
                account is for people inside the hospital to log in, and the external account is for
                people who have purchased blood glucose monitoring equipment to log in to the
                system. System management: general role management and authority management
              </p>
              <p>
                <b>Health monitoring:</b> detection of blood sugar in patients <br />
                <b>Patient information</b>: display the patient's basic information, age, height,
                weight, medical history, medication, blood sugar testing data in the past 7 days, 14
                days, and 30 days
              </p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Instructions
