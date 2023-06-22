import { CCard, CCardBody, CCol, CRow } from '@coreui/react'
import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import { BACKEND_URL } from '../../constants'
import { errorHandler } from '../../helpers'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const { token } = useSelector((state) => state.user)
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [beds, setBeds] = useState([])
  const [patients, setPatients] = useState([])

  const fetchUsers = () => {
    Axios.get(BACKEND_URL + '/users/?token=' + token)
      .then((res) => {
        setUsers(res.data.users)
      })
      .catch((error) => {
        errorHandler(error)
      })
  }

  const fetchDepartments = () => {
    Axios.get(BACKEND_URL + '/departments/?token=' + token)
      .then((res) => {
        setDepartments(res.data.departments)
      })
      .catch((error) => {
        errorHandler(error)
      })
  }

  const fetchBeds = async () => {
    try {
      const res = await Axios.get(BACKEND_URL + '/beds/?token=' + token)
      setBeds(res.data.beds)
    } catch (error) {
      errorHandler(error)
    }
  }

  const fetPatients = async () => {
    try {
      const res = await Axios.get(BACKEND_URL + '/patients/?token=' + token)
      setPatients(res.data.patients)
    } catch (error) {
      errorHandler(error)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetPatients()
    fetchDepartments()
    fetchBeds()
  }, [])

  return (
    <>
      <CRow>
        <CCol md={3}>
          <CCard className="mb-4 bg-primary">
            <CCardBody>
              <div className="text-center text-white">
                <h3>{users.length}</h3>
                <span>Users</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="mb-4 bg-info">
            <CCardBody>
              <div className="text-center text-white">
                <h3>{departments.length}</h3>
                <span>Departments</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="mb-4 bg-warning">
            <CCardBody>
              <div className="text-center text-white">
                <h3>{beds.length}</h3>
                <span>Beds</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={3}>
          <CCard className="mb-4 bg-secondary">
            <CCardBody>
              <div className="text-center text-white">
                <h3>{patients.length}</h3>
                <span>Patients</span>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
