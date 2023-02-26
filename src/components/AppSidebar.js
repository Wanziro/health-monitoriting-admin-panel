import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
import labNav from '../navs/lab-navigations/'
import { setShowSideBar, setUnfoldableSideBar } from 'src/actions/app'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const { sidebarShow, unfoldable } = useSelector((state) => state.app)
  const { role } = useSelector((state) => state.user)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch(setShowSideBar(visible))
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        H.M.S
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>{role === 'admin' && <AppSidebarNav items={labNav} />}</SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch(setUnfoldableSideBar(!unfoldable))}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
