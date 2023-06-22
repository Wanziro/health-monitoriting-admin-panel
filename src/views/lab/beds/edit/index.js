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
import { BACKEND_URL } from '../../../../constants'
import { errorHandler, toastMessage } from '../../../../helpers'

const initialState = {
  bedNumber: '',
  departmentId: '',
}
function Edit({ showModal, setShowModal, editItem, token, fetchData, departments }) {
  const [state, setState] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    Axios.put(BACKEND_URL + '/beds/', {
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
              <label>Bed Number</label>
              <input
                type="number"
                className="form-control"
                placeholder="Department names"
                name="bedNumber"
                value={state.bedNumber}
                onChange={changeHandler}
                required
                disabled={submitting}
              />
            </div>
            <div className="mb-3">
              <label>Department </label>
              <select
                name="departmentId"
                value={state.departmentId}
                onChange={changeHandler}
                required
                className="form-control"
                disabled={submitting}
              >
                <option value="">Select type</option>
                {departments.map((i, index) => (
                  <option key={index} value={i._id}>
                    {i.name}
                  </option>
                ))}
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
