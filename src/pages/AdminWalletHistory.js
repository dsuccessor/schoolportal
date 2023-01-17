import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import access from '../images/access.jpeg'
import './color.css'
import { GrTransaction } from 'react-icons/gr'
import { BiShow } from 'react-icons/bi'
import { IoWallet } from 'react-icons/io5'
import { SiSamsungpay } from 'react-icons/si'
import { IoCalendarNumber } from 'react-icons/io5'
import { GiMoneyStack, GiWallet } from 'react-icons/gi'
import { IoCalendarNumberSharp } from 'react-icons/io5'
import { useDownloadExcel } from 'table-to-excel-react'

function AdminWalletHistory() {
  const location = useLocation()
  const [myElem, setMyElem] = useState()
  const [walletHistory, setWalletHistory] = useState()
  const [balance, setBalance] = useState()
  const [formData, setFormData] = useState()

  const activeUserProfile = JSON.parse(
    localStorage.getItem('activeUserProfile'),
  )

  useEffect(() => {
    const fetchWalletHistory = async () => {
      await axios
        .get(`http://localhost:3001/wallet/aggregateBalance`)
        .then((response) => {
          setBalance(response?.data?.result)
        })
        .catch((error) => {
          console.log(error?.response?.data)
        })

      await axios
        .get(`http://localhost:3001/wallet/adminwallethistory`)
        .then((response) => {
          setWalletHistory(response?.data?.result)
        })
        .catch((error) => {
          console.log(error?.response?.data)
        })
    }

    fetchWalletHistory()
  }, [])

  const getId = (e) => {
    const id = e?.target?.id

    // e?.target.click()

    setMyElem(id)
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

  const { onDownload } = useDownloadExcel({
    fileName: `Wallet History ${walletHistory?.updatedAt}`,
    table: 'walletHistoryTable',
    sheet: 'Wallet Report',
  })

  const fetchFilter = async (e) => {
    e.preventDefault()
    const {
      walletId,
      paymentId,
      txnType,
      paymentType,
      fromDate,
      toDate,
    } = formData

    const validateEntry = [
      walletId,
      paymentId,
      txnType,
      paymentType,
      fromDate,
      toDate,
    ].every((entry) => entry === null || entry === undefined)

    if (validateEntry) {
      console.log('All Fields cannot be empty')
      toast.error('All Fields cannot be empty')
    } else {
      await axios
        .post(`http://localhost:3001/wallet/filterwallethistory`, formData)
        .then((response) => {
          if (response?.data?.result?.length < 1) {
            setWalletHistory(response?.data?.result)
            toast.error('No record found')
          } else {
            setWalletHistory(response?.data?.result)
            toast.success(response?.data?.msg)
          }
        })
        .catch((error) => {
          console.log(error?.response?.data)
          toast.error(error?.response?.data?.msg)
        })
    }
  }
  // console.log(formData)
  // console.log(balance)

  const showWalletHistory = () => {
    return (
      <>
        <div className="row py-2">
          <div className="col-6">
            <form>
              <input
                type="email"
                class="form-control form-control-sm"
                id="exampleInputEmail1"
                placeholder="Make your search..."
              />
            </form>
          </div>
          <div className="col-6 float-end">
            <button
              type="button"
              className="btn btn-sm deepBlue"
              onClick={onDownload}
            >
              Download
            </button>
          </div>
        </div>
        <div className="table-responsive">
          <table
            id="walletHistoryTable"
            className="table table-striped table-sm"
          >
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
                  Txn Type
                </th>
                <th className="p-2" scope="col">
                  Payment <br /> Type
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
                    <td className="p-2">{course?.txnType}</td>
                    <td className="p-2">{course?.paymentType}</td>
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
      </>
    )
  }

  const showFilterBox = () => {
    return (
      <>
        <form className="row g-3 justify-content-center">
          <div className="col">
            <label className="form-label fw-bolder">
              Wallet Id
              <span className="ms-2">
                <IoWallet />
              </span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id=""
              name="walletId"
              placeholder=""
              onChange={getFormData}
            />
            <label className="form-label mt-2 fw-bolder">
              Txn Type
              <span className="ms-2">
                <SiSamsungpay />
              </span>
            </label>
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={getFormData}
              name="txnType"
            >
              <option value="">Choose...</option>
              <option value="wallet funding">Wallet funding</option>
              <option value="school fee">School Fee</option>
              <option value="acceptance fee">Acceptance Fee</option>
              <option value="admin fee">Admin Fee</option>
              <option value="other fee">Other Fee</option>
            </select>
          </div>

          <div className="col">
            <label className="form-label fw-bolder">
              Payment Id
              <span className="ms-2">
                <GiWallet />
              </span>
            </label>
            <input
              type="text"
              className="form-control form-control-sm"
              id=""
              name="paymentId"
              placeholder=""
              onChange={getFormData}
            />
            <label className="form-label mt-2 fw-bolder">
              From
              <span className="ms-2">
                <IoCalendarNumberSharp />
              </span>
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              id=""
              name="fromDate"
              placeholder="Date From"
              onChange={getFormData}
            />
          </div>
          <div className="col">
            <label className="form-label fw-bolder">
              Payment Type
              <span className="ms-2">
                <GrTransaction />
              </span>
            </label>
            <select
              className="form-select form-select-sm"
              aria-label="Default select example"
              onChange={getFormData}
              name="paymentType"
            >
              <option value="">Select...</option>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
            <label className="form-label mt-2 fw-bolder">
              To
              <span className="ms-2">
                <IoCalendarNumber />
              </span>
            </label>
            <input
              type="date"
              className="form-control form-control-sm"
              id=""
              name="toDate"
              placeholder="Date To"
              onChange={getFormData}
            />
          </div>
          <div>
            <button
              type="button"
              className="btn btn-sm mx-3 otherBlue px-4"
              onClick={fetchFilter}
            >
              Filter
            </button>
            <button type="button" className="btn btn-sm deepBlue">
              Download
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
              <h1 className="h4 link-primary">Wallet History</h1>
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
          {/* Wallet Balance and Filter section*/}
          <div className="row mb-3 ">
            <div className="col-12 col-md-12 col-lg-11 bg-light mx-auto me-5 rounded border-2 border-top border-bottom otherBlue-border">
              {/* Page to print */}
              <div className="row">
                {/* Wallet Balance Box Begin*/}
                <div className="col-12 col-sm-5 col-md-4 col-lg-3 col-xl-3">
                  <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                    <div className="row">
                      <div className="col-12 col-sm-12 col-md-12 offset-md-0 col-lg-12 offset-lg-0 col-xl-12">
                        <div className="card text-bg-primary bg-card-brown">
                          <div className="card-header fw-bolder fs-6 pe-2">
                            Wallet <br /> Info:
                            <span className="float-end text-white fs-5 pe-1  fw-bolder">
                              <GiMoneyStack />
                            </span>
                          </div>
                          <div className="card-body">
                            <p className="fw-bold  mb-3">
                              <small className="bg-success rounded fw-bolder px-2">
                                Total Cr:
                              </small>
                              <br />
                              {balance?.length > 0 &&
                                new Intl.NumberFormat().format(
                                  balance[0]?.aggBalance.$numberDecimal,
                                )}
                            </p>
                            <p className="fw-bolder py-0">
                              <small className="bg-danger rounded fw-bolder px-2">
                                Total Dr:
                              </small>
                              <br />
                              {balance?.length > 0 &&
                                new Intl.NumberFormat().format(
                                  balance[1]?.aggBalance.$numberDecimal,
                                )}
                            </p>
                          </div>
                          <div className="card-footer bg-light px-2">
                            <small className="text-muted fw-bold">
                              Last updated on
                              {/* {` ${walletDetails?.updatedAt?.split('T')[0]} ${
                                walletDetails?.updatedAt
                                  ?.split('T')[1]
                                  .split('.')[0]
                              }`} */}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Wallet Filter Box Begin*/}
                <div className="col-12 col-sm-7 col-md-8 col-lg-9 col-xl-9">
                  <div className="my-3 px-3 py-3 bg-body rounded shadow-sm">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title text-center rounded lightBlue py-1">
                          Filter Section
                        </h5>

                        {/* Table */}
                        {showFilterBox()}
                        {/* 
                        <!-- Modal --> */}
                        {/* {modalBox()} */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Wallet Statement Table section*/}
          <div className="row">
            <div className="col-12 col-md-12 col-lg-11 bg-light mx-auto me-5">
              {/* Page to print */}
              <div className="row">
                <div className="col-12">
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
                        {/* {modalBox()} */}
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

export default AdminWalletHistory
