import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBarChart,
  cilBed,
  cilBell,
  cilBellExclamation,
  cilGraph,
  cilPencil,
  cilPeople,
  cilSpeedometer,
  cilUser,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Instructions',
    to: '/instructions',
    icon: <CIcon icon={cilBellExclamation} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'System users',
    to: '/users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Departments',
    to: '/departments',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All',
        to: '/departments',
      },
    ],
  },
  {
    component: CNavItem,
    name: 'Bed Management',
    to: '/beds',
    icon: <CIcon icon={cilBed} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: 'Patients',
    to: '/patients',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'View All',
        to: '/patients',
      },
      {
        component: CNavItem,
        name: 'Add New',
        to: '/addpatient',
      },
    ],
  },
]

export default _nav
