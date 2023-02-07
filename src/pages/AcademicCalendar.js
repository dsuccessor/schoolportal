import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import './color.css'
import { BiShow } from 'react-icons/bi'
import { SiSamsungpay } from 'react-icons/si'
import { GrTransaction } from 'react-icons/gr'

function AcademicCalendar() {
  const location = useLocation()
  const [acadId, setAcadId] = useState()
  const [delId, setDelId] = useState()
  const [formData, setFormData] = useState()
  const [formAcad, setFormAcad] = useState()
  const [isCalendar, setIsCalendar] = useState(true)
  const [studentRecord, setStudentRecord] = useState()
  const [acadCalendar, setAcadCalendar] = useState()
  const [myElem, setMyElem] = useState()
  const [updateData, setUpdateData] = useState()

  // const activeUserProfile = JSON.parse(
  //   localStorage.getItem('activeUserProfile'),
  // )

  useEffect(() => {
    const fetchAcadCalendar = async () => {
      await axios
        .get(
          `https://kaycad-v2.onrender.com/academiccalendar/fetchconfiguration`,
        )
        .then((response) => {
          setAcadCalendar(response?.data?.result)
        })
        .catch((error) => {
          console.log(error?.response?.data)
        })
    }

    const fetchStudentRecord = async () => {
      await axios
        .get(`https://kaycad-v2.onrender.com/student/fetchAll`)
        .then((response) => {
          setStudentRecord(response?.data?.response)
          // console.log(response?.data?.response)
          // toast.success(response.data.msg)
        })
        .catch((error) => {
          console.log(error?.response?.data)
          // toast.error(error?.response?.data?.msg)
        })
    }

    fetchStudentRecord()

    fetchAcadCalendar()
  }, [])

  const showStudent = () => {
    setIsCalendar(false)
  }

  const showAcad = () => {
    setIsCalendar(true)
  }

  const showModal = (e) => {
    const id = JSON.parse(e?.target?.value)
    // console.log(id)
    setMyElem(id)
  }
  // console.log(myElem)
  const getId = async (e) => {
    e.preventDefault()
    const id = e.target.value
    setAcadId(id)

    // console.log(id)
  }

  const getDelId = async (e) => {
    e.preventDefault()
    const id = e.target.value
    setDelId(id)

    // console.log(id)
  }

  const activateCalendar = async () => {
    const status = { status: 'active' }

    await axios
      .put(
        `https://kaycad-v2.onrender.com/academiccalendar/updateconfiguration/${acadId}`,
        status,
      )
      .then((response) => {
        // setAcadCalendar(response?.data?.result)
        console.log(response?.data?.result)
        toast.success(response.data.msg)
        window.location.reload()
      })
      .catch((error) => {
        console.log(error?.response?.data)
        toast.error(error?.response?.data?.msg)
        window.location.reload()
      })
  }

  const disableCalendar = async () => {
    const status = { status: 'inactive' }

    await axios
      .put(
        `https://kaycad-v2.onrender.com/academiccalendar/updateconfiguration/${acadId}`,
        status,
      )
      .then((response) => {
        // setAcadCalendar(response?.data?.result)
        console.log(response?.data?.result)
        toast.success(response.data.msg)
        window.location.reload()
      })
      .catch((error) => {
        console.log(error?.response?.data)
        toast.error(error?.response?.data?.msg)
        window.location.reload()
      })
  }

  const deleteCalendar = async () => {
    await axios
      .delete(
        `https://kaycad-v2.onrender.com/academiccalendar/deleteconfiguration/${acadId}`,
      )
      .then((response) => {
        toast.success(response.data.msg)
        window.location.reload()
      })
      .catch((error) => {
        console.log(error?.response?.data)
        toast.error(error?.response?.data?.msg)
        window.location.reload()
      })
  }

  const getUpdateData = (e) => {
    e.preventDefault()
    const name = e?.target?.name
    const value = e?.target?.value
    setUpdateData({ ...updateData, [name]: value })
  }

  const updateRecord = async (e) => {
    e.preventDefault()

    await axios
      .put(
        `https://kaycad-v2.onrender.com/student/updatebyid/${myElem?._id}`,
        updateData,
      )
      .then((response) => {
        // console.log(response?.data?.response)
        toast.success(response?.data?.msg)
        window.location.reload()
      })
      .catch((error) => {
        console.log(error?.response?.data)
        toast.error(error?.response?.data?.msg)
        window.location.reload()
      })
  }

  const viewStudent = (e) => {
    if (myElem !== undefined && myElem !== null) {
      const {
        surname,
        otherName,
        gender,
        dob,
        email,
        phoneNo,
        passport,
        password,
        faculty,
        department,
        createdAt,
        updatedAt,
        studentId,
        matricNo,
      } = myElem

      return (
        <>
          <div
            className="modal fade"
            id="viewstudentModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header deepBlue">
                  <h1 className="modal-title fs-5" id="viewstudentModalLabel">
                    {`${surname.toUpperCase()}, ${otherName}`}
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body bg-light">
                  <div className="row">
                    <div className="col-12 col-sm-6 col-md-6 col-lg-2">
                      <div className="card w-100">
                        <img
                          src={passport}
                          className="card-img-top"
                          height={200}
                          alt={`${surname} ${otherName}`}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-10">
                      <div className="card w-100">
                        <div className="card-body bg-light">
                          <div className="otherBlue rounded p-3 text-light fw-bolder fs-6">
                            <form className="row g-3 justify-content-center">
                              <div className="col-6">
                                <label className="form-label mt-2 fw-bolder">
                                  Surname:
                                  <span className="ms-2">
                                    <SiSamsungpay />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.surname}
                                  defaultValue={surname}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="surname"
                                />
                                <label className="form-label fw-bolder mt-2">
                                  Other Name:
                                  <span className="ms-2">
                                    <GrTransaction />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.otherName}
                                  defaultValue={otherName}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="otherName"
                                />
                                <label className="form-label mt-2 fw-bolder">
                                  Gender:
                                  <span className="ms-2">
                                    <SiSamsungpay />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.gender}
                                  defaultValue={gender}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="gender"
                                />
                                <label className="form-label fw-bolder mt-2">
                                  Date of Birth:
                                  <span className="ms-2">
                                    <GrTransaction />
                                  </span>
                                </label>
                                <span className="d-block">
                                  <input
                                    defaultValue={dob.split('T')[0]}
                                    type="text"
                                    className="d-inline form-control form-control-sm fw-bolder w-50"
                                    disabled
                                  />
                                  <input
                                    value={updateData?.dob}
                                    type="date"
                                    className="d-inline form-control form-control-sm fw-bolder w-50"
                                    onChange={getUpdateData}
                                    name="dob"
                                  />
                                </span>
                                <label className="form-label fw-bolder mt-2">
                                  Date Created:
                                  <span className="ms-2">
                                    <GrTransaction />
                                  </span>
                                </label>
                                <input
                                  defaultValue={`${createdAt.split('T')[0]} ${
                                    createdAt.split('T')[1].split('.')[0]
                                  }`}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  disabled
                                />
                                <label className="form-label fw-bolder mt-2">
                                  Last Updated:
                                  <span className="ms-2">
                                    <GrTransaction />
                                  </span>
                                </label>
                                <input
                                  defaultValue={`${updatedAt.split('T')[0]} ${
                                    updatedAt.split('T')[1].split('.')[0]
                                  }`}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  disabled
                                />
                              </div>
                              <div className="col-6">
                                <label className="form-label mt-2 fw-bolder">
                                  Student Id:
                                  <span className="ms-2">
                                    <SiSamsungpay />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.studentId}
                                  defaultValue={studentId}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="studentId"
                                  disabled
                                />
                                <label className="form-label mt-2 fw-bolder">
                                  Matric No:
                                  <span className="ms-2">
                                    <SiSamsungpay />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.matricNo}
                                  defaultValue={matricNo}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="matricNo"
                                  disabled
                                />
                                <label className="form-label mt-2 fw-bolder">
                                  Email Address:
                                  <span className="ms-2">
                                    <SiSamsungpay />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.email}
                                  defaultValue={email}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="email"
                                />
                                <label className="form-label fw-bolder mt-2">
                                  Phone Number:
                                  <span className="ms-2">
                                    <GrTransaction />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.phoneNo}
                                  defaultValue={phoneNo}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="phoneNo"
                                />
                                <label className="form-label mt-2 fw-bolder">
                                  Faculty:
                                  <span className="ms-2">
                                    <SiSamsungpay />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.faculty}
                                  defaultValue={faculty}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="faculty"
                                />
                                <label className="form-label fw-bolder mt-2">
                                  Department:
                                  <span className="ms-2">
                                    <GrTransaction />
                                  </span>
                                </label>
                                <input
                                  value={updateData?.department}
                                  defaultValue={department}
                                  type="text"
                                  className="form-control form-control-sm fw-bolder"
                                  onChange={getUpdateData}
                                  name="department"
                                />
                              </div>
                              <div>
                                <button
                                  type="button"
                                  className="btn btn-sm deepBlue ms-lg-3 mt-lg-2"
                                  onClick={updateRecord}
                                >
                                  Save Changes
                                </button>
                                {/* <button
                                  type="button"
                                  className="btn btn-sm mx-3 otherBlue px-4"
                                  // onClick="{fetchFilter}"
                                >
                                  Clear
                                </button> */}
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 my-3 text-center">
                        <h4 className="text-decoration-underline text-danger">
                          {/* {adminConfirmStatus === 'declined' &&
                          'Decline Reason/Comment'} */}
                        </h4>
                        <p className="fw-bold">
                          {/* {adminConfirmStatus === 'declined' && declineReason} */}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )
    }
  }

  const deleteStudent = async (e) => {
    await axios
      .delete(`https://kaycad-v2.onrender.com/student/delete/${delId}`)
      .then((response) => {
        toast.success(response.data.msg)
        window.location.reload()
      })
      .catch((error) => {
        console.log(error?.response?.data)
        toast.error(error?.response?.data?.msg)
        window.location.reload()
      })
  }

  const getFormAcad = (e) => {
    const name = e?.target?.name
    let value = e?.target?.value

    if (value === '') {
      value = undefined
      setFormAcad({ ...formAcad, [name]: value })
    } else {
      setFormAcad({ ...formAcad, [name]: value })
    }

    console.log(formAcad)
  }

  const postAcadCalendar = async (e) => {
    e.preventDefault()
    const { session, semester } = formAcad

    const validateEntry = [session, semester].every(
      (entry) => entry === null || entry === undefined,
    )

    if (validateEntry) {
      console.log('All Fields cannot be empty')
      toast.error('All Fields cannot be empty')
    } else {
      await axios
        .post(
          `https://kaycad-v2.onrender.com/academiccalendar/configure`,
          formAcad,
        )
        .then((response) => {
          toast.success(response?.data?.msg)
          window.location.reload()
        })
        .catch((error) => {
          console.log(error?.response?.data)
          toast.error(error?.response?.data?.msg)
        })
    }
  }

  const displayOption = () => {
    if (isCalendar === true) {
      if (acadCalendar?.length < 1) {
        return (
          <>
            <div className="col-md-12 col-lg-4 col-xl-4">
              <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title text-center lightBlue rounded">
                      Configure Academic Calendar
                    </h5>
                    {showCalenderForm()}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-8 col-xl-8">
              <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                <div className="card bg-body p-3">
                  <div className="">
                    <h5 className="card-title text-center lightBlue rounded mb-3">
                      Academic Calendar
                    </h5>

                    <h4 className="border-bottom pb-2 mb-0 text-center text-danger">
                      No student record available for projection!
                    </h4>

                    <h6 className="border-bottom pb-2 mb-0 text-center text-info">
                      Kindly cross check all the neccesary areas for issue(s).
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      } else {
        return (
          <>
            <div className="col-md-12 col-lg-4 col-xl-4">
              <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title text-center lightBlue rounded">
                      Configure Academic Calendar
                    </h5>
                    {showCalenderForm()}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-8 col-xl-8">
              <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                <div className="card bg-body p-3">
                  <div className="">
                    <h5 className="card-title text-center lightBlue rounded mb-3">
                      Academic Calendar
                    </h5>

                    <div className="table-responsive bg-light rounded">
                      <table className="table table-striped border border-1 table-sm">
                        <thead>
                          <tr>
                            <th className="p-2" scope="col">
                              #
                            </th>
                            <th className="p-2" scope="col">
                              Id
                            </th>
                            <th className="p-2" scope="col">
                              Session
                            </th>
                            <th className="p-2" scope="col">
                              Semester
                            </th>
                            <th className="p-2" scope="col">
                              Created Date
                            </th>
                            <th className="p-2" scope="col">
                              Updated Date
                            </th>
                            <th className="p-2" scope="col">
                              Status
                            </th>
                            <th className="p-2" scope="col">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {acadCalendar?.map((calendar, index) => {
                            index = index + 1

                            return (
                              <tr key={index}>
                                <td className="p-2">{index}</td>
                                <td className="p-2">{calendar?._id}</td>
                                <td className="p-2">{calendar?.session}</td>
                                <td className="p-2">{calendar?.semester}</td>
                                <td className="p-2">
                                  {`${calendar?.createdAt.split('T')[0]} ${
                                    calendar?.createdAt
                                      .split('T')[1]
                                      .split('.')[0]
                                  }`}
                                </td>
                                <td className="p-2">
                                  {`${calendar?.updatedAt.split('T')[0]} ${
                                    calendar?.updatedAt
                                      .split('T')[1]
                                      .split('.')[0]
                                  }`}
                                </td>
                                <td className="p-2">{calendar?.status}</td>
                                <td className="text-center">
                                  <form>
                                    <button
                                      value={calendar?._id}
                                      type="button"
                                      className="btn btn-sm btn-primary pt-0 m-1"
                                      onClick={activateCalendar}
                                      onMouseEnter={getId}
                                      title="Enable Calendar"
                                    >
                                      <BiShow />
                                    </button>
                                    <button
                                      value={calendar?._id}
                                      type="button"
                                      className="btn btn-sm btn-secondary pt-0 m-1"
                                      onClick={disableCalendar}
                                      onMouseEnter={getId}
                                      title="Disable Calendar"
                                    >
                                      <BiShow />
                                    </button>
                                    <button
                                      value={calendar?._id}
                                      type="button"
                                      className="btn btn-sm btn-danger pt-0 m-1"
                                      onClick={deleteCalendar}
                                      onMouseEnter={getId}
                                      title="Delete Calendar"
                                    >
                                      <BiShow />
                                    </button>
                                  </form>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    } else if (isCalendar === false) {
      if (acadCalendar?.length < 1) {
        return (
          <>
            <div className="col-md-12 col-lg-4 col-xl-4">
              <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title text-center lightBlue rounded mt-2">
                      Filter Student Record
                    </h5>
                    {showFilterBox()}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-8 col-xl-8">
              <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                <div className="card bg-body p-3">
                  <div className="">
                    <h5 className="card-title text-center lightBlue rounded mb-3">
                      Student Details
                    </h5>

                    <h4 className="border-bottom pb-2 mb-0 text-center text-danger">
                      No student record available for projection!
                    </h4>

                    <h6 className="border-bottom pb-2 mb-0 text-center text-info">
                      Kindly cross check all the neccesary areas for issue(s).
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      } else {
        return (
          <>
            <div className="col-md-12 col-lg-4 col-xl-4">
              <div className="my-3 px-3 py-3 bg-light border border-1 rounded shadow-sm">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title text-center lightBlue rounded">
                      Filter Student Record
                    </h5>
                    {showFilterBox()}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-12 col-lg-8 col-xl-8">
              <div className="my-3 px-3 py-3 bg-light border border-1 rounded shadow-sm">
                <div className="card bg-body p-3">
                  <div className="">
                    <h5 className="card-title text-center lightBlue rounded mb-3">
                      Student Details
                    </h5>

                    <div className="table-responsive bg-body border border-1 rounded p-3">
                      <table className="table table-striped table-sm">
                        <thead>
                          <tr>
                            <th className="p-2" scope="col">
                              #
                            </th>
                            <th className="p-2" scope="col">
                              Student <br /> ID
                            </th>
                            <th className="p-2" scope="col">
                              Matric <br /> ID
                            </th>
                            <th className="p-2" scope="col">
                              Student <br /> Name
                            </th>
                            <th className="p-2" scope="col">
                              Gender
                            </th>
                            <th className="p-2" scope="col">
                              Email
                            </th>
                            <th className="p-2" scope="col">
                              Faculty
                            </th>
                            <th className="p-2" scope="col">
                              Department
                            </th>
                            <th className="p-2" scope="col">
                              Created <br /> Updated
                            </th>
                            <th className="p-2" scope="col">
                              View <br /> Details
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {studentRecord?.map((student, index) => {
                            index = index + 1

                            return (
                              <tr key={index}>
                                <td className="p-2">{index}</td>
                                <td className="p-2">{student?.studentId}</td>
                                <td className="p-2">{student?.matricNo}</td>
                                <td className="p-2">{`${student?.surname} ${student?.otherName}`}</td>
                                <td className="p-2">{student?.gender}</td>
                                <td className="p-2">{student?.email}</td>
                                <td className="p-2">{student?.faculty}</td>
                                <td className="p-2">{student?.department}</td>
                                <td className="p-2">
                                  {student?.createdAt.split('T')[0]} <br />(
                                  {student?.updatedAt.split('T')[0]})
                                </td>
                                <td className="text-center">
                                  <button
                                    value={JSON.stringify(student)}
                                    type="button"
                                    className="btn btn-sm btn-primary pt-0 mt-2"
                                    data-bs-toggle="modal"
                                    data-bs-target="#viewstudentModal"
                                    onMouseEnter={showModal}
                                    title="View & Edit Student Record"
                                  >
                                    <BiShow />
                                  </button>

                                  <button
                                    value={student?._id}
                                    type="button"
                                    className="btn btn-sm btn-danger pt-0 m-1"
                                    onMouseEnter={getDelId}
                                    onClick={deleteStudent}
                                    title="Delete Student Record"
                                  >
                                    <BiShow />
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      }
    }
  }

  const getFormData = (e) => {
    const name = e?.target?.name
    let value = e?.target?.value

    if (value === '') {
      value = undefined
      setFormData({ ...formData, [name]: value })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const showFilterBox = () => {
    return (
      <>
        <form className="row g-3 justify-content-center">
          <div className="col">
            <label className="form-label mt-2 fw-bolder">
              Faculty
              <span className="ms-2">
                <SiSamsungpay />
              </span>
            </label>
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={getFormData}
              name="faculty"
            >
              <option value="">Choose...</option>
              <option value="science and technology">Science & Tech</option>
              <option value="agriculture">Agriculture</option>
              <option value="arts">Arts</option>
              <option value="medcine">Medcine</option>
              <option value="engineering">Engineering</option>
            </select>

            <label className="form-label fw-bolder mt-2">
              Department
              <span className="ms-2">
                <GrTransaction />
              </span>
            </label>
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={getFormData}
              name="department"
            >
              <option value="">Select...</option>
              <option value="science laboratory technology">SLT</option>
              <option value="computer science">Computer Science</option>
              <option value="forestry">Forestry</option>
              <option value="nursing">Nursing</option>
              <option value="computer engineering">Computer Engineering</option>
              <option value="english">English</option>
            </select>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-sm mx-3 otherBlue px-4"
              // onClick="{fetchFilter}"
            >
              Filter
            </button>

            <button
              type="button"
              className="btn btn-sm deepBlue ms-lg-3 mt-lg-2"
              // onClick="{autoDownload}"
            >
              Download
            </button>
          </div>
        </form>
      </>
    )
  }

  const showCalenderForm = () => {
    return (
      <>
        <form className="row g-3 justify-content-center">
          <div className="col">
            <label className="form-label mt-2 fw-bolder">
              Session
              <span className="ms-2">
                <SiSamsungpay />
              </span>
            </label>

            <input
              type="text"
              className="form-control form-control-sm"
              id=""
              name="session"
              placeholder=""
              onChange={getFormAcad}
            />

            <label className="form-label fw-bolder mt-2">
              Semester
              <span className="ms-2">
                <GrTransaction />
              </span>
            </label>
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={getFormAcad}
              name="semester"
            >
              <option value="">Select...</option>
              <option value="first semester">First Semester</option>
              <option value="second semester">Second Semester</option>
            </select>
          </div>
          <div>
            <button
              type="reset"
              className="btn btn-sm mx-3 otherBlue px-4"
              // onClick="{fetchFilter}"
            >
              Clear
            </button>

            <button
              type="button"
              className="btn btn-sm deepBlue mt-md-3 mt-lg-0"
              onClick={postAcadCalendar}
            >
              Create Calendar
            </button>
          </div>
        </form>
      </>
    )
  }

  return (
    <Layout>
      <>
        <div className="container p-0">
          {/* Nav Section */}
          <div className="row">
            <div className="bg-white d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-0 border-bottom">
              <h1 className="h4 link-primary">
                {isCalendar === true ? 'Academic Calendar' : 'Student Base'}
              </h1>
              <div className="btn-toolbar mb-2 mb-md-0">
                <div className="btn-group me-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={showAcad}
                  >
                    Academic Calendar
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={showStudent}
                  >
                    Student Base
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
              <div className="row">{displayOption()}</div>
              {viewStudent()}
            </main>
          </div>
        </div>
        <ToastContainer />
      </>
    </Layout>
  )
}

export default AcademicCalendar
