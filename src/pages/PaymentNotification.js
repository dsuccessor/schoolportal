import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import access from '../images/access.jpeg'
import './color.css'
import { BiShow } from 'react-icons/bi'

function PaymentNotification() {
  const location = useLocation()
  const [file, setFile] = useState(null)
  const [myElem, setMyElem] = useState()

  const activeUserProfile = JSON.parse(
    localStorage.getItem('activeUserProfile'),
  )

  const [payNotifyRecord, setPayNotifyRecord] = useState()

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
    const fetchPayNotifyRecord = async () => {
      await axios
        .get(
          `http://localhost:3001/paymentNotification/history/${activeUserProfile?.studentId}`,
        )
        .then((response) => {
          setPayNotifyRecord(response?.data?.result)
          // toast.success(response.data.msg)
        })
        .catch((error) => {
          console.log(error?.response?.data)
          // toast.error(error?.response?.data?.msg)
        })
    }

    fetchPayNotifyRecord()
  }, [activeUserProfile?.studentId, file, paymentNotify])

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
          'http://localhost:3001/paymentNotification/sendnotification',
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
            No payment notification history/record available for you!
          </h4>

          <h6 className="border-bottom pb-2 mb-0 text-center text-info">
            Kindly proceed to uploading payment notification once payment has
            been done into the school account(s).
          </h6>
        </>
      )
    } else {
      return (
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th className="p-2" scope="col">
                  #
                </th>
                <th className="p-2" scope="col">
                  Payment <br /> ID
                </th>
                <th className="p-2" scope="col">
                  Bank <br /> Name (Cr.)
                </th>
                <th className="p-2" scope="col">
                  Amount <br /> Paid
                </th>
                <th className="p-2" scope="col">
                  Payment Date <br /> (Upload Date)
                </th>
                <th className="p-2" scope="col">
                  Approval <br /> Status
                </th>
                <th className="p-2" scope="col">
                  View <br /> Details
                </th>
              </tr>
            </thead>
            <tbody>
              {payNotifyRecord?.map((course, index) => {
                index = index + 1
                let formatedAmount = new Intl.NumberFormat().format(
                  parseFloat(course?.amount?.$numberDecimal).toFixed(2),
                )
                return (
                  <tr key={index}>
                    <td className="p-2">{index}</td>
                    <td className="p-2">{course?.paymentId}</td>
                    <td className="p-2">{course?.bankName}</td>
                    <td className="p-2">{formatedAmount}</td>
                    <td className="p-2">
                      {course?.paymentDate.split('T')[0]} <br />(
                      {course?.createdAt.split('T')[0]})
                    </td>
                    <td className="p-2">{course?.adminConfirmStatus}</td>
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

  return (
    <Layout>
      <>
        <div className="container p-0">
          {/* Nav Section */}
          <div className="row">
            <div className="bg-white d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-0 border-bottom">
              <h1 className="h4 link-primary">Payment Notification</h1>
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
                <div className="col-md-12 col-lg-6 col-xl-5">
                  <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title text-center lightBlue">
                          Payment Entry
                        </h5>
                        <h6 className="card-subtitle mb-2 text-center text-danger">
                          Make sure you upload the payment evidence before
                          filling the rest of the form!.
                        </h6>
                        <form
                          onSubmit={handleOnSubmit}
                          encType="multipart/form-data"
                        >
                          <div className="row">
                            <div className="col-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="formFileSm"
                                  className="form-label mb-1"
                                >
                                  Payment Evidence
                                </label>
                                <input
                                  className="form-control form-control-sm"
                                  id="formFileLg"
                                  type="file"
                                  name="paymentEvidence"
                                  value={paymentNotify?.paymentEvidence}
                                  onChange={fileOnChange}
                                  multiple=""
                                ></input>
                              </div>

                              <div className="form-floating mb-3">
                                <select
                                  className="form-select"
                                  aria-label="Default select example"
                                  onChange={handleOnChange}
                                  name="bankName"
                                  value={paymentNotify?.bankName}
                                >
                                  <option>Select...</option>
                                  <option value="Access Bank">
                                    Access Bank
                                  </option>
                                  <option value="First Bank">First Bank</option>
                                  <option value="Kuda MFB">Kuda MFB</option>
                                  <option value="GT Bank">GT Bank</option>
                                  <option value="UBA">UBA</option>
                                </select>
                                <label>Bank Name</label>
                              </div>

                              <div className="form-floating mb-3">
                                <input
                                  type="text"
                                  name="payeeName"
                                  value={paymentNotify?.payeeName}
                                  onChange={handleOnChange}
                                  className="form-control"
                                  id="floatingInput"
                                  placeholder="Payee Name"
                                ></input>
                                <label>Payee Name</label>
                              </div>
                              <button
                                className="btn btn-primary m-2"
                                type="submit"
                              >
                                Submit
                              </button>
                            </div>

                            <div className="col-6">
                              <div className="form-floating mb-3">
                                <input
                                  type="text"
                                  name="amount"
                                  value={paymentNotify?.amount}
                                  onChange={handleOnChange}
                                  className="form-control"
                                  id="floatingPassword"
                                  placeholder="Amount"
                                ></input>
                                <label>Amount</label>
                              </div>
                              <div className="form-floating mb-3">
                                <input
                                  type="text"
                                  name="narration"
                                  value={paymentNotify?.narration}
                                  onChange={handleOnChange}
                                  className="form-control"
                                  id="floatingInput"
                                  placeholder="Narration"
                                ></input>
                                <label>Narration</label>
                              </div>

                              <div className="form-floating mb-3">
                                <input
                                  type="date"
                                  name="paymentDate"
                                  value={paymentNotify?.paymentDate}
                                  onChange={handleOnChange}
                                  className="form-control"
                                  id="floatingInput"
                                ></input>
                                <label>Payment Date</label>
                              </div>
                              <button
                                type="reset"
                                className="btn btn-danger m-2"
                              >
                                Clear
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12 col-lg-6 col-xl-7">
                  <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title text-center lightBlue">
                          Payment Notification History
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

export default PaymentNotification
