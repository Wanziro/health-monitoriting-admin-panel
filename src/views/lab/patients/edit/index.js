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
  departmentId: '',
  bedId: '',
  names: '',
  ages: '',
  height: '',
  weight: '',
  sex: '',
  medication: '',
  medicalHistory: '',
  email: '',
}
function Edit({ showModal, setShowModal, editItem, token, fetchData, departments, beds }) {
  const [state, setState] = useState(initialState)
  const [submitting, setSubmitting] = useState(false)
  const [bedsList, setBedsList] = useState([])
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)
    Axios.put(BACKEND_URL + '/patients/', {
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

  useEffect(() => {
    setBedsList(beds.filter((item) => item.departmentId === state.departmentId))
  }, [state.departmentId])

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
              <label>Department </label>
              <select
                name="departmentId"
                value={state.departmentId}
                onChange={changeHandler}
                required
                className="form-control"
              >
                <option value="">Select type</option>
                {departments.map((i, index) => (
                  <option key={index} value={i._id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label>Bed Number </label>
              <select
                name="bedId"
                value={state.bedId}
                onChange={changeHandler}
                required
                className="form-control"
              >
                <option value="">Select Bed</option>
                {bedsList.map((i, index) => (
                  <option key={index} value={i._id}>
                    {i.bedNumber}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label>Patient Names</label>
              <input
                type="text"
                className="form-control"
                placeholder="Patient names"
                name="names"
                value={state.names}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label>Ages</label>
              <input
                type="number"
                className="form-control"
                placeholder="Patient ages"
                name="ages"
                value={state.ages}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label>Height</label>
              <input
                type="number"
                className="form-control"
                placeholder="Patient Height"
                name="height"
                value={state.height}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label>Weight</label>
              <input
                type="number"
                className="form-control"
                placeholder="Patient Weight"
                name="weight"
                value={state.weight}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label>Sex </label>
              <select
                name="sex"
                value={state.sex}
                onChange={changeHandler}
                required
                className="form-control"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Patient email address"
                name="email"
                value={state.email}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label>Medication</label>
              <input
                type="text"
                className="form-control"
                placeholder="Medication"
                name="medication"
                value={state.medication}
                onChange={changeHandler}
                required
              />
            </div>
            <div className="mb-3">
              <label>Medical History</label>
              <input
                type="text"
                className="form-control"
                placeholder="Medical History"
                name="medicalHistory"
                value={state.medicalHistory}
                onChange={changeHandler}
                required
              />
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
