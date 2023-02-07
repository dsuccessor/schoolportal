import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Aboutus from './pages/Aboutus'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min'
import './pages/dashboard.css'
import './pages/signin.css'
import ProtectedRoute from './pages/ProtectedRoute'
import PublicRoute from './pages/PublicRoute'
import CourseReg from './pages/CourseReg'
import CourseForm from './pages/CourseForm'
import PaymentNotification from './pages/PaymentNotification'
import StudentWallet from './pages/StudentWallet'
import AdminWalletHistory from './pages/AdminWalletHistory'
import AdminPaymentApproval from './pages/AdminPaymentApproval'
import PaymentAdvice from './pages/PaymentAdvice'
import AcademicCalendar from './pages/AcademicCalendar'

import './pages/color.css'

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* <Route path="/" element={<ProtectedRoute> <Layout/></ProtectedRoute>}/> */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="academiccalendar"
            element={
              <ProtectedRoute>
                <AcademicCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="adminpaymentapproval"
            element={
              <ProtectedRoute>
                <AdminPaymentApproval />
              </ProtectedRoute>
            }
          />
          <Route
            path="aboutus"
            element={
              <ProtectedRoute>
                <Aboutus />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="paymentadvice"
            element={
              <ProtectedRoute>
                <PaymentAdvice />
              </ProtectedRoute>
            }
          />
          <Route
            path="coursereg"
            element={
              <ProtectedRoute>
                <CourseReg />
              </ProtectedRoute>
            }
          />
          <Route
            path="adminwallethistory"
            element={
              <ProtectedRoute>
                <AdminWalletHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="courseform"
            element={
              <ProtectedRoute>
                <CourseForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="paymentnotification"
            element={
              <ProtectedRoute>
                <PaymentNotification />
              </ProtectedRoute>
            }
          />
          <Route
            path="studentwallet"
            element={
              <ProtectedRoute>
                <StudentWallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
