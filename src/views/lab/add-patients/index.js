import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react'
import Axios from 'axios'
import { errorHandler, toastMessage } from 'src/helpers'
import { BACKEND_URL } from 'src/constants'
import { useDispatch, useSelector } from 'react-redux'
import { setShowFullPageLoader } from 'src/actions/app'
import PlaceHolder from 'src/components/placeholder'
import CIcon from '@coreui/icons-react'
import { cilPen, cilTrash } from '@coreui/icons'
import FullPageLoader from 'src/components/full-page-loader'

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

const AddPatients = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.user)
  const { isLoading } = useSelector((state) => state.app)
  const [state, setState] = useState(initialState)

  const [beds, setBeds] = useState([])
  const [bedsList, setBedsList] = useState([])
  const [departments, setDepartments] = useState([])

  const changeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (state.bedId.trim() === '' || state.departmentId.trim() === '') {
      toastMessage('error', 'All fields on the form are required')
    } else {
      dispatch(setShowFullPageLoader(true))
      Axios.post(BACKEND_URL + '/patients/', {
        ...state,
        token,
      })
        .then((res) => {
          setTimeout(() => {
            dispatch(setShowFullPageLoader(false))
            setState(initialState)
            toastMessage('success', res.data.msg)
          }, 1000)
        })
        .catch((error) => {
          setTimeout(() => {
            errorHandler(error)
            dispatch(setShowFullPageLoader(false))
          }, 1000)
        })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    setBedsList(beds.filter((item) => item.departmentId === state.departmentId))
  }, [state.departmentId])

  const fetchDepartments = async () => {
    dispatch(setShowFullPageLoader(true))
    try {
      const res = await Axios.get(BACKEND_URL + '/departments/?token=' + token)
      setTimeout(() => {
        dispatch(setShowFullPageLoader(false))
        setDepartments(res.data.departments)
      }, 1000)
    } catch (error) {
      setTimeout(() => {
        dispatch(setShowFullPageLoader(false))
        errorHandler(error)
      }, 1000)
    }
  }

  const fetchData = async () => {
    await fetchDepartments()
    await fetchBeds()
  }

  const fetchBeds = async () => {
    try {
      dispatch(setShowFullPageLoader(true))
      const res = await Axios.get(BACKEND_URL + '/beds/?token=' + token)
      setTimeout(() => {
        dispatch(setShowFullPageLoader(false))
        setBeds(res.data.beds)
      }, 1000)
    } catch (error) {
      setTimeout(() => {
        dispatch(setShowFullPageLoader(false))
        errorHandler(error)
      }, 1000)
    }
  }

  return (
    <>
      <CRow>
        <CCol md={12}>
          <form onSubmit={handleSubmit}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Add New Patient</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                  <CCol md={6}>
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
                  </CCol>
                </CRow>
              </CCardBody>
              <CCardFooter>
                <button type="submit" className="btn btn-primary">
                  Save Patient
                </button>
              </CCardFooter>
            </CCard>
          </form>
        </CCol>
      </CRow>
      <FullPageLoader isLoading={isLoading} />
    </>
  )
}

export default AddPatients
