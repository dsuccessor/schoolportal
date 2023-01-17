import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import access from '../images/access.jpeg'
import './color.css'
import { BiShow } from 'react-icons/bi'
import { GiConfirmed } from 'react-icons/gi'

function AdminPaymentApproval() {
  const location = useLocation()
  const [myElem, setMyElem] = useState()
  const [actionData, setActionData] = useState({})
  const [decReason, setDecReason] = useState()

  const admin = JSON.parse(localStorage.getItem('loginSession'))

  const [adminName, setAdminName] = useState()

  const [payNotifyRecord, setPayNotifyRecord] = useState()

  useEffect(() => {
    const fetchPayNotifyRecord = async () => {
      await axios
        .get(`http://localhost:3001/paymentNotification/confirmationrequest`)
        .then((response) => {
          setPayNotifyRecord(response?.data?.response)
          // toast.success(response.data.msg)
        })
        .catch((error) => {
          console.log(error?.response?.data)
          // toast.error(error?.response?.data?.msg)
        })
    }

    fetchPayNotifyRecord()
    setAdminName(
      `${admin.checkIfExist.surname} ${admin.checkIfExist.otherName}`,
    )
  }, [admin.checkIfExist.otherName, admin.checkIfExist.surname])

  const getId = (e) => {
    const id = e?.target?.id

    setMyElem(id)
  }

  const getAction = (e) => {
    setActionData(JSON.parse(e?.target?.name))
    console.log(actionData)
  }

  const confirmPayment = async () => {
    const { _id, studentId, paymentId, amount } = actionData
    if (
      payNotifyRecord?.length > 0 &&
      actionData !== undefined &&
      actionData !== null
    ) {
      const confirmData = {
        adminConfirmStatus: 'approved',
        adminName: adminName,
      }
      await axios
        .put(
          `http://localhost:3001/paymentNotification/confirmpayment/${paymentId}`,
          confirmData,
        )
        .then(async (res) => {
          console.log(res.data)

          const walletId = `900${studentId}`

          await axios
            .get(`http://localhost:3001/wallet/getwalletbalance/${walletId}`)
            .then(async (res) => {
              const response = res.data.response[0].walletBalance.$numberDecimal

              const walletBalance = parseFloat(response)

              const newAmount = parseFloat(amount.$numberDecimal)

              const newWalletBalance = walletBalance + newAmount

              const creditWallet = {
                walletId: walletId,
                payment: _id,
                paymentType: 'credit',
                txnType: 'wallet funding',
                balanceBefore: walletBalance,
                walletBalance: newWalletBalance,
              }
              await axios
                .post(`http://localhost:3001/wallet/fundwallet`, creditWallet)
                .then(async (result) => {
                  console.log(result)
                  toast.success(result.data.msg)
                  setTimeout(() => window.location.reload(), 5000)
                })
                .catch((err) => {
                  console.log(err)
                  toast.error(err.result?.data.msg)
                  setTimeout(() => window.location.reload(), 5000)
                })
            })
            .catch((err) => {
              console.log(err.res)
              toast.error(err.res?.data.msg)
              setTimeout(() => window.location.reload(), 5000)
            })
        })
        .catch((err) => {
          console.log(err.res)
          toast.error(err.res?.data.msg)
          setTimeout(() => window.location.reload(), 5000)
        })
    }
  }

  const getReason = (e) => {
    setDecReason(e?.target?.value)
    // console.log(decReason)
  }

  const declineReason = () => {
    return (
      <>
        <div
          className="modal fade"
          id="declineReasonModalBox"
          tabIndex="-1"
          aria-labelledby="declineReasonModalBoxLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1
                  className="modal-title fs-5"
                  id="declineReasonModalBoxLabel"
                >
                  Decline Reason/Comment
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form>
                  <input
                    className="form-control"
                    type="text"
                    name="declineReason"
                    id=""
                    onChange={getReason}
                    placeholder="Provide the reason for the action you are about to take..."
                  />
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={declinePayment}
                >
                  Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  const declinePayment = async () => {
    const { paymentId } = actionData
    if (
      payNotifyRecord?.length > 0 &&
      actionData !== undefined &&
      actionData !== null
    ) {
      const declineData = {
        adminConfirmStatus: 'declined',
        adminName: adminName,
        declineReason: decReason,
      }
      await axios
        .put(
          `http://localhost:3001/paymentNotification/confirmpayment/${paymentId}`,
          declineData,
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
                  Student <br /> ID
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
                  View
                </th>
                <th className="p-2" scope="col">
                  Confirm <br /> /Decline
                </th>
              </tr>
            </thead>
            <tbody>
              {payNotifyRecord?.map((course, index) => {
                index = index + 1

                return (
                  <tr key={index}>
                    <td className="p-2">{index}</td>
                    <td className="p-2">{course?.studentId}</td>
                    <td className="p-2">{course?.paymentId}</td>
                    <td className="p-2">{course?.bankName}</td>
                    <td className="p-2">{course?.amount?.$numberDecimal}</td>
                    <td className="p-2">
                      {course?.paymentDate.split('T')[0]} <br />(
                      {course?.createdAt.split('T')[0]})
                    </td>
                    <td className="text-center">
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#viewDetailModalBox"
                        id={index}
                        type="button"
                        className="btn btn-sm btn-primary pt-0 mt-2"
                        onMouseEnter={getId}
                      >
                        <BiShow />
                      </button>
                    </td>
                    <td className="text-center">
                      <button
                        name={JSON.stringify(course)}
                        // name={course?.paymentId}
                        type="button"
                        className="btn btn-sm btn-success pt-0 mt-2"
                        onMouseEnter={getAction}
                        onClick={confirmPayment}
                      >
                        <GiConfirmed />
                      </button>
                      <button
                        name={JSON.stringify(course)}
                        // name={course?.paymentId}
                        type="button"
                        data-bs-toggle="modal"
                        data-bs-target="#declineReasonModalBox"
                        className="btn btn-sm btn-danger pt-0 mt-2 mx-2"
                        onMouseEnter={getAction}
                        // onClick={declinePayment}
                      >
                        <GiConfirmed />
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

  const viewDetailModalBox = () => {
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
            id="viewDetailModalBox"
            tabIndex="-1"
            aria-labelledby="viewDetailModalBoxLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header deepBlue">
                  <h1 className="modal-title fs-5" id="viewDetailModalBoxLabel">
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
                                {amount?.$numberDecimal}
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
                <div className="col-lg-5">
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
                        ............
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-7">
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
                        {viewDetailModalBox()}
                        {declineReason()}
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

export default AdminPaymentApproval
