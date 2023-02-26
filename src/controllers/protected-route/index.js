import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user)
  return token && token.trim() !== 'admin' ? children : <Navigate to="/login" />
}

export default ProtectedRoute
