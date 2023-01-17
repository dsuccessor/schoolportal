import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AiOutlineProfile, AiFillSetting, AiOutlineTool } from 'react-icons/ai'
import { HiOutlineClipboardDocumentList } from 'react-icons/hi2'
import kcLogo from '../images/kcLogo.png'
import { FaSignOutAlt, FaHome, FaInfoCircle } from 'react-icons/fa'
import { GiTakeMyMoney, GiWallet } from 'react-icons/gi'
import { TfiWallet } from 'react-icons/tfi'
import { GiBank } from 'react-icons/gi'

function Layout({ children }) {
  const location = useLocation()
  const userSession = JSON.parse(localStorage.getItem('loginSession'))
  const activeUser = userSession?.checkIfExist

  const studentMenu = [
    {
      title: 'Home',
      path: '/',
      icon: <FaHome />,
    },
    {
      title: 'Profile',
      path: '/Profile',
      icon: <AiOutlineProfile />,
    },
    {
      title: 'Course Reg',
      path: '/coursereg',
      icon: <GiTakeMyMoney />,
    },
    {
      title: 'Course Form',
      path: '/courseform',
      icon: <HiOutlineClipboardDocumentList />,
    },
    {
      title: 'Payent Notification',
      path: '/PaymentNotification',
      icon: <GiTakeMyMoney />,
    },
    {
      title: 'Wallet',
      path: '/StudentWallet',
      icon: <TfiWallet />,
    },
    {
      title: 'About Us',
      path: '/Aboutus',
      icon: <FaInfoCircle />,
    },
  ]

  const adminMenu = [
    {
      title: 'Admin Home',
      path: '/',
      icon: <FaHome />,
    },
    {
      title: 'Payment Confirmation',
      path: '/adminpaymentapproval',
      icon: <GiBank />,
    },
    {
      title: 'Wallet History',
      path: '/adminwallethistory',
      icon: <GiWallet />,
    },
    {
      title: 'Config',
      path: '/Config',
      icon: <AiOutlineTool />,
    },
    {
      title: 'Settings',
      path: '/Settings',
      icon: <AiFillSetting />,
    },
  ]

  const displayMenu = activeUser?.role === 'student' ? studentMenu : adminMenu

  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem('loginSession')
    localStorage.removeItem('activeUserProfile')
    navigate('/login')
  }

  return (
    <>
      {/* Header Section */}
      <header className="navbar sticky-top flex-md-nowrap p-0 shadow">
        <Link to="" className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6">
          <span className="pe-3">
            {/* <FaUserCircle /> */}
            <img
              className="rounded-5"
              src={kcLogo}
              alt=""
              width="50"
              height="50"
            ></img>
          </span>
          {activeUser?.role}
        </Link>
        <button
          className="navbar-toggler position-absolute d-md-none collapsed"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarMenu"
          aria-controls="sidebarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-nav">
          <div className="nav-item text-nowrap">
            <span className="nav-link px-3 text-white fw-bolder text-capitalize">
              {`Welcome ${activeUser?.otherName},`}{' '}
              {activeUser?.surname.toUpperCase()}!
            </span>
          </div>
        </div>
      </header>

      {/* Sidebar Section */}
      <div className="container-fluid">
        <div className="row">
          <nav
            id="sidebarMenu"
            className="col-md-3 mt-4 col-lg-2 d-md-block bg-light sidebar collapse"
          >
            <div className="position-sticky pt-3 sidebar-sticky">
              <ul className="nav flex-column">
                {displayMenu.map((myMenu, index) => {
                  const isActive = location.pathname === myMenu.path
                  index = index + 1
                  return (
                    <li key={index} className="nav-item">
                      <Link
                        to={myMenu.path}
                        className={`nav-link ${isActive && 'active'}`}
                        aria-current="page"
                      >
                        <span
                          style={{ paddingRight: 15, paddingLeft: 5 }}
                          data-feather="home"
                          className="align-text-bottom"
                        >
                          {myMenu.icon}
                        </span>
                        {myMenu.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>

              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted text-uppercase">
                <span>Saved reports</span>
                <Link
                  to=""
                  className="link-secondary"
                  aria-label="Add a new report"
                >
                  <span
                    data-feather="plus-circle"
                    className="align-text-bottom"
                  ></span>
                </Link>
              </h6>
              <ul className="nav flex-column mb-2">
                <li className="nav-item">
                  <Link to="" className="nav-link">
                    <span
                      data-feather="file-text"
                      className="align-text-bottom"
                    ></span>
                    Current month
                  </Link>
                </li>
              </ul>

              <div
                style={{ width: 240 }}
                className="dropdown fixed-bottom px-3 py-3 border-top border-dark"
              >
                <Link
                  to=""
                  className="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={activeUser?.passport}
                    alt=""
                    width="32"
                    height="32"
                    className="rounded-circle me-2"
                  ></img>
                  <strong className="nav-link">
                    {activeUser?.surname.toUpperCase()}
                  </strong>
                </Link>
                <ul className="dropdown-menu sidebarMenu text-small shadow">
                  <li>
                    <Link
                      to="/Profile"
                      style={{ fontSize: 14 }}
                      className="dropdown-item "
                    >
                      <span
                        style={{ paddingRight: 7, fontSize: 12 }}
                        data-feather="file-text"
                        className="align-text-bottom"
                      >
                        <AiOutlineProfile />
                      </span>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/wallet"
                      style={{ fontSize: 14 }}
                      className="dropdown-item nav-item"
                    >
                      <span
                        style={{ paddingRight: 7, fontSize: 12 }}
                        data-feather="file-text"
                        className="align-text-bottom"
                      >
                        <TfiWallet />
                      </span>
                      My Wallet
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/payment"
                      style={{ fontSize: 14 }}
                      className="dropdown-item"
                    >
                      <span
                        style={{ paddingRight: 7, fontSize: 12 }}
                        data-feather="file-text"
                        className="align-text-bottom"
                      >
                        <GiTakeMyMoney />
                      </span>
                      My Payments
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider"></hr>
                  </li>
                  <li>
                    <button
                      style={{ fontSize: 14 }}
                      onClick={handleSignOut}
                      className="dropdown-item "
                    >
                      <span
                        style={{ paddingRight: 7, fontSize: 12 }}
                        data-feather="file-text"
                        className="align-text-bottom"
                      >
                        <FaSignOutAlt />
                      </span>
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Content Section */}
          <main className="col-md-9 ms-sm-auto col-lg-10">{children}</main>
        </div>
      </div>
    </>
  )
}

export default Layout
