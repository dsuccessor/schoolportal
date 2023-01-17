import React, { useEffect, useRef, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import ReactToPrint from 'react-to-print'

function CourseForm() {
  const location = useLocation()
  var maxUnit = 0
  const componentRef = useRef()

  const activeUserProfile = JSON.parse(
    localStorage.getItem('activeUserProfile'),
  )

  const [courseForm, setCourseForm] = useState()
  const [status, setStatus] = useState()

  useEffect(() => {
    const userCourseForm = async () => {
      await axios
        .get(
          `http://localhost:3001/courseform/fetchAll/${activeUserProfile?.studentId}`,
        )
        .then((response) => {
          setCourseForm(response.data.result)
        })
        .catch((error) => {
          console.log(error.response.data)
          setStatus(error.response.data.msg)
          console.log(status)
        })
    }

    userCourseForm()
  }, [activeUserProfile?.studentId, status])

  var myDate = new Date()
  myDate = new Date(courseForm?.updatedAt)
  var date
  date = `${myDate.getDate()}-${myDate.getMonth() + 1}-${myDate.getFullYear()}`

  var currDate = new Date()
  var printDate = `${currDate.getDate()}-${
    currDate.getMonth() + 1
  }-${currDate.getFullYear()}`

  const displayOptions = () => {
    if (status === 'You havent register for any course yet') {
      return (
        <div className="col-lg-9">
          <h4 className="border-bottom pb-2 mb-0 text-center text-danger">
            You haven't registered any Course for the Semester/Session!
          </h4>

          <h6 className="border-bottom pb-2 mb-0 text-center text-info">
            Kindly proceed to Course registeration page.
          </h6>
        </div>
      )
    } else {
      return (
        <div className="col-lg-9">
          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h4 className="border-bottom pb-2 mb-0 text-center">
              Course Registered
            </h4>
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th className="p-2" scope="col">
                      #
                    </th>
                    <th className="p-2" scope="col">
                      Course ID
                    </th>
                    <th className="p-2" scope="col">
                      Course Code
                    </th>
                    <th className="p-2" scope="col">
                      Course Title
                    </th>
                    <th className="p-2" scope="col">
                      Course Unit
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courseForm?.course?.map((course, index) => {
                    index = index + 1
                    maxUnit = course?.courseUnit + maxUnit
                    return (
                      <tr key={index}>
                        <td className="p-2">{index}</td>
                        <td className="p-2">{course?.courseId}</td>
                        <td className="p-2">{course?.courseCode}</td>
                        <td className="p-2">{course?.courseTitle}</td>
                        <td className="p-2">{course?.courseUnit}</td>
                      </tr>
                    )
                  })}
                  <tr>
                    <td
                      className="p-2"
                      colSpan="3"
                    >{`Total Course Unit: ${maxUnit}`}</td>
                    <td className="p-2" colSpan="2">{`Maximum Unit: 33`}</td>
                  </tr>
                </tbody>
              </table>

              <div className="py-5 px-4">
                <label className="float-start d-inline-block border-top fw-bold pt-2">
                  Class Adviser/HOD
                </label>
                <label className="float-end d-inline-block border-top fw-bold pt-2">
                  School/Faculty Officer
                </label>
              </div>
              <div className="py-3 mt-4">
                <h6 className="fw-bold">NOTE:</h6>
                <hr />
                <label className="text-danger">
                  Please, Ensure that your course registeration form is duly
                  signed, stamped and submitted to the accademic unit for proper
                  verification and documentation. <br />
                  Also, remember to take your course registeration form along
                  with you to the exam hall!
                </label>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  return (
    <Layout>
      <>
        <div className="container p-0">
          {/* Nav Section */}
          <div className="row">
            <div className="bg-white d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-0 border-bottom">
              <h1 className="h4 link-primary">Course Registeration Form</h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  {
                    <ReactToPrint
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                        >
                          Print
                        </button>
                      )}
                      content={() => componentRef.current}
                    />
                  }
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

            <main
              ref={componentRef}
              className="col-lg-12 col-md-12 ms-sm-auto col-lg-10 m-0 px-md-4 bg-light"
            >
              {/* Page to print */}
              <div className="row">
                <div className="col-lg-9">
                  <div className="my-3 px-3 bg-body rounded shadow-sm">
                    <div className="my-2 p-3 bg-body text-center">
                      <h4 className="pb-2 mb-0">Kay Cad University</h4>
                      <h6 className="pb-2 mb-0">
                        6, Olakunle Selesi Crescent, Ajao Estate, Lagos
                      </h6>
                      <h4 className="pb-2 mb-0">Course Registeration Form</h4>
                      <h6 className="border-bottom pb-3 mb-0">
                        {courseForm?.session} Academic Session
                      </h6>
                    </div>
                    <div className="table-responsive">
                      <table className="table table-striped table-sm">
                        <tbody>
                          <tr>
                            <td className="fw-bold p-2">Student ID:</td>
                            <td className="p-2">
                              {activeUserProfile?.studentId}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">Surname:</td>
                            <td className="p-2">
                              {activeUserProfile?.surname.toUpperCase()}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">Other Name(s):</td>
                            <td className="p-2">
                              {activeUserProfile?.otherName.toUpperCase()}
                            </td>
                          </tr>

                          <tr>
                            <td className="fw-bold p-2">Matric No:</td>
                            <td className="p-2">
                              {activeUserProfile?.matricNo}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">Email Address:</td>
                            <td className="p-2">
                              {activeUserProfile?.email.toUpperCase()}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">Faculty:</td>
                            <td className="p-2">
                              {activeUserProfile?.faculty.toUpperCase()}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-bold p-2">
                              Department (Course of Study):
                            </td>
                            <td className="p-2">
                              {activeUserProfile?.department.toUpperCase()}
                            </td>
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
                      <div className="pt-2">
                        <span>{`Session: ${courseForm?.session}`}</span>
                      </div>
                      <img
                        src={activeUserProfile?.passport}
                        className="rounded mx-3 m-3"
                        width="150"
                        height="170"
                        alt="Student Passport"
                      ></img>
                      <div>
                        <span>{`Date Submitted: ${date}`}</span>
                        <br />
                        <span>{`Date Printed: ${printDate}`}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {displayOptions()}
              </div>
            </main>
          </div>
        </div>
        <ToastContainer />
      </>
    </Layout>
  )
}

export default CourseForm
