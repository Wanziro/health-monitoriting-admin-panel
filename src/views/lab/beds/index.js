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
import Edit from './edit'

const initialState = {
  bedNumber: '',
  departmentId: '',
}

const Users = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.user)
  const { isLoading } = useSelector((state) => state.app)
  const [editItem, setEditItem] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [state, setState] = useState(initialState)

  const [isLoading2, setIsLoading2] = useState(false)
  const [usersList, setUsersList] = useState([])
  const [departments, setDepartments] = useState([])

  const changeHandler = (e) => {
    setState({ ...state, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (state.bedNumber.trim() === '' || state.departmentId.trim() === '') {
      toastMessage('error', 'All fields on the form are required')
    } else {
      dispatch(setShowFullPageLoader(true))
      Axios.post(BACKEND_URL + '/beds/', {
        ...state,
        token,
      })
        .then((res) => {
          dispatch(setShowFullPageLoader(false))
          setState(initialState)
          toastMessage('success', res.data.msg)
          setUsersList([...usersList, res.data.bed])
        })
        .catch((error) => {
          errorHandler(error)
          dispatch(setShowFullPageLoader(false))
        })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
      setIsLoading2(true)
      const res = await Axios.get(BACKEND_URL + '/beds/?token=' + token)
      setTimeout(() => {
        setIsLoading2(false)
        setUsersList(res.data.beds)
      }, 1000)
    } catch (error) {
      setTimeout(() => {
        setIsLoading2(false)
        errorHandler(error)
      }, 1000)
    }
  }

  const handleDelete = (id) => {
    dispatch(setShowFullPageLoader(true))
    Axios.delete(BACKEND_URL + '/beds/' + id + '/?token=' + token)
      .then((res) => {
        setTimeout(() => {
          dispatch(setShowFullPageLoader(false))
          toastMessage('success', res.data.msg)
          fetchUsers()
        }, 1000)
      })
      .catch((error) => {
        setTimeout(() => {
          errorHandler(error)
          dispatch(setShowFullPageLoader(false))
        }, 1000)
      })
  }

  const getDepName = (id) => {
    const dep = departments.find((item) => item._id == id)
    if (dep) {
      return dep.name
    }
    return ''
  }

  return (
    <>
      <CRow>
        <CCol md={9}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Beds Management</strong>
            </CCardHeader>
            <CCardBody>
              {isLoading2 ? (
                <PlaceHolder />
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Department Name</th>
                        <th>Bed Number</th>
                        <th>Add date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{getDepName(item.departmentId)}</td>
                          <td>{item.bedNumber}</td>
                          <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                          <td>
                            <span
                              className="text-primary"
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                setEditItem(item)
                                setShowEditModal(true)
                              }}
                            >
                              <CIcon icon={cilPen} />
                              Edit
                            </span>
                            &nbsp; &nbsp;
                            <span
                              className="text-danger"
                              style={{ cursor: 'pointer' }}
                              onClick={() =>
                                confirm('Do you want to delete this user?')
                                  ? handleDelete(item._id)
                                  : null
                              }
                            >
                              <CIcon icon={cilTrash} />
                              Delete
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <form onSubmit={handleSubmit}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Add New Bed</strong>
              </CCardHeader>
              <CCardBody>
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
                  >
                    <option value="">Select type</option>
                    {departments.map((i, index) => (
                      <option key={index} value={i._id}>
                        {i.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CCardBody>
              <CCardFooter>
                <button type="submit" className="btn btn-primary">
                  Save Bed
                </button>
              </CCardFooter>
            </CCard>
          </form>
        </CCol>
      </CRow>
      <Edit
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        editItem={editItem}
        fetchData={fetchBeds}
        token={token}
        departments={departments}
      />
      <FullPageLoader isLoading={isLoading} />
    </>
  )
}

export default Users
