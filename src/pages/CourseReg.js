import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
// import { useNavigate } from 'react-router-dom'

function CourseReg() {
  const location = useLocation()
  // const navigate = useNavigate()
  var session
  var maxUnit = 0

  const redirect = () => {
    // setTimeout(() => navigate('/'), 2000)
    setTimeout(() => window.location.reload(), 5000)
  }

  const activeUserProfile = JSON.parse(
    localStorage.getItem('activeUserProfile'),
  )

  const [profiles, setProfiles] = useState([])
  const [courseForm, setCourseForm] = useState()
  const [status, setStatus] = useState()

  const [loginUser, setLoginUser] = useState({
    studentId: 'studentId',
    course: [],
  })

  useEffect(() => {
    const userProfiles = async () => {
      await axios
        .get(
          `http://localhost:3001/course/fetch/${activeUserProfile?.department}`,
        )
        .then((response) => {
          setProfiles(response.data.result)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    const userCourseForm = async () => {
      await axios
        .get(
          `http://localhost:3001/courseform/fetchAll/${activeUserProfile?.studentId}`,
        )
        .then((response) => {
          setCourseForm(response.data.result)
          // console.log(courseForm)
          // console.log(response.data)
        })
        .catch((error) => {
          console.log(error.response.data)
          setStatus(error.response.data.msg)
          console.log(status)
        })
    }

    userProfiles()
    userCourseForm()
  }, [activeUserProfile?.department, activeUserProfile?.studentId, status])

  const handleOnChange = (e) => {
    // const name = e.target.name
    const value = e.target.value
    const id = e.target.id
    const placeholder = e.target.placeholder
    // const tabIndex = e.target.tabIndex
    const title = e.target.title
    const alt = e.target.alt

    setLoginUser({
      studentId: activeUserProfile?.studentId,
      course: [
        ...loginUser.course,
        {
          courseId: alt,
          courseTitle: placeholder,
          courseCode: value,
          courseUnit: id,
        },
      ],
      semester: title,
      session: session,
    })
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()

    // console.log(loginUser)

    await axios
      .post('http://localhost:3001/courseform/registercourse', loginUser)
      .then((res) => {
        console.log(res.data.result)
        toast.success(res.data.msg)
        redirect()
      })
      .catch((err) => {
        console.log(err?.response)
        toast.error(err?.response.data.msg)
      })
  }

  const displayOptions = () => {
    if (status === 'You havent register for any course yet') {
      return (
        <div className="col-lg-9">
          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h4 className="border-bottom pb-2 mb-0">
              Student Course Registeration
            </h4>
            <div className="table-responsive">
              <form onSubmit={handleOnSubmit}>
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
                      <th className="p-2" scope="col">
                        Select Course
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {profiles.map((profile, index) => {
                      index = index + 1
                      session = profile?.session
                      return (
                        <tr key={index}>
                          <td className="p-2">{index}</td>
                          <td className="p-2">{profile?.courseId}</td>
                          <td className="p-2">
                            {profile?.courseCode.toUpperCase()}
                          </td>
                          <td className="p-2">
                            {profile?.courseTitle.toUpperCase()}
                          </td>
                          <td className="p-2">{profile?.courseUnit}</td>
                          <td className="p-2">
                            <input
                              onChange={handleOnChange}
                              className="form-check-input"
                              type="checkbox"
                              name="course"
                              value={profile?.courseCode}
                              id={profile?.courseUnit}
                              placeholder={profile?.courseTitle}
                              title={profile?.semester}
                              // tabIndex={profile?.session}
                              alt={profile?.courseId}
                            ></input>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                <button className="w-100 btn btn-lg btn-primary" type="submit">
                  Register Course
                </button>
              </form>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className="col-lg-9">
          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <h4 className="border-bottom pb-2 mb-0">Course Registered</h4>
            <div className="table-responsive">
              <form>
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
              </form>
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
                      <img
                        src={activeUserProfile?.passport}
                        className="rounded m-3"
                        width="150"
                        height="170"
                        alt="Student Passport"
                      ></img>
                    </div>
                  </div>
                </div>

                {displayOptions()}

                {/* <div className="col-lg-9">
                  <div className="my-3 p-3 bg-body rounded shadow-sm">
                    <h4 className="border-bottom pb-2 mb-0">
                      Student Course Registeration
                    </h4>
                    <div className="table-responsive">
                      <form onSubmit={handleOnSubmit}>
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
                              <th className="p-2" scope="col">
                                Select Course
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {profiles.map((profile, index) => {
                              index = index + 1
                              session = profile?.session
                              return (
                                <tr key={index}>
                                  <td className="p-2">{index}</td>
                                  <td className="p-2">{profile?.courseId}</td>
                                  <td className="p-2">
                                    {profile?.courseCode.toUpperCase()}
                                  </td>
                                  <td className="p-2">
                                    {profile?.courseTitle.toUpperCase()}
                                  </td>
                                  <td className="p-2">{profile?.courseUnit}</td>
                                  <td className="p-2">
                                    <input
                                      onChange={handleOnChange}
                                      className="form-check-input"
                                      type="checkbox"
                                      name="course"
                                      value={profile?.courseCode}
                                      id={profile?.courseUnit}
                                      placeholder={profile?.courseTitle}
                                      title={profile?.semester}
                                      // tabIndex={profile?.session}
                                      alt={profile?.courseId}
                                    ></input>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>

                        <button
                          className="w-100 btn btn-lg btn-primary"
                          type="submit"
                        >
                          Register Course
                        </button>
                      </form>
                    </div>
                  </div>
                </div> */}
              </div>
            </main>
          </div>
        </div>
        <ToastContainer />
      </>
    </Layout>
  )
}

export default CourseReg
