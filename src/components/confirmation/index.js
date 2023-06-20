import { CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'
import React from 'react'

function Confirmation({ title, showModal, setShowModal, callback }) {
  return (
    <CModal backdrop="static" visible={showModal} onClose={() => setShowModal(false)} size="sm">
      <CModalHeader>
        <CModalTitle>Confirmation</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>{title}</p>
      </CModalBody>
      <CModalFooter>
        <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowModal(false)
            callback()
          }}
        >
          Confirm
        </button>
      </CModalFooter>
    </CModal>
  )
}

export default Confirmation
