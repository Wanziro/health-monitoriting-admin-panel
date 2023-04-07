import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardFooter, CCardHeader, CCol, CRow } from '@coreui/react'
import Axios from 'axios'
import { errorHandler, toastMessage } from 'src/helpers'
import { BACKEND_URL } from 'src/constants'
import { useDispatch, useSelector } from 'react-redux'
import { setShowFullPageLoader } from 'src/actions/app'
import PlaceHolder from 'src/components/placeholder'
import CIcon from '@coreui/icons-react'
import { cilTrash } from '@coreui/icons'
import FullPageLoader from 'src/components/full-page-loader'

const Users = () => {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.user)
  const { isLoading } = useSelector((state) => state.app)
  const [userRole, setUserRole] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setphone] = useState('')
  const [departmentId, setDepartmentId] = useState('')
  const [isLoading2, setIsLoading2] = useState(false)
  const [allUsersList, setAllUsersList] = useState([])
  const [usersList, setUsersList] = useState([])
  const [departments, setDepartments] = useState([])
  const [keyword, setKeyword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (fullName.trim() === '' || phone.trim() === '' || userRole.trim() === '') {
      toastMessage('error', 'All fields on the form are required')
    } else {
      dispatch(setShowFullPageLoader(true))
      Axios.post(BACKEND_URL + '/users/register/', {
        fullName,
        phone: phone.trim(),
        departmentId,
        password: '12345',
        role: userRole,
        token,
      })
        .then((res) => {
          dispatch(setShowFullPageLoader(false))
          setFullName('')
          setphone('')
          setUserRole('')
          setDepartmentId()
          toastMessage('success', res.data.msg)
          setUsersList([...usersList, res.data.user])
        })
        .catch((error) => {
          errorHandler(error)
          dispatch(setShowFullPageLoader(false))
        })
    }
  }

  useEffect(() => {
    fetchUsers()
    fetDepartments()
  }, [])

  const fetDepartments = () => {
    Axios.get(BACKEND_URL + '/departments/?token=' + token)
      .then((res) => {
        setDepartments(res.data.departments)
      })
      .catch((error) => {
        setTimeout(() => {
          errorHandler(error)
        }, 1000)
      })
  }

  const fetchUsers = () => {
    setIsLoading2(true)
    Axios.get(BACKEND_URL + '/users/?token=' + token)
      .then((res) => {
        setTimeout(() => {
          setIsLoading2(false)
          setAllUsersList(res.data.users)
          setUsersList(res.data.users)
        }, 1000)
      })
      .catch((error) => {
        setTimeout(() => {
          setIsLoading2(false)
          errorHandler(error)
        }, 1000)
      })
  }

  const handleDelete = (id) => {
    dispatch(setShowFullPageLoader(true))
    Axios.delete(BACKEND_URL + '/users/' + id + '/?token=' + token)
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

  useEffect(() => {
    if (keyword.trim().length === 0) {
      setUsersList(allUsersList)
    } else {
      const res = allUsersList.filter(
        (item) =>
          item.departmentId === keyword || item.phone.toLowerCase().includes(keyword.toLowerCase()),
      )
      setUsersList(res)
    }
  }, [keyword])

  return (
    <>
      <CRow>
        <CCol md={8}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <strong>Account Management</strong>{' '}
                <div>
                  <table>
                    <tr>
                      <td>
                        <input
                          onChange={(e) => setKeyword(e.target.value)}
                          className="form-control"
                          placeholder="Search by phone"
                        />
                      </td>
                      <td>&nbsp;&nbsp;</td>
                      <td>
                        <select
                          name="departmentId"
                          value={departmentId}
                          onChange={(e) => setKeyword(e.target.value)}
                          required
                          className="form-select"
                        >
                          <option value="">Department</option>
                          {departments.map((item, index) => (
                            <option value={item._id}>{item.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
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
                        <th>Phone</th>
                        <th>Names</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.phone}</td>
                          <td>{item.fullName}</td>
                          <td>{item.role}</td>
                          <td>{getDepName(item.departmentId)}</td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                confirm('Do you want to delete this user?')
                                  ? handleDelete(item._id)
                                  : null
                              }
                            >
                              <CIcon icon={cilTrash} />
                            </button>
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
        <CCol md={4}>
          <form onSubmit={handleSubmit}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Register New User</strong>
              </CCardHeader>
              <CCardBody>
                <div className="mb-3">
                  <label>Full Names</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="User's full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Phone Number</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="User's Phone Number"
                    required
                    name="phone"
                    value={phone}
                    onChange={(e) => setphone(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label>Binding Departments</label>
                  <select
                    name="departmentId"
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    required
                    className="form-control"
                  >
                    <option value="">Select Department</option>
                    {departments.map((item, index) => (
                      <option value={item._id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>Role</label>
                  <select
                    name="role"
                    value={userRole}
                    onChange={(e) => setUserRole(e.target.value)}
                    required
                    className="form-control"
                  >
                    <option value="">Select role</option>
                    <option value="user">User</option>
                    <option value="nurse">Nurse</option>
                  </select>
                </div>
                <small>
                  <i>
                    <b>
                      NB: Default password for each new user is 12345. New users are advised to
                      change their password immediately.
                    </b>
                  </i>
                </small>
              </CCardBody>
              <CCardFooter>
                <button type="submit" className="btn btn-primary">
                  Save user
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

export default Users
