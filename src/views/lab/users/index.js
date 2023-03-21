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
  const [email, setEmail] = useState('')
  const [isLoading2, setIsLoading2] = useState(false)
  const [usersList, setUsersList] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (fullName.trim() === '' || phone.trim() === '' || userRole.trim() === '') {
      toastMessage('error', 'All fields on the form are required')
    } else {
      dispatch(setShowFullPageLoader(true))
      Axios.post(BACKEND_URL + '/users/register/', {
        fullName,
        email,
        phone,
        password: '12345',
        role: userRole,
        token,
      })
        .then((res) => {
          dispatch(setShowFullPageLoader(false))
          setFullName('')
          setEmail('')
          setphone('')
          setUserRole('')
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
  }, [])

  const fetchUsers = () => {
    setIsLoading2(true)
    Axios.get(BACKEND_URL + '/users/?token=' + token)
      .then((res) => {
        setTimeout(() => {
          setIsLoading2(false)
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

  return (
    <>
      <CRow>
        <CCol md={8}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>System Users</strong>
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
                        <th>Names</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.fullName}</td>
                          <td>{item.phone}</td>
                          <td>{item.email}</td>
                          <td>{item.role}</td>
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
                  <label>Email (optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="User's Email address"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
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
