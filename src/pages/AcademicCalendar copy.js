import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import access from '../images/access.jpeg'
import './color.css'
import { BiShow } from 'react-icons/bi'
import { SiSamsungpay } from 'react-icons/si'
import { GrTransaction } from 'react-icons/gr'

function AcademicCalendar() {
  const location = useLocation()
  const [file, setFile] = useState(null)
  const [myElem, setMyElem] = useState()
  const [formData, setFormData] = useState()
  const [formAcad, setFormAcad] = useState()

  const activeUserProfile = JSON.parse(
    localStorage.getItem('activeUserProfile'),
  )

  const [payNotifyRecord, setPayNotifyRecord] = useState()
  const [studentRecord, setStudentRecord] = useState()

  const [paymentNotify, setPaymentNotify] = useState({
    studentId: activeUserProfile?.studentId,
    bankName: '',
    payeeName: '',
    amount: '',
    narration: '',
    paymentEvidence: '',
    paymentDate: '',
  })

  const handleOnChange = (e) => {
    const name = e.target.name
    const value = e.target.value

    setPaymentNotify({
      ...paymentNotify,
      [name]: value,
    })
  }

  const fileOnChange = (e) => {
    setFile(e.target.files[0])
    const name = e.target.name
    const value = e.target.value
    setPaymentNotify({
      ...paymentNotify,
      //  fileType: e.target.files[0],
      fileType: e.target.files[0].type,
      [name]: value,
    })
  }

  useEffect(() => {
    const fetchStudentRecord = async () => {
      await axios
        .get(`https://kaycad-v2.onrender.com/student/fetchAll`)
        .then((response) => {
          setStudentRecord(response?.data?.response)
          console.log(response?.data?.response)
          // toast.success(response.data.msg)
        })
        .catch((error) => {
          console.log(error?.response?.data)
          // toast.error(error?.response?.data?.msg)
        })
    }

    fetchStudentRecord()
  }, [])

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    const {
      bankName,
      payeeName,
      amount,
      narration,
      paymentEvidence,
      paymentDate,
    } = paymentNotify
    if (
      amount === '' ||
      paymentEvidence === '' ||
      bankName === '' ||
      payeeName === '' ||
      narration === '' ||
      paymentDate === ''
    ) {
      console.log('Fields cannot be empty')
      toast.error('Fields cannot be empty')
    } else {
      const formData = new FormData()

      formData.append('studentId', paymentNotify.studentId)
      formData.append('bankName', paymentNotify.bankName)
      formData.append('fileType', paymentNotify.fileType)
      formData.append('payeeName', paymentNotify.payeeName)
      formData.append('amount', paymentNotify.amount)
      formData.append('narration', paymentNotify.narration)
      formData.append('paymentEvidence', paymentNotify.paymentEvidence)
      formData.append('paymentDate', paymentNotify.paymentDate)
      formData.append(
        'paymentEvidence',
        file,
        `${paymentNotify.studentId}-${paymentNotify.paymentDate}-${paymentNotify.bankName}`,
      )

      const config = {
        headers: { 'content-type': 'multipart/form-data' },
      }
      await axios
        .post(
          'https://kaycad-v2.onrender.com/paymentNotification/sendnotification',
          formData,
          config,
        )
        .then((res) => {
          const result = JSON.stringify(res.data)
          console.log(result)
          toast.success(res.data.msg)
          setTimeout(() => window.location.reload(), 5000)
        })
        .catch((err) => {
          console.log(err.response)
          toast.error(err.response?.data.msg)
          setTimeout(() => window.location.reload(), 5000)
        })
    }
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

  const showModal = (e) => {
    const id = e?.target?.id

    setMyElem(id)
  }

  const recordTable = () => {
    if (
      payNotifyRecord?.length < 1 &&
      payNotifyRecord?.paymentId === undefined
    ) {
      return (
        <>
          <h4 className="border-bottom pb-2 mb-0 text-center text-danger">
            No student record available for projection!
          </h4>

          <h6 className="border-bottom pb-2 mb-0 text-center text-info">
            Kindly cross check all the neccesary areas for issue(s).
          </h6>
        </>
      )
    } else {
      return (
        <div className="table-responsive bg-light rounded p-3">
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
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        id={index}
                        type="button"
                        className="btn btn-sm btn-primary pt-0 mt-2"
                        onMouseEnter={showModal}
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
      )
    }
  }

  const modalBox = () => {
    if (payNotifyRecord?.length > 0 && myElem > 0) {
      const {
        studentId,
        bankName,
        payeeName,
        amount,
        narration,
        paymentEvidence,
        paymentDate,
        adminConfirmStatus,
        declineReason,
        adminName,
        createdAt,
        updatedAt,
        paymentId,
      } = payNotifyRecord[myElem - 1]

      const img = paymentEvidence.split('.')[0]

      return (
        <>
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header deepBlue">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    {`Payment ${paymentId}`}
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
                    <div className="col-12 col-md-12 col-lg-5">
                      <div className="card w-100">
                        <img
                          src={access}
                          className="card-img-top"
                          height={550}
                          alt={img}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-7">
                      <div className="card w-100">
                        <div className="card-body bg-light">
                          <div className="otherBlue rounded p-3 text-light fw-bolder fs-6">
                            <label>
                              Student Id:
                              <span className="badge text-bg-secondary ms-5">
                                {studentId}
                              </span>
                            </label>
                            <br />
                            <label>
                              Payment Id:
                              <span className="badge text-bg-secondary ms-5">
                                {paymentId}
                              </span>
                            </label>
                            <br />
                            <label>
                              Bank Name:
                              <span className="badge text-bg-secondary ms-5">
                                {bankName}
                              </span>
                            </label>
                            <br />
                            <label>
                              Payee Name:
                              <span className="badge text-bg-secondary ms-5">
                                {payeeName}
                              </span>
                            </label>
                            <br />
                            <label>
                              Amount:
                              <span className="badge text-bg-secondary ms-5">
                                {new Intl.NumberFormat().format(
                                  parseFloat(amount?.$numberDecimal).toFixed(2),
                                )}
                              </span>
                            </label>
                            <br />
                            <label>
                              Narration:
                              <span className="badge text-bg-secondary ms-5">
                                {narration}
                              </span>
                            </label>
                            <br />
                            <label>
                              Payment Evidence:
                              <span className="badge text-bg-secondary ms-5">
                                {paymentEvidence}
                              </span>
                            </label>
                            <br />
                            <label>
                              Payment Date:
                              <span className="badge text-bg-secondary ms-5">
                                {paymentDate}
                              </span>
                            </label>
                            <br />
                            <label>
                              Admin Confirm Status:
                              <span className="badge text-bg-secondary ms-5">
                                {adminConfirmStatus}
                              </span>
                            </label>
                            <br />
                            <label>
                              Admin Name:
                              <span className="badge text-bg-secondary ms-5">
                                {adminName}
                              </span>
                            </label>
                            <br />
                            <label>
                              Date Notified:
                              <span className="badge text-bg-secondary ms-5">
                                {createdAt}
                              </span>
                            </label>
                            <br />
                            <label>
                              Date Confirmed:
                              <span className="badge text-bg-secondary ms-5">
                                {updatedAt}
                              </span>
                            </label>
                            <br />
                          </div>
                        </div>
                      </div>

                      <div className="col-12 my-3 text-center">
                        <h4 className="text-decoration-underline text-danger">
                          {adminConfirmStatus === 'declined' &&
                            'Decline Reason/Comment'}
                        </h4>
                        <p className="fw-bold">
                          {adminConfirmStatus === 'declined' && declineReason}
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
              onClick="{fetchFilter}"
            >
              Filter
            </button>

            <button
              type="button"
              className="btn btn-sm deepBlue mt-md-3 ms-md-3"
              onClick="{autoDownload}"
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
              onClick="{fetchFilter}"
            >
              Clear
            </button>

            <button
              type="button"
              className="btn btn-sm deepBlue mt-md-3"
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
              <h1 className="h4 link-primary">Academic Calendar</h1>
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
              {/* Page to print */}
              <div className="row">
                <div className="col-md-12 col-lg-4 col-xl-4">
                  <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title text-center lightBlue rounded">
                          Filter Section
                        </h5>
                        {showFilterBox()}
                        <hr className="my-4 otherBlue-border" />
                        <h5 className="card-title text-center lightBlue rounded mt-2">
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
                          Student List
                        </h5>

                        {/* Table */}
                        {recordTable()}
                        {/* 
                        <!-- Modal --> */}
                        {modalBox()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <ToastContainer />
      </>
    </Layout>
  )
}

export default AcademicCalendar
