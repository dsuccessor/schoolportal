import React, { useEffect, useState } from 'react'
import Layout from './Layout'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import '../../node_modules/react-toastify/dist/ReactToastify.css'
import { GiConfirmed } from 'react-icons/gi'
import { FcMoneyTransfer } from 'react-icons/fc'
import './color.css'

function PaymentAdvice() {
  const location = useLocation()
  var myId = 0

  const [payStatus, setPayStatus] = useState()

  const [acadCalendar, setAcadCalendar] = useState()

  const activeUserProfile = JSON.parse(
    localStorage.getItem('activeUserProfile'),
  )

  const [feeList, setFeeList] = useState([])

  useEffect(() => {
    const status = 'active'

    // Api to get the active session from the academic calendar database

    axios
      .get(
        `https://kaycad-v2.onrender.com/academiccalendar/getcurrentcalendar/${status}`,
      )
      .then((response) => {
        setAcadCalendar(response.data.result[0])
        const currentSession = response.data.result[0].session
          .split('/')[0]
          .concat('-', response.data.result[0].session.split('/')[1])

        const level = '100l'
        window.currentSemester = response.data.result[0].semester

        // Api to fetch the fee due by each student from the payment advice databse
        axios
          .get(
            `https://kaycad-v2.onrender.com/paymentadvice/getfeeconfiguration/${level}/${currentSession}`,
          )
          .then((response) => {
            setFeeList(response.data.result)

            // console.log(response.data.result)

            // Api to get the status of each due on the payment advice from the school due databse

            const mydata = response.data.result.dueFees

            window.paymentStatus = []

            mydata.map((fee, index) => {
              axios
                .get(
                  `https://kaycad-v2.onrender.com/schooldue/getduebyFeeId/${fee?._id}`,
                )
                .then((response) => {
                  var result = response.data.status

                  window.paymentStatus = [...window.paymentStatus, result]
                  setPayStatus(window.paymentStatus)
                })
                .catch((error) => {
                  window.paymentStatus = [
                    ...window.paymentStatus,
                    error?.response?.data?.status,
                  ]
                  setPayStatus(window.paymentStatus)
                })
              return fee
            })
          })
          .catch((error) => {
            console.log(error?.response?.data)
          })
      })
      .catch((error) => {
        console.log(error?.response)
      })
  }, [activeUserProfile.matricNo])

  const payDue = (e) => {
    let { amount, feeName, _id } = JSON.parse(e.target.name)
    amount = parseFloat(amount.$numberDecimal)
    const feeId = _id
    const { semester, session } = acadCalendar
    const { feeCategory } = feeList
    const level = feeCategory
    const studentId = activeUserProfile.studentId
    const matricNo = activeUserProfile.matricNo

    const myref =
      Math.floor(Math.random() * (9999999999 - 1111111111 + 1)) + 1111111111

    const currDate = new Date()
    const myDay = currDate.getDay()
    const myMonth = currDate.getMonth()
    const myYear = currDate.getFullYear()
    const myDate = `${myYear}${myMonth}${myDay}`

    const paymentRef = `${myref}${feeName.split(' ')[0]}${
      feeName.split(' ')[1]
    }${myDate}${matricNo}${session.split('/')[0]}${
      session.split('/')[1]
    }${level}`

    const feeToPay = {
      feeId,
      studentId,
      matricNo,
      session,
      semester,
      level,
      feeName,
      amount,
      paymentRef,
    }

    console.log(feeToPay)

    const walletId = `900${studentId}`
    const txnType = feeName

    // Api to get current balance from the student wallet (account)
    axios
      .get(`https://kaycad-v2.onrender.com/wallet/getwalletbalance/${walletId}`)
      .then((res) => {
        const response = res.data.response[0].walletBalance.$numberDecimal

        const balanceBefore = parseFloat(response)

        const walletBalance = balanceBefore - amount
        const payment = feeId

        const feeToDebit = {
          walletId,
          payment,
          amount,
          paymentRef,
          txnType,
          balanceBefore,
          walletBalance,
        }

        console.log(feeToDebit)

        // Api to debit student wallet for the payment (schooldue) accordingly

        axios
          .post(`https://kaycad-v2.onrender.com/wallet/debitwallet`, feeToDebit)
          .then((response) => {
            // Api to update the payment (schooldue) made accordingly
            axios
              .post('https://kaycad-v2.onrender.com/schooldue/paydue', feeToPay)
              .then((response) => {
                toast.success(response?.data?.msg)
                window.location.reload()
              })
              .catch((error) => {
                toast.error(error?.response?.data?.msg)
                window.location.reload()
              })

            // toast.success(response.data.msg)
          })
          .catch((error) => {
            toast.error(error?.response?.data?.msg)
            window.location.reload()
          })
      })
      .catch((error) => {
        toast.error(error?.response?.data?.msg)
        window.location.reload()
      })
  }

  const displayOptions = () => {
    return (
      <div className="col-lg-9">
        <div className="my-3 p-3 bg-body rounded shadow-sm">
          <h4 className="border-bottom pb-2 mb-0 otherBlue-border">
            Payment Due
          </h4>
          <div className="table-responsive">
            <form>
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th className="p-2" scope="col"></th>
                    <th className="p-2" scope="col">
                      S/N
                    </th>
                    <th className="p-2" scope="col">
                      Level
                    </th>
                    <th className="p-2" scope="col">
                      Session
                    </th>
                    <th className="p-2" scope="col">
                      Payment Name
                    </th>
                    <th className="p-2" scope="col">
                      Amount
                    </th>
                    <th className="p-2" scope="col">
                      Status
                    </th>
                    <th className="p-2" scope="col">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {feeList?.dueFees?.map((fee, index) => {
                    index = index + 1 - 1
                    myId += 1
                    return (
                      <tr key={index}>
                        <td className="p-2">
                          <FcMoneyTransfer />
                        </td>
                        <td className="p-2">{myId}</td>
                        <td className="p-2">
                          {feeList?.feeCategory?.toUpperCase()}
                        </td>
                        <td className="p-2">{feeList?.session}</td>
                        <td className="p-2">{fee?.feeName?.toUpperCase()}</td>
                        <td className="p-2">
                          &#8358;
                          {new Intl.NumberFormat().format(
                            fee?.amount.$numberDecimal,
                          )}
                        </td>
                        <td className="p-2">
                          {payStatus === undefined ? '' : payStatus[index]}
                        </td>
                        <td className="p-2">
                          <button
                            name={JSON.stringify(fee)}
                            // name={course?.paymentId}
                            type="button"
                            className="btn btn-sm btn-success py-1 fw-bold rounded-pill"
                            //onMouseEnter="{getAction}"
                            onClick={payDue}
                          >
                            <GiConfirmed className="me-1" />
                            Pay Now
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <>
        <div className="container p-0">
          {/* Nav Section */}
          <div className="row">
            <div className="bg-white d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-0 border-bottom">
              <h1 className="h4 link-primary">Payment Advice Page</h1>
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
                {displayOptions()}

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
              </div>
            </main>
          </div>
        </div>
        <ToastContainer />
      </>
    </Layout>
  )
}
export default PaymentAdvice
