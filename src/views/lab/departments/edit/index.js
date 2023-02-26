import {
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { BACKEND_URL } from 'src/constants'
import { errorHandler, toastMessage } from 'src/helpers'

const initialState = {
  name: '',
  numberOfBeds: '',
  type: '',
}
function Edit({ showModal, setShowModal, editItem, token, fetchData }) {
  const [state, setState] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    Axios.put(BACKEND_URL + '/departments/', {
      ...state,
      token,
    })
      .then((res) => {
        setTimeout(() => {
          toastMessage('success', res.data.msg)
          setSubmitting(false)
          setShowModal(false)
          fetchData()
        }, 1000)
      })
      .catch((error) => {
        setSubmitting(false)
        errorHandler(error)
      })
  }

  useEffect(() => {
    if (showModal) {
      editItem && setState({ ...editItem })
    } else {
      setState(initialState)
    }
  }, [showModal])

  const changeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }
  return (
    <>
      <CModal backdrop="static" visible={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit}>
          <CModalHeader>
            <CModalTitle>Edit department</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Department names"
                name="name"
                value={state.name}
                onChange={changeHandler}
                disabled={submitting}
                required
              />
            </div>
            <div className="mb-3">
              <label>Number Of Beds</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter number of beds"
                required
                name="numberOfBeds"
                value={state.numberOfBeds}
                onChange={changeHandler}
                disabled={submitting}
              />
            </div>
            <div className="mb-3">
              <label>Department Type</label>
              <select
                name="type"
                value={state.type}
                onChange={changeHandler}
                required
                disabled={submitting}
                className="form-control"
              >
                <option value="">Select type</option>
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select>
            </div>
          </CModalBody>
          <CModalFooter>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting && <CSpinner size="sm" />} Submit
            </button>
          </CModalFooter>
        </form>
      </CModal>
    </>
  )
}

export default Edit
