import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import access from '../images/access.jpeg'
import './color.css'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { GiMoneyStack } from 'react-icons/gi'
import { BiShow } from 'react-icons/bi'
// import { TbCurrencyNaira } from 'react-icons/tb'

function StudentWallet() {
  const location = useLocation()
  const [myElem, setMyElem] = useState()
  const [walletDetails, setWalletDetails] = useState()
  const [walletHistory, setWalletHistory] = useState()

  const activeUserProfile = JSON.parse(
    localStorage.getItem('activeUserProfile'),
  )

  const walletId = `900${activeUserProfile?.studentId}`

  const [walletBalance, setWalletBalance] = useState()

  useEffect(() => {
    const fetchBalance = async () => {
      await axios
        .get(
          `https://kaycad-v2.onrender.com/wallet/getwalletbalance/${walletId}`,
        )
        .then((response) => {
          setWalletDetails(response.data.response[0])
          const myBalance = parseFloat(
            response.data.response[0].walletBalance.$numberDecimal,
          ).toFixed(2)
          myBalance === '0.00'
            ? setWalletBalance(myBalance)
            : setWalletBalance(new Intl.NumberFormat().format(myBalance))
        })

      await axios
        .get(
          `https://kaycad-v2.onrender.com/wallet/studentwallethistory/${walletId}`,
        )
        .then((response) => {
          setWalletHistory(response?.data?.result)
          // toast.success(response.data.msg)
        })
        .catch((error) => {
          console.log(error?.response?.data)
          // toast.error(error?.response?.data?.msg)
        })
    }

    fetchBalance()
  }, [walletId])

  const getId = (e) => {
    const id = e?.target?.id

    // e?.target.click()

    setMyElem(id)
  }

  const showWalletHistory = () => {
    if (walletBalance?.length < 1 && walletBalance?.paymentId === undefined) {
      return (
        <>
          <h4 className="border-bottom pb-2 mb-2 text-center text-danger">
            No payment found on your wallet!
          </h4>
          <h5 className="border-bottom pb-2 mb-2 text-center text-dark lh-2 fs-6">
            Kindly confirm from your
            <kbd className="badge bg-primary ms-1">
              payment notification history
            </kbd>
            that the
            <kbd className="badge bg-primary ms-1">
              Admin Approval Status is true
            </kbd>
            on this particular payment ID!
          </h5>

          <h6 className="border-bottom pb-2 mb-0 text-center text-info fs-6">
            The Admin Approval status needed to be true before the payment can
            reflect on your wallet/wallet history.
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
                  Wallet <br /> ID
                </th>
                <th className="p-2" scope="col">
                  Payment <br /> ID
                </th>
                <th className="p-2" scope="col">
                  Amount
                </th>
                <th className="p-2" scope="col">
                  Balance <br /> Before
                </th>
                <th className="p-2" scope="col">
                  Balance <br /> After
                </th>
                <th className="p-2" scope="col">
                  DateTime
                </th>
                <th className="p-2" scope="col">
                  View <br /> Details
                </th>
              </tr>
            </thead>
            <tbody>
              {walletHistory?.map((course, index) => {
                index = index + 1
                let formatedBalanceBefore = new Intl.NumberFormat().format(
                  parseFloat(course?.balanceBefore?.$numberDecimal).toFixed(2),
                )
                let formatedBalanceAfter = new Intl.NumberFormat().format(
                  parseFloat(course?.walletBalance?.$numberDecimal).toFixed(2),
                )
                let formatedAmount = new Intl.NumberFormat().format(
                  parseFloat(course?.payment?.amount?.$numberDecimal).toFixed(
                    2,
                  ),
                )
                return (
                  <tr key={index}>
                    <td className="p-2">{index}</td>
                    <td className="p-2">{course?.walletId}</td>
                    <td className="p-2">{course?.payment?.paymentId}</td>
                    <td className="p-2">{formatedAmount}</td>
                    <td className="p-2">{formatedBalanceBefore} </td>
                    <td className="p-2">{formatedBalanceAfter}</td>
                    <td className="p-2">{`${course?.createdAt.split('T')[0]} ${
                      course?.createdAt.split('T')[1].split('.')[0]
                    }`}</td>
                    <td className="text-center">
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        id={index}
                        type="button"
                        className="btn btn-sm btn-primary pt-0 mt-2"
                        onMouseEnter={getId}
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
    if (walletBalance?.length > 0 && myElem > 0) {
      const {
        studentId,
        bankName,
        payeeName,
        amount,
        narration,
        paymentEvidence,
        paymentDate,
        createdAt,
        updatedAt,
        paymentId,
      } = walletBalance[myElem - 1]

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
                    {`Payment ${paymentId} Details`}
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
                                {amount}
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
              <h1 className="h4 link-primary">Student Wallet</h1>
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
          </div>
          <div className="row">
            <div className="col-12 col-md-12 col-lg-11 bg-light mx-auto me-5">
              {/* Page to print */}
              <div className="row">
                <div className="col-12 col-sm-12 col-md-12 col-lg-5 col-xl-4">
                  <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                    <div className="row">
                      <div className="col-6 col-sm-6 col-md-4 offset-md-1 col-lg-6 offset-lg-0 col-xl-6">
                        <div className="card text-bg-primary bg-card-brown">
                          <div className="card-header fw-bolder fs-6 pe-2">
                            Wallet <br /> Info:
                            <span className="float-end text-white fs-5 pe-1  fw-bolder">
                              <GiMoneyStack />
                            </span>
                          </div>
                          <div className="card-body">
                            <p className="fw-bold  mb-3">
                              <small className="lightBlue rounded fw-bolder px-1">
                                Wallet ID:
                              </small>
                              <br />
                              {walletDetails?.walletId === undefined
                                ? 'Acct Unavailable'
                                : walletDetails?.walletId}
                            </p>
                            <p className="fw-bolder py-0">
                              <small className="deepBlue rounded fw-bolder px-1">
                                Wallet ID:
                              </small>
                              <br />
                              {walletBalance}
                            </p>
                          </div>
                          <div className="card-footer bg-light px-2">
                            <small className="text-muted fw-bold">
                              Last updated on
                              {` ${walletDetails?.updatedAt?.split('T')[0]} ${
                                walletDetails?.updatedAt
                                  ?.split('T')[1]
                                  .split('.')[0]
                              }`}
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="col-6 col-sm-6 col-md-4 offset-md-2 col-lg-6 offset-lg-0 col-xl-6">
                        <div className="card text-bg-info bg-card-plaint">
                          <div className="card-header fw-bolder fs-6 text-white">
                            Account <br /> Details:
                            <span className="float-end text-white fs-5 fw-bolder">
                              <FaRegMoneyBillAlt />
                            </span>
                          </div>
                          <div className="card-body text-white pt-1 pb-0 py-md-3 py-lg-0 ">
                            <p className="text-light fw-bolder text-capitalize pt-sm-4 pt-md-0 pb-md-3 pb-lg-0">
                              {`${activeUserProfile?.surname} ${activeUserProfile?.otherName}`}
                            </p>
                            <p className="text-light fw-bolder py-0 py-sm-2 pb-md-2  py-lg-0">
                              {activeUserProfile?.phoneNo}
                            </p>
                            <p className="text-light fw-bolder pb-sm-3 pb-md-0">
                              Active
                            </p>
                          </div>
                          <div className="card-footer bg-light">
                            <small className="text-muted fw-bold">
                              {activeUserProfile?.email}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-12 col-md-12 col-lg-7 col-xl-8">
                  <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title text-center lightBlue">
                          Wallet History
                        </h5>

                        {/* Table */}
                        {showWalletHistory()}
                        {/* 
                        <!-- Modal --> */}
                        {modalBox()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
    </Layout>
  )
}

export default StudentWallet
