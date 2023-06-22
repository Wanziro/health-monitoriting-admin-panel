import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { resetApp } from '../../../actions/app'
import { resetUser } from '../../../actions/user'

function Logout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(resetUser())
    dispatch(resetApp())
    navigate('/')
  }, [])
  return null
}

export default Logout
