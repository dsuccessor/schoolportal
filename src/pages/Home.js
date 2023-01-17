import React from 'react'
import { useLocation } from 'react-router-dom'
import Layout from './Layout'

function Home() {
  const location = useLocation()
  const userSession = JSON.parse(localStorage.getItem('loginSession'))
  const activeUser = userSession?.checkIfExist

  return (
    <Layout>
      <>
        <div className="container p-0">
          {/* Nav Section */}
          <div className="row">
            <div className="bg-white d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-0 border-bottom">
              <h1 className="h4 link-primary">Student Portal Dashboard</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Share
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    Export
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                >
                  <span
                    data-feather="calendar"
                    className="align-text-bottom"
                  ></span>
                  This week
                </button>
              </div>
            </div>

            <h6 className="px-2 mb-2 nav-link text-muted border-bottom">
              {location?.pathname === '/'
                ? '.../home'
                : `... ${location?.pathname}`}
            </h6>

            <main className="col-lg-12 col-md-12 ms-sm-auto col-lg-10 m-0 px-md-4 bg-light">
              <div className="row">
                <div className="col-lg-9">
                  <div className="my-3 p-3 bg-body rounded shadow-sm">
                    <h4 className="border-bottom pb-2 mb-0">Student Details</h4>
                    <div className="table-responsive">
                      <table className="table table-striped table-sm">
                        {/* <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Header</th>
        <th scope="col">Header</th>
      </tr>
    </thead> */}
                        <tbody>
                          <tr>
                            <td className="fw-bold p-2">User ID:</td>
                            <td className="p-2">{activeUser?._id}</td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">Surname:</td>
                            <td className="p-2">
                              {activeUser?.surname.toUpperCase()}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">Other Name(s):</td>
                            <td className="p-2">
                              {activeUser?.otherName.toUpperCase()}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">Email Address:</td>
                            <td className="p-2">
                              {activeUser?.email.toUpperCase()}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">Student ID:</td>
                            <td className="p-2">{activeUser?.userId}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3">
                  <div className="my-3 p-3 bg-body rounded shadow-sm">
                    <h5 className="border-bottom pb-2 mb-0 text-center">
                      Student Passport
                    </h5>

                    <div className="text-center">
                      <img
                        src={activeUser?.passport}
                        className="rounded m-3"
                        width="150"
                        height="170"
                        alt="Student Passport"
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </>
    </Layout>
  )
}

export default Home
