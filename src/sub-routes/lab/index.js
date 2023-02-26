import React, { lazy } from 'react'

const Dashboard = lazy(() => import('../../views/dashboard'))

// Notifications
// const Notifications = lazy(() => import("../../views/notifications"));
const Profile = lazy(() => import('../../views/profile'))
const Users = lazy(() => import('../../views/lab/users'))
const Departments = lazy(() => import('../../views/lab/departments'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/users', name: 'Users', element: Users },
  { path: '/departments', name: 'departments', element: Departments },
  // {
  //   path: '/notifications',
  //   name: 'Notifications',
  //   element: Notifications,
  //   exact: true,
  // },
]

export default routes
