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
import { useNavigate } from 'react-router-dom'
import ReactPaginate from 'react-paginate'

const initialState = {
  bedNumber: '',
  departmentId: '',
}

const Users = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.user)
  const { isLoading } = useSelector((state) => state.app)
  const [editItem, setEditItem] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [state, setState] = useState(initialState)
  const [beds, setBeds] = useState([])

  const [isLoading2, setIsLoading2] = useState(false)
  const [usersList, setUsersList] = useState([])
  const [allUsersList, setAllUsersList] = useState([])
  const [departments, setDepartments] = useState([])
  const [keyword, setKeyword] = useState('')

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
          setAllUsersList([...usersList, res.data.bed])
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
    await fetPatients()
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

  const fetPatients = async () => {
    try {
      setIsLoading2(true)
      const res = await Axios.get(BACKEND_URL + '/patients/?token=' + token)
      setTimeout(() => {
        setIsLoading2(false)
        setUsersList(res.data.patients)
        setAllUsersList(res.data.patients)
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
    Axios.delete(BACKEND_URL + '/patients/' + id + '/?token=' + token)
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

  const getBedNumber = (id) => {
    const dep = beds.find((item) => item._id == id)
    if (dep) {
      return dep.bedNumber
    }
    return ''
  }

  useEffect(() => {
    if (keyword.trim().length === 0) {
      setUsersList(allUsersList)
    } else {
      const res = allUsersList.filter(
        (item) =>
          item.names.toLowerCase().includes(keyword.toLowerCase()) ||
          item.createdAt.toLowerCase().includes(keyword.toLowerCase()),
      )
      setUsersList(res)
    }
  }, [keyword])

  // pagination
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [itemOffset, setItemOffset] = useState(0)
  const endOffset = itemOffset + itemsPerPage
  console.log(`Loading items from ${itemOffset} to ${endOffset}`)
  const currentItems = usersList.slice(itemOffset, endOffset)
  const pageCount = Math.ceil(usersList.length / itemsPerPage)

  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % usersList.length
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`)
    setItemOffset(newOffset)
  }

  return (
    <>
      <CRow>
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <div className="d-flex justify-content-between">
                <div>
                  <strong>Patients Management</strong>
                </div>
                <div>
                  <table>
                    <tr>
                      <td>
                        <input
                          onChange={(e) => setKeyword(e.target.value)}
                          className="form-control"
                          placeholder="Search by name, date"
                        />
                      </td>
                      <td>&nbsp;&nbsp;</td>
                      <td>
                        <button className="btn btn-primary" onClick={() => navigate('/addpatient')}>
                          Add Patient
                        </button>
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
                        <th>Name</th>
                        <th>Department Name</th>
                        <th>Bed Number</th>
                        <th>Height</th>
                        <th>Weight</th>
                        <th>Sex</th>
                        <th>Age</th>
                        <th>Add date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item.names}</td>
                          <td>{getDepName(item.departmentId)}</td>
                          <td>{getBedNumber(item.bedId)}</td>
                          <td>{item.height}</td>
                          <td>{item.weight}</td>
                          <td>{item.sex}</td>
                          <td>{item.ages}</td>
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
                  <div className="pagination-main-container">
                    <div>
                      <select
                        className="form-select"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(e.target.value)}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={40}>40</option>
                        <option value={50}>50</option>
                      </select>
                    </div>
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel=">"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel="<"
                      renderOnZeroPageCount={null}
                      containerClassName="paginationContainer"
                      pageClassName="pageClassName"
                      activeClassName="activeClassName"
                      previousClassName="previousClassName"
                      nextClassName="previousClassName"
                      disabledLinkClassName="disabledLinkClassName"
                    />
                  </div>
                </div>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <Edit
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        editItem={editItem}
        fetchData={fetPatients}
        token={token}
        departments={departments}
        beds={beds}
      />
      <FullPageLoader isLoading={isLoading} />
    </>
  )
}

export default Users
